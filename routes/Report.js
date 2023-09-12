import express from 'express'
const router =express.Router();
import { inv_Report,Inv_Details } from '../controllers/Report.js';

router.post('/invoice',inv_Report)
router.get('/rcptfee',Inv_Details)


export default router