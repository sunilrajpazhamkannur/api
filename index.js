import express from "express";
import cors from  'cors';
import cookieParser from "cookie-parser";
import authPath from './routes/Auth.js'
import regPath from './routes/Register.js'
import searchPath from './routes/Search.js'
import invPath from './routes/Inv_module.js'
import rptPath from './routes/Report.js'
import homePath from './routes/HomeData.js'
const app=express();
//const  PORT= process.env.PORT || 8100;
const hostname = 'localhost';
const PORT = 8100;

app.use(cors({
  origin:["http://localhost:5173"],
  methods:["POST", "GET", "PUT"],
  credentials:true

}));
app.use(cookieParser());
app.use(express.json());

app.use('/',authPath);
app.use('/api',regPath);
app.use('/search',searchPath)
app.use('/inv',invPath)
app.use('/rpt',rptPath);
app.use('/home',homePath);

app.listen(PORT,hostname,()=>{
  console.log('API Running.....');
  console.log(`Server running at http://${hostname}:${PORT}/`);
});