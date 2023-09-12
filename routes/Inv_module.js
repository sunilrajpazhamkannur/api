import express from "express";
import { Inv_Register, Inv_Edit, Inv_Master, Inv_Details,getBalanceByfeeId,AccountBalance,
    studentDuesByDepartment,receiptBetweenDates } from "../controllers/Inv_module.js";
const router =express.Router();


router.post('/register',Inv_Register);
router.put('/edit',Inv_Edit);
router.get('/master',Inv_Master)
router.get('/details',Inv_Details)
router.get('/blsbyid',getBalanceByfeeId)
router.get('/blsac',AccountBalance) //Account Balance
router.get('/duesbyid',studentDuesByDepartment) //All Student dues by department id 
router.get('/rcptbydt',receiptBetweenDates)  //receipt between dates


export default router;