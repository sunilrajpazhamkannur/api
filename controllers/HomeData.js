
import { getConnection } from '../models/connect.js'

export const ugData =async(req,res)=>{ 
  const conn= await getConnection();
    const sql = `
    SELECT
      CASE
        WHEN course = 'db_bscphysics' THEN 'BSc Physics'
        WHEN course = 'db_bscpsycology' THEN 'BSc Psycology'
        WHEN course = 'db_maths' THEN 'BSc Maths'
        WHEN course = 'db_baenglish' THEN 'BA English'
        WHEN course = 'db_baeconomics' THEN 'BA Economics'
        WHEN course = 'db_bamultimedia' THEN 'BA Multimedia'
        WHEN course = 'db_sociology' THEN 'BA Sociology'
        WHEN course = 'db_bba' THEN 'Bachelor of Business Administration (BBA)'
        WHEN course = 'db_bca' THEN 'Bachelor of Computer Applications(BCA)'
        WHEN course = 'db_bcomcoperation' THEN 'B.com Co-operation'
        WHEN course = 'db_bcomfinance' THEN 'B.Com Finance'
        WHEN course = 'db_computer' THEN 'B.Com Computer Application'
        WHEN course = 'db_bsw' THEN 'Bachelor of Social Work(BSW)'
        ELSE 'Unknown Course'
      END AS custom_course,
      total_admissions
    FROM (
      SELECT 'db_bscphysics' AS course, COUNT(*) AS total_admissions FROM db_bscphysics
      UNION ALL
      SELECT 'db_bscpsycology' AS course, COUNT(*) AS total_admissions FROM db_bscpsycology
      UNION ALL
      SELECT 'db_maths' AS course, COUNT(*) AS total_admissions FROM db_maths

      UNION ALL
      SELECT 'db_baenglish' AS course, COUNT(*) AS total_admissions FROM db_baenglish
      UNION ALL
      SELECT 'db_baeconomics' AS course, COUNT(*) AS total_admissions FROM db_baeconomics
      UNION ALL
      SELECT 'db_bamultimedia' AS course, COUNT(*) AS total_admissions FROM db_bamultimedia
      UNION ALL
      SELECT 'db_sociology' AS course, COUNT(*) AS total_admissions FROM db_sociology
      UNION ALL
      SELECT 'db_bba' AS course, COUNT(*) AS total_admissions FROM db_bba
      UNION ALL
      SELECT 'db_bca' AS course, COUNT(*) AS total_admissions FROM db_bca
      UNION ALL
      SELECT 'db_bcomcoperation' AS course, COUNT(*) AS total_admissions FROM db_bcomcoperation
      UNION ALL
      SELECT 'db_bcomfinance' AS course, COUNT(*) AS total_admissions FROM db_bcomfinance
      UNION ALL
      SELECT 'db_computer' AS course, COUNT(*) AS total_admissions FROM db_computer
      UNION ALL
      SELECT 'db_bsw' AS course, COUNT(*) AS total_admissions FROM db_bsw
      
    ) AS admissions;
  `;
 
  conn.query(sql,(err,result)=>{
    conn.release();
    if(err)return res.status(500).json(err)
    return res.status(200).json(result)

  })
  
}

export const pgData =async(req,res)=>{ 
  const conn= await getConnection();
  const sql = `
  SELECT
      CASE
          WHEN course = 'db_maenglish' THEN 'MA English'
          WHEN course = 'db_mscphysics' THEN 'MSc Physics'
          WHEN course = 'db_mcom' THEN 'Master of Commerce(MCom)'
          WHEN course = 'db_msw' THEN 'Master of Social Work (MSW)'        
          ELSE 'Unknown Course'
      END AS custom_course,
      total_admissions
    FROM (
      SELECT 'db_maenglish' AS course, COUNT(*) AS total_admissions FROM db_maenglish
      UNION ALL
      SELECT 'db_mscphysics' AS course, COUNT(*) AS total_admissions FROM db_mscphysics
      UNION ALL
      SELECT 'db_mcom' AS course, COUNT(*) AS total_admissions FROM db_mcom
      UNION ALL
      SELECT 'db_msw' AS course, COUNT(*) AS total_admissions FROM db_msw      
      
    ) AS admissions;
  `;
 
  conn.query(sql,(err,result)=>{
    conn.release();
    if(err)return res.status(500).json(err)
    return res.status(200).json(result)
  })
}

export const bedData =async(req,res)=>{ 
  const conn= await getConnection();
  const sql = `
  SELECT
      CASE
          WHEN course = 'db_bed' THEN 'Bachelor of Education(BEd)'              
          ELSE 'Unknown Course'
      END AS custom_course,
      total_admissions
    FROM (
      SELECT 'db_bed' AS course, COUNT(*) AS total_admissions FROM db_bed  
    ) AS admissions;
  `;
   
  conn.query(sql,(err,result)=>{
    conn.release();
    if(err)return res.status(500).json(err)
    return res.status(200).json(result)
  })
}

export const hicData =async(req,res)=>{ 
  const conn= await getConnection();
  const sql = `
  SELECT
      CASE
          WHEN course = 'db_health' THEN 'Diploma in Health Inspector'              
          ELSE 'Unknown Course'
      END AS custom_course,
      total_admissions
    FROM (
      SELECT 'db_health' AS course, COUNT(*) AS total_admissions FROM db_health  
    ) AS admissions;
  `;
   
  conn.query(sql,(err,result)=>{
    conn.release();
    if(err)return res.status(500).json(err)
    return res.status(200).json(result)
  })
}

export const emsData =async(req,res)=>{ 
  const conn= await getConnection();
  const sql = `
  SELECT
      CASE
          WHEN course = 'db_school' THEN 'English Medium school'              
          ELSE 'Unknown Course'
      END AS custom_course,
      total_admissions
    FROM (
      SELECT 'db_school' AS course, COUNT(*) AS total_admissions FROM db_school  
    ) AS admissions;
  `;
   
  conn.query(sql,(err,result)=>{
    conn.release();
    if(err)return res.status(500).json(err)
    return res.status(200).json(result)
  })
}

export const ttcData =async(req,res)=>{ 
  const conn= await getConnection();
  const sql = `
  SELECT
      CASE
          WHEN course = 'db_tti' THEN 'Teachers Training Institute'              
          ELSE 'Unknown Course'
      END AS custom_course,
      total_admissions
    FROM (
      SELECT 'db_tti' AS course, COUNT(*) AS total_admissions FROM db_tti  
    ) AS admissions;
  `;
   
  conn.query(sql,(err,result)=>{
    conn.release();
    if(err)return res.status(500).json(err)
    return res.status(200).json(result)
  })

}

export const dayCollection = async (req,res)=>{
 
  const depId=req.query.depId;
  const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in 'YYYY-MM-DD' format
  const sql='SELECT IFNULL(SUM(inv_total), 0) AS total_amount FROM invoice_master_db WHERE depId=? AND inv_date=?'
  
  const conn= await getConnection();
  conn.query(sql,[depId,currentDate],(err,result)=>{
    conn.release();
    if(err) return res.status(500).json(err)   
    return res.status(200).json({Result:result})  

  })
}