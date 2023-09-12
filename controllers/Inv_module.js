//import {con} from '../models/connect.js'
import { getConnection } from '../models/connect.js'
import { getCourseDB } from './getCourseDB.js';

export const  Inv_Register= async (req, res) => { 
  // Retrieve the last invoice number
  const connection = await getConnection(); 

    connection.query('SELECT MAX(invoice_no) AS max_invoice_number FROM invoice_master_db', (error, results) => {
      if (error) {
        connection.release();
        res.status(500).json({ message: 'An error occurred while retrieving the last invoice number.' });
        return;
      }

      const lastInvoiceNumber = results[0]?.max_invoice_number || 0;
      const newInvoiceNumber = lastInvoiceNumber + 1;

      var values=[       
        req.body.depId,
        req.body.courseId,        
        req.body.course,        
        req.body.sname,
        req.body.admno,
        req.body.batch,
        req.body.date,
        req.body.address,
        req.body.phone,
        req.body.email,
        req.body.ftotal,
        req.body.ftax,   
        req.body.fnet,
        0.00];
      
      const  SQL='INSERT INTO invoice_master_db (`invoice_no`, `depId`, `courseId`, `cours_desc`, `student_name`, `adm_no`, `batch`, `inv_date`, `address`, `phone`, `email`, `total_amt`, `tax_amt`, `inv_total`, `tax`) VALUES(?,?)'
      connection.query(SQL,[newInvoiceNumber,values], (error) => {
          if (error) {
           console.error('Error inserting invoice into master table:', error);
            connection.release();
            res.status(500).json({ message: 'An error occurred while inserting the invoice into the master table.' });
            return;
          } 
            const items=req.body.items;
            
            const insertQueries=items.map((data,index)=>{
            const {fname,feeId,particulars, price,batch,adm_no}=data
            return `INSERT INTO invoice_details_db (sno,invoice_no,fee_type,fee_id,description,fee_amt,batch,adm_no) VALUES (${index}, ${newInvoiceNumber}, '${fname}','${feeId}', '${particulars}', ${price}, '${batch}','${adm_no}')`;
             });

            // Join the insert queries using a semicolon (;)
            const joinedQueries = insertQueries.join(';');
         // connection.query(insertQueries.join(';',(error)=>{   

          connection.query(joinedQueries, (error) => {
            connection.release();        
            if(error) {
                  return res.status(500).json({ message: 'An error occurred while inserting data.' });
            }else{              
                  res.status(200).json({ message: 'Data inserted successfully!', invoice: newInvoiceNumber });
            }
          }) 

          connection.release(); 
          
        }
      );
    });  
}

export const Inv_Master=async(req,res)=>{
      const invNo = req.query.invNo;
      const SQL='SELECT * FROM invoice_master_db WHERE invoice_no=?';
      const conn =await getConnection();
      conn.query(SQL,[invNo],(error,result)=>{
        conn.release();
            if(error) {
              return res.status(500).json(error)}
              return res.status(200).json({Result: result})            
      })
}
export const Inv_Details=async(req,res)=>{
    const invNo = req.query.invNo;
      const SQL='SELECT * FROM invoice_details_db WHERE invoice_no=?';
      const conn =await getConnection();
      conn.query(SQL,[invNo],(error,result)=>{
        conn.release();
            if(error) {
              return res.status(500).json(error)
            }
              return res.status(200).json(result)
      })
}

export const Inv_Edit = async(req,res)=>{

  const conn = await getConnection();
  const invNo=req.body.invoice;
  const value1={
        depId: req.body.depId,
        courseId: req.body.courseId,
        cours_desc: req.body.course,
        student_name: req.body.sname,
        adm_no: req.body.admno,
        batch: req.body.batch,
        inv_date: req.body.date,
        address: req.body.address,
        phone: req.body.phone,
        email: req.body.email,
        total_amt: req.body.ftotal,
        tax_amt: req.body.ftax,
        tax:0.00,  
        inv_total:req.body.fnet,  
  };

  const sql1='UPDATE invoice_master_db SET ? WHERE invoice_no=?';  
  
  conn.query(sql1,[value1,invNo],(error)=>{
    if(error){

      return res.status(500).json('error...');
    }
    //delete old record
   const delQuery='DELETE FROM invoice_details_db WHERE invoice_no=?';
   conn.query(delQuery,[invNo],(err)=>{
      if(err){
        console.log(err);
      }else{ 
        //insert record...          
                  const items=req.body.items;
                  const insertQueries=items.map((data,index)=>{
                  const {fname,feeId,particulars, price,batch,adm_no}=data
                  return `INSERT INTO invoice_details_db (sno,invoice_no, fee_type,fee_id,description, fee_amt,batch,adm_no) VALUES (${index}, ${invNo}, '${fname}','${feeId}', '${particulars}', ${price},'${batch}','${adm_no}')`;  
                });

                  const joinedQueries = insertQueries.join(';');
                  conn.query(joinedQueries, (error, results) => {
                    if (error) {
                      conn.release();
                      console.error('Error executing queries:', error);
                    } else {
                      conn.release();
                      res.status(200).json({ message: 'Data updated successfully!' });                    
                    }
                  });
          }
       })
  })
}

export const getBalanceByfeeId =async (req,res)=>{
  const batchId=req.query.batch_id
  const adm_no=req.query.adm_no;
  
    const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in 'YYYY-MM-DD' format
    const conn =  await getConnection();  
   
    const query = `
    SELECT fs.fee_id,fs.fee_head,fs.fee_amt AS fee_amount, 
    IFNULL(SUM(fp.fee_amt), 0) AS total_payment,
    IFNULL(SUM(d.con_amt), 0) AS total_discount,
    (fs.fee_amt - IFNULL(SUM(fp.fee_amt), 0)-IFNULL(SUM(d.con_amt), 0)) AS total_balance
    FROM fee_structure_head fs
    LEFT JOIN invoice_details_db fp ON fs.fee_id = fp.fee_id AND fs.batch_id=fp.batch AND fp.adm_no='${adm_no}'
    LEFT JOIN fee_concession_db AS d ON d.adm_no='${adm_no}' AND d.batch_id='${batchId}' AND fs.fee_id=d.fee_id
    WHERE fs.beg_date <= '${currentDate}' AND fs.batch_id='${batchId}' 
    GROUP BY fs.fee_head,fs.batch_id,fs.fee_amt,fs.fee_id
   `;

     conn.query(query,(err,result)=>{
      conn.release();
      if(err) {
        return res.status(500).json(err)
        }
        return res.status(200).json(result)
     })
}
 
export const AccountBalance = async (req,res)=>{

  const batchId=req.query.batch_id
  const adm_no=req.query.adm_no;  
  const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in 'YYYY-MM-DD' format
  const conn =  await getConnection();
  
    const query = `
    SELECT 
    IFNULL(SUM(fs.fee_amt),0) AS total_fee_amount, 
    COALESCE(SUM(p.fee_amt), 0) AS total_payment,
    IFNULL(SUM(d.con_amt),0) AS total_discount,
    (IFNULL(SUM(fs.fee_amt),0) - COALESCE(SUM(p.fee_amt), 0)-IFNULL(SUM(d.con_amt),0)) AS total_balance
    FROM fee_structure_head fs
    RIGHT JOIN invoice_details_db p ON fs.batch_id=p.batch
    LEFT JOIN fee_concession_db AS d ON d.adm_no='${adm_no}' AND d.batch_id='${batchId}' 
    WHERE fs.beg_date <= '${currentDate}' AND fs.batch_id='${batchId}' AND p.adm_no='${adm_no}' `;

     conn.query(query,(err,result)=>{
      conn.release();
      if(err) {
        console.log(err);
        return res.status(500).json(err)
      }
        return res.status(200).json(result)
     })
} 

export const studentDuesByDepartment = async(req,res)=>{
  const uInfo=req.query  
  const db=await getCourseDB(uInfo.depId,uInfo.subId)  
  const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in 'YYYY-MM-DD' format
  const conn =  await getConnection();

  const query = `
  SELECT
    s.batchId,
    s.admNo,
    s.capId,
    s.name, 
    IFNULL(fs.fee_amount, 0) AS total_fee_amount,
    IFNULL(SUM(p.fee_amt), 0) AS total_paid_amount,
    IFNULL(d.fee_discount, 0) AS total_discount,     
    (IFNULL(fs.fee_amount, 0) - IFNULL(SUM(p.fee_amt), 0) - IFNULL(d.fee_discount, 0)) AS balance
  FROM ${db} AS s
  LEFT JOIN (
    SELECT batch_id, SUM(fee_amt) AS fee_amount
    FROM fee_structure_head 
    WHERE beg_date <= '${currentDate}'
    GROUP BY batch_id
  ) AS fs ON s.batchId = fs.batch_id 
  LEFT JOIN invoice_details_db AS p ON s.admNo = p.adm_no AND s.batchId = p.batch
  LEFT JOIN (
    SELECT adm_no, batch_id, SUM(con_amt) AS fee_discount 
    FROM fee_concession_db 
    GROUP BY adm_no, batch_id
  ) AS d ON s.admNo = d.adm_no AND s.batchId = d.batch_id
  GROUP BY s.batchId, s.admNo,s.capId,s.name,fs.fee_amount, d.fee_discount
`;

conn.query(query,(error,result)=>{  
  conn.release();
  if(error) {
    console.log(error);
    return res.status(500).json(error)
  } 
    return res.status(200).json(result)    
  })
}

export const receiptBetweenDates = async (req,res)=>{
  const dtFrom =req.query.dtFrom;
  const dtTo=req.query.dtTo;
  const depId=req.query.depId;
  const conn= await getConnection() 
  const sql='SELECT * FROM invoice_master_db WHERE inv_date >= ? AND inv_date <= ? AND depId=? ORDER BY inv_date,invoice_no'

  conn.query(sql,[dtFrom,dtTo,depId],(err,result)=>{
    conn.release();
    if(err) {
   
      return res.status(500).json(err)
    }  
    return res.status(200).json(result)
  })
}

