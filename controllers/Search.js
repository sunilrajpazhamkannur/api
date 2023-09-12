//import {con} from '../models/connect.js';
import {getCourseDB} from './getCourseDB.js' 
import { getConnection } from '../models/connect.js';

export const stdentByDep= async (req,res)=>{
    
    const depId=req.body.depId;
    const id=req.body.courseId;
    const sTex=req.body.sText;
    var db= await getCourseDB(depId,id);
    const conn = await getConnection();
    const SQL="SELECT * FROM " + db + " WHERE admNo LIKE '" + sTex + "%' OR name LIKE '" + sTex + "%'";
    
    conn.query(SQL,(err,result)=>{
        conn.release();
    
    if(err) return res.status(500).json(err)    
    return res.status(200).json(result)
   })

}
