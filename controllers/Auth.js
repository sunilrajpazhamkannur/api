import {con} from '../models/connect.js'
import { getConnection } from '../models/connect.js'
import bcript from 'bcrypt'
import { nanoid } from 'nanoid' 
import jwt from 'jsonwebtoken'


//---LOGIN----
export const adminLogin = async(req,res)=>{
    const sql='SELECT * FROM user_admin WHERE username=? and password=?';
    const conn= await getConnection();
        conn.query(sql,[req.body.email,req.body.password],(err,result)=>{
          conn.release();
        if(err)return res.json({status:500,Error: "sql Error"});
        if  (result.length>0){     
     
            const id=result[0].username       
            const token=jwt.sign({id},'jwt-secret-key',{expiresIn:'12h'})            
            res.cookie('token',token,{ httpOnly: true, secure: true })        
            return res.json({auth:true,role: 'admin',login: result[0].username, token:token});            
        }else{         
            return res.json({auth:false,message: "Invalid Credentials"});
        }
    })  
}

export const departmentLogin = async (req,res)=>{

    const email=req.body.email;
    const pwd=req.body.password;
    const depId=req.body.depId
    const conn =await getConnection();
    const sql='SELECT * FROM user_db WHERE username=? and depId=?';
        conn.query(sql,[email,depId],(err,result)=>{
        conn.release();
        if(err){      
          return res.json({auth:false,message:"Invalid Credentials"});}
        
          if  (result.length>0){                  
                bcript.compare(pwd,result[0].password,(Error,response)=>{
                if(Error){                                   
                    return res.json({auth:false,message:"Invalid Credentials"})
                }else if (response){
                    const id=result[0].id
                    const token=jwt.sign({id},"jwt-secret-key",{expiresIn:'1h'})
                    res.cookie('token',token,{ httpOnly: true, secure: true })
                    
                    return res.json({auth: true,token:token,role:result[0].usertype, result:result});
                }else{
                    return res.json({auth:false,message:"Invalid Credentials"} );
                }
            })            
        }else{                
              return res.json({auth:false,message:"Invalid Credentials"});
              }
           })  
      }

// USERS-----
export const getUserList = async(req,res)=>{
    const SQL ='SELECT * FROM user_db ORDER BY depId,userType';
    const conn =await getConnection();
    conn.query(SQL,(err,rows)=>{
      conn.release();
        if(err) return res.status(500).json(err)
        return res.status(200).json(rows)
    })    
}

export const logOut=(req,res)=>{
    res.clearCookie('token');
    
    return res.json({state:"Sucess" });
}

export const UserRegister = async(req,res)=>{
 
  const Query = 'SELECT COUNT(*) AS count FROM user_db WHERE username=?';
  const email = [req.body.email];
  const conn =await getConnection();
  conn.query(Query, email, (Error, Results) => {
  
  if (Error) {
    conn.release();
    //console.error('An error occurred:', checkError.message); 
    res.json('An error occurred:', checkError.message) 
    res.json({Result:'ERR',Message:Error.message})
    return;
  }

  const count = Results[0].count;

  if (count > 0) {
    conn.release();
    console.error('Duplicate entry error: Email already exists');
    res.json({Result:'DUP',Message:'Duplicate entry error: Email already exists'})
    
    return;
  }
    
  const id = nanoid() //=> "V1StGXR8_Z5jdHi6B-myT"
  var type=0
  if(req.body.options==='admin')  {type=1 }
  else{ type=0}

  const insertQuery = 'INSERT INTO user_db (username,password,depId,depName,usertype,id) VALUES (?)';
  bcript.hash(req.body.pwd1.toString(),10,(err,hash)=>{
    if(err){           
            console.error(err)        
    }else{
       //console.log(hash);
        const values=[
            req.body.email,
            hash,
            req.body.depId,
            req.body.depName,
            type,
            id
        ]
      conn.query(insertQuery, [values], (Error, Results) => {
        conn.release();
        if (Error) {
          console.error('An error occurred:', Error.message);
          res.json({Result:'ERR',Message: Error.message})
        } else {
          //console.log('New user inserted successfully!');
          res.status(200).json({Result:'SAVED',Message: 'New user inserted successfully!'})
        }
     
      });

    }
  } )
 
}); 
}
