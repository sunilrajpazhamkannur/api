import express from 'express';
import {register,studentList,updateRegister,
    getRegister,getDepartment,
    getDepInfo,registerBatch,
    batchList,batchEdit,getFee,registerFees,getFeeDetails,
    batchByCourse,getStudentByBatch,feeheadByBatch,
    regConcession,getdisc,getEdtConcessionInfo,EditConcesson} from '../controllers/Register.js'

    const router =express.Router();
 import verifyUser from '../controllers/CheckAuth.js'   

    

router.post('/register/',register)
router.get('/list',studentList)
router.put('/regedit/:id',updateRegister)
router.get('/getinfo',getRegister)
router.get('/getdepartment/',getDepartment)
router.get('/depinfo/:id',getDepInfo) //reading departments database info
// ---BATCH------
router.post('/rgbatch/',registerBatch) // register new Batch
router.get('/blist/:id',batchList) //batch list 
router.get('/bedit/:id',batchEdit) //batch Edit 
router.get('/bcourse/:id',batchByCourse) //batch list 
router.get('/admbyid/',getStudentByBatch) //get Student details by batch 
//----FEE-------
router.get('/getfee/',getFee)
router.post('/regfee/',registerFees)
router.get('/getfs/:id',getFeeDetails)
router.get('/getfh/',feeheadByBatch) //get fee-head in invoiceForm
//-----FEE CONCESSION-----
router.post('/regndis/',regConcession);
router.get('/getdisc/',getdisc);
router.get('/getdisinfo/',getEdtConcessionInfo); //get concession information for edit
router.put('/edtdisc',EditConcesson); //edit concession
    


export default router;