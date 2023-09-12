
//import {con} from '../models/connect.js';
import { getConnection } from '../models/connect.js'
import {getCourseDB} from './getCourseDB.js'
import { nanoid } from 'nanoid' 
import jwt from 'jsonwebtoken';

export const register =async (req,res)=>{    
    const id=req.body.courseId
    const depId=req.body.dep_id   
    var db=await getCourseDB(depId,id);
    console.log('current table:',db);
    const sql='INSERT INTO ' + db +' (batchId,admNo,capId,admDate,admType,adharNo,name,dob,sex,email,phone,parent,zip,address,depId,courseId,accept) VALUES (?)';

    var values=[
        req.body.cmbBatch,
        req.body.regno,        
        req.body.capId,
        req.body.rgdate,
        req.body.adtype,
        req.body.adhar,
        req.body.name,
        req.body.dob,
        req.body.sex,
        req.body.email,
        req.body.phone,
        req.body.pname,
        req.body.zip,
        req.body.address,
        req.body.dep_id,
        req.body.courseId,
        req.body.check1
      ];

      const conn = await getConnection()
      
      conn.query(sql,[values],(err,rows)=>{
        conn.release();
        if(!err)
        {  return res.status(200).json({Status:"OK",Message:"Record has been created"})
        }
        else
        {   
           //console.log(err);
            const q="ERROR! Adm.No: " + req.body.regno  + " already exist!"
            if(err.code=== 'ER_DUP_ENTRY')return res.status(500).json({Status:"ERR",Message:q}) 
            return res.status(500).json({Status:"ERR",Message:"ERROR! error accured!!"})
        }
      })
}
export const studentList = async (req,res)=>{    
    
    const requestData = req.query;
    const id= requestData.courseId
    const depId=requestData.depId
    //---GET DB INFO------   
    const db = await getCourseDB(depId,id)

    const SQL='SELECT * FROM '+ db + ' ORDER BY name,admNo'
    const conn = await getConnection();
    conn.query(SQL,(err,rows)=>{
        conn.release();
       if(err)return res.status(500).json(err)      
       return res.status(200).json(rows)
    })
}

export const updateRegister= async (req,res)=>{
    const admNo= req.params.id
    const depId= req.body.depId
    const subId=req.body.courseId
    var db= await getCourseDB(depId,subId);
    const values=req.body 
    const conn =await getConnection();      
    const SQl='UPDATE '+ db +' SET ? WHERE admNo=?';   
    conn.query(SQl,[values,admNo],(err,rows)=>{
        conn.release();
        if(err)
        {   return res.status(500).json(err)};
            return res.json({Status: "Success"})
    })
}

export const getRegister=async (req,res)=>{       
    const id=req.query.Id;
    const subId=req.query.subId;
    const depId=req.query.depId;
    
    const db= await getCourseDB(depId,subId)
  
    const conn= await getConnection();
    const sql='SELECT * FROM '+ db +' WHERE admNo=?';
    conn.query(sql,[id],(err,result)=>{
        conn.release();
        if(err){          
            return res.status(500).json(err)
        };            
        return res.status(200).json({Result: result})
        })
    }

//---DEPARTMENT----
export const getDepartment= async(req,res)=>{
    const SQL='SELECT * FROM Department_db ORDER BY DepId'
    const conn =await getConnection();
    conn.query(SQL,(err,rows)=>{
        conn.release();
       // console.log(rows)
        if(err)return res.json(err)
        return res.status(200).json(rows)
        
    })
}

export const getDepInfo=async (req,res)=>{
    const id= req.params.id
    var db=getDepaertment(id);
    const conn = await getConnection();
    const SQL="SELECT * FROM "+ db +" ORDER BY id"
    conn.query(SQL,(err,rows)=>{ 
        conn.release();      
        if(err)return res.json(err)
        return res.status(200).json(rows)
    })
}
//---BATCH------
export  const registerBatch = async (req,res)=>{
    const SQL='INSERT INTO Batch_db (batch_id,course_id,dtFrom,dtTo,name,dep_id) VALUES (?)';
    const values=[
        req.body.bname,
        req.body.cmbcrs,        
        req.body.dt1,
        req.body.dt2,
        req.body.name2,
        req.body.depid
    ]
    const conn =await getConnection();    
    conn.query(SQL,[values],(err,rows)=>{
        conn.release();
        if(err) {
            const q="Error! Batch.No: " + req.body.bname  + " Duplicate data found. Aborting insertion."
            if(err.code=== 'ER_DUP_ENTRY')return res.json({Result:'DUP', Message: q}) 
            return res.json({Result:'ERR',Message: "ERROR! error accured!!"})
        }
            return res.status(200).json({Result:'SAVED',Message: "Record has been created!"})        
    })
}
export const batchList= async (req,res)=>{
    const id=req.params.id
    const SQL='SELECT * FROM Batch_db WHERE dep_id=? ORDER BY course_id,batch_id';
    const conn = await getConnection();
    conn.query(SQL,[id],(err,rows)=>{
        conn.release();
        if(err){
            //console.log(err);
            return res.status(500).json(err)
        }
        return res.status(200).json(rows)
    })
}
export const batchEdit=(req,res)=>{
    res.send('inside batch Edit....')
}

export const batchByCourse= async (req,res)=>{
    const id=req.params.id
    const SQL='SELECT * FROM Batch_db WHERE course_id=? ORDER BY batch_id ';
    const conn =await getConnection();
    conn.query(SQL,[id],(err,rows)=>{
        conn.release();
        if(err){
            return res.status(500).json(err)
        }
            return res.status(200).json(rows)
    })
}

export const getStudentByBatch=async (req,res)=>{
    const id=req.query.courseId
    const depId =req.query.depId;
    const batch=req.query.batchId;
    
    const db=await getCourseDB(depId,id);
    const conn =await getConnection();
    const SQL='SELECT * FROM '+ db +' WHERE batchId=? ORDER BY admNo,name';
    conn.query(SQL,[batch],(err,rows)=>{
        conn.release();
        if(err){
            return res.status(500).json(err)
        }
        return res.status(200).json(rows)
    })
}

//----FEE--------
export const getFee= async (req,res)=>{
    const SQL='SELECT * FROM fee_head order by Id';
    const conn = await getConnection();
    conn.query(SQL,(err,rows)=>{
        conn.release();
        if(err) {
            return res.status(500).json(err)}
            return res.status(200).json(rows)
    })
}

export const feeheadByBatch= async (req,res)=>{
    const id=req.query.batch_id;
    const conn = await getConnection();
    const SQL='SELECT fee_head,fee_id,fee_amt FROM fee_structure_head WHERE batch_id=? order by fee_head';
    conn.query(SQL,[id],(err,rows)=>{
        conn.release();
        if(err) {
            return res.status(500).json(err)}
            return res.status(200).json(rows)
    })
}

export const registerFees = async (req, res) => {   
    
    var id = nanoid() //=> "V1StGXR8_Z5jdHi6B-myT"
    const data=[
        id,
        req.body.depId,
        req.body.cmbBatch,
        req.body.course,
        req.body.dt1,
        req.body.dt2,        
        req.body.feeId,
        req.body.fhead,
        req.body.amt,
    ]
    const conn = await getConnection();  
    checkForDuplicates(req.body.cmbBatch,req.body.feeId,(isDuplicate)=>{        
        if (isDuplicate) {
            
            conn.release();
            return res.json({Result:'DUP',Message:'Duplicate data found. Aborting insertion.'} );
          } else {           
            const  insertQuery=`INSERT INTO fee_structure_head (id,dep_id,batch_id,course,beg_date,end_date,fee_id,fee_head,fee_amt) VALUES(?)`        
            conn.query(insertQuery,[data],(err,rows)=>{
            conn.release();
            if(err) return res.json({Result:'ERR', Message: 'An error occurred'});
            return res.status(200).json({Result: 'SAVED', Message:'Data inserted successfully'});
          })
        }
    })
}

 async function checkForDuplicates(batch_id,fee_id,callback) {
    const sql = `SELECT COUNT(*) AS count FROM fee_structure_head WHERE  batch_id=? AND fee_id=?`;
    const conn = await getConnection();
    conn.query(sql,[batch_id,fee_id],(err,rows)=>{  
        conn.release();
        const count = rows[0].count
        const isDuplicate = count > 0; 
        
        callback(isDuplicate);
    })
 }

 export const getFeeDetails= async (req,res)=>{  
    const id=req.params.id
    const SQL='SELECT * FROM fee_structure_head WHERE dep_id=? ORDER BY batch_id';
    const conn = await getConnection();
    conn.query(SQL,[id],(err,rows)=>{
        conn.release();
        if(err) {            
            return res.status(500).json(err)}
            return res.status(200).json(rows)
    })
}
// FEE-CONCESSION :-----

export const regConcession = async(req,res)=>{
    var id = nanoid() //=> "V1StGXR8_Z5jdHi6B-myT"

    const values=[
        id,
        req.body.depid,
        req.body.cmbDep,
        req.body.subid,
        req.body.cmbSub,
        req.body.cmbBatch,
        req.body.admno,
        req.body.name,
        req.body.feeid,
        req.body.fhead,
        req.body.disamt,
        req.body.note
    ]
    const conn = await getConnection();
    const sql='INSERT INTO fee_concession_db (id,dep_id, dep_name, course_id, course_name, batch_id, adm_no, adm_name, fee_id, fee_head, con_amt, remark) VALUES(?)';
            conn.query(sql,[values],(err,result)=>{
                conn.release();
                if(err) {
                    return res.status(500).json(err)}
                return(res.status(200).json({Result:'Sucess'}))
            })
        }   

export const getdisc= async(req,res) =>{
    const id=req.query.id  
   const conn = await getConnection();
    const sql='SELECT * FROM fee_concession_db WHERE dep_id=? ORDER BY adm_no,adm_name,batch_id,fee_head';
    conn.query(sql,[id],(err,result)=>{
        conn.release();
        if(err) {          
            return res.status(500).json(err)}
        return res.status(200).json(result)
        })    
    }
//GET EDIT FEE CONCESSION INFO
export const getEdtConcessionInfo = async(req,res)=>{
    const id=req.query.id;
    console.log(id);
    const conn =await getConnection();
    const sql='SELECT * FROM fee_concession_db WHERE id=?';
    conn.query(sql,[id],(err,result)=>{
        conn.release();
        if(err){
            console.log(err);
            return res.status(500).json(err)            
        }
        console.log(result);
        return res.status(200).json({Result:result})
    })
}
export const EditConcesson =(req,res)=>{
    
}


const getDepaertment=(id)=>{
    var db='';
    if (id==="100"){db='dep_ug'}
    else if(id==="101"){db='dep_pg'}
    else if(id==="102"){db='dep_health'}
    else if(id==="103"){db='dep_tti'}
    else if(id==="104"){db='dep_bed'}
    else if(id==="105"){db='dep_english'}
    
    return db;
}

/*
[{"Version":"1.1",
"TranDtls":{"TaxSch":"GST","SupTyp":"B2B","RegRev":"N","IgstOnIntra":"N"},
"DocDtls":{"Typ":"INV","No":"MNR-1123","Dt":"03/08/2023"},
"SellerDtls":{"Gstin":"32AADFM8349M1ZX","LglNm":"MINAR STEELS","Addr1":"4/1,Near Precotmills, Kanjikode West, Palakkad. - 9447769541","Addr2":null,"Loc":"Kanjikode","Pin":678623,"Stcd":"32"},
"BuyerDtls":{"Gstin":"32AMUPN8323P1Z9","LglNm":"C.T STEELS - KALIKKAVU","Pos":"32","Addr1":"KARUVARAKKUNDU ROAD, KALIKKAVU- MALAPPURAM DT, 04931-311398, 9446568414","Addr2":null,"Loc":"KALIKAVU","Pin":676525,"Stcd":"32"},
"ItemList":[{"SlNo":"1","PrdDesc":"Ms Bars & Rods","IsServc":"N","HsnCd":"72142010","Qty":1,"FreeQty":0,"Unit":"MTS","UnitPrice":46875,"TotAmt":46875,"Discount":0,"AssAmt":46875,"GstRt":28,"IgstAmt":0,"CgstAmt":6562.50,"SgstAmt":6562.50,"CesRt":0,"CesAmt":0,"CesNonAdvlAmt":0,"TotItemVal":60000}],
"ValDtls":{"AssVal":46875,"CgstVal":6562.50,"SgstVal":6562.50,"IgstVal":0,"CesVal":0,"Discount":0,"OthChrg":0,"RndOffAmt":0,"TotInvVal":60000},
"EwbDtls":{"TransId":null,"TransName":null,"TransMode":"1","Distance":100,"TransDocNo":null,"TransDocDt":null,"VehNo":"KL09XXXX","VehType":"R"}
},
    
]
*/