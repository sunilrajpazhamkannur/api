/*
export function getCourseDB(depId,id,callback){
    

        var db=null;
        
       // const id=id1+'';
        console.log('now',typeof depId, typeof id);
        console.log(depId,id);
        if(depId=="100"){ 
            console.log('hi...');           
                if (id=='1000'){db='db_bscphysics' }
                else if(id=='1001'){db='db_bscpsycology'}
                else if(id==='1002'){db='db_maths'}
                else if(id=="1003"){db='db_baenglish'}
                else if(id=="1004"){db='db_baeconomics'}
                else if(id=="1005"){db='db_bamultimedia'}
                else if(id=="1006"){db='db_sociology'}
                else if(id=="1007"){db='db_bba'}
                else if(id=="1008"){db='db_bca'}
                else if(id=="1009"){db='db_bcomcoperation'}
                else if(id=="1010"){db='db_bcomfinance'}
                else if(id=="1011"){db='db_computer'}
                else if(id=="1012"){db='db_bsw'}                
        }else if(depId=='101')     {
                if (id=="2000"){db='db_maenglish' }
                else if(id=="2001"){db='db_mscphysics'}
                else if(id=="2002"){db='db_mcom'}
                else if(id=="2003"){db='db_msw'}   
        }else if(depId=='102') {
                if (id=="3000"){db='db_health' }
        }else if(depId=='103') {
                if (id=="4000"){db='db_tti' }
        }else if(depId=='104') {
                if (id=="5000"){db='db_bed' }    
        }else if(depId=='105') {
                if (id=="6000"){db='db_school' }
        }
        
        if (db !== null) {
          //  console.log('Found matching db:', db);
            callback(null,db )
        
        
          }
   
}
*/

export function getCourseDB(depId,id){
        return new Promise((resolve)=>{
                var db=null;
        
                 if(depId=="100"){                               
                         if (id=='1000'){db='db_bscphysics' }
                         else if(id=='1001'){db='db_bscpsycology'}
                         else if(id==='1002'){db='db_maths'}
                         else if(id=="1003"){db='db_baenglish'}
                         else if(id=="1004"){db='db_baeconomics'}
                         else if(id=="1005"){db='db_bamultimedia'}
                         else if(id=="1006"){db='db_sociology'}
                         else if(id=="1007"){db='db_bba'}
                         else if(id=="1008"){db='db_bca'}
                         else if(id=="1009"){db='db_bcomcoperation'}
                         else if(id=="1010"){db='db_bcomfinance'}
                         else if(id=="1011"){db='db_computer'}
                         else if(id=="1012"){db='db_bsw'}                
                 }else if(depId=='101')     {
                         if (id=="2000"){db='db_maenglish' }
                         else if(id=="2001"){db='db_mscphysics'}
                         else if(id=="2002"){db='db_mcom'}
                         else if(id=="2003"){db='db_msw'}   
                 }else if(depId=='102') {
                         if (id=="3000"){db='db_health' }
                 }else if(depId=='103') {
                         if (id=="4000"){db='db_tti' }
                 }else if(depId=='104') {
                         if (id=="5000"){db='db_bed' }    
                 }else if(depId=='105') {
                         if (id=="6000"){db='db_school' }
                 }
                 if (db !== null) {
                        //  console.log('Found matching db:', db);
                          resolve (db)
                        }

        })
    }

