
import jwt from 'jsonwebtoken'
const secretKey = 'jwt-secret-key'; 
/*
  const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = req.cookies.token
  //const token = authHeader && authHeader.split(' ')[1]; // Extract token from Authorization header
   // console.log('token222',token);
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      console.log('Failed to authenticate token');
      return res.status(403).json({message: 'Failed to authenticate token' });
    }
    //req.user = user; // Attach the decoded user information to the request object
    next();
  });
};

*/

export const CheckAuth=(req,res,next)=>{
  const token = req.cookies.token;
  //const token = req.headers.authorization;
  //const token = req.cookies.token
  if (!token) {
    return res.status(401).json({ message: "No token found" });
  }

  // Extract the token from the "Bearer" scheme
  const extractedToken = token.split(" ")[1];

  
  jwt.verify(extractedToken, secretKey, (err,decodedToken) => {
    if (err) {
      res.status(401).json({ message: "Invalid token" });
    }
    //req.user = user; // Attach the decoded user information to the request object
    req.user = decodedToken;
    next();
  });

}

export default CheckAuth