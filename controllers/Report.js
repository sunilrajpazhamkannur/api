import { getConnection } from '../models/connect.js'

export const inv_Report=async (req,res)=>{
    const depId=req.body.depId;
    const id=req.body.courseId;
 
    const SQL="SELECT * FROM invoice_master_db WHERE (depId=? AND courseId =?) AND (adm_no LIKE ? OR student_name LIKE ?) ORDER BY invoice_no, inv_date"
    const searchText = '%' + req.body.sTex + '%';
    const conn = await getConnection();
    conn.query(SQL,[depId,id,searchText,searchText],(error,result)=>{
      conn.release();
        if(error) {
            return res.status(500).json('Error')}
        {
            return res.status(200).json(result)}
    })
} 

export const Inv_Details =async (req,res)=>{
    const invNo=req.query.invNo
    const sql='SELECT * FROM invoice_details_db WHERE invoice_no=?';
    const conn = await getConnection();
    conn.query(sql,[invNo],(error,result)=>{
      conn.release();
      if(error) {
        console.log(error);
      }
      return res.status(200).json(result)
    })
}




