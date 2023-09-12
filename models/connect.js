import mysql from 'mysql2';
//import mysql from 'mysql2/promise';

export const con = mysql.createConnection({
    host:'localhost',
    user:'root',
    database:'svpkdb',
    password:'MYSQL2023@',
    multipleStatements:true    

})

// Create a connection pool
export const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    database:'svpkdb',
    password:'MYSQL2023@',
    multipleStatements:true,
    waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Export an arrow function that gets a connection from the pool
export const getConnection = () =>
  new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        resolve(connection);
      }
    });
  });