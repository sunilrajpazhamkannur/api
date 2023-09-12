import express from 'express';
const router=express.Router();
import {adminLogin,departmentLogin,getUserList,UserRegister,logOut} from '../controllers/Auth.js'
import verifyUser from '../controllers/CheckAuth.js'


router.post('/login/',adminLogin);
router.post('/deplogin/',departmentLogin);
router.post('/logout/',logOut);
//----USER-----
router.get('/getuser',getUserList)
router.post('/reguser',UserRegister)

export default router;