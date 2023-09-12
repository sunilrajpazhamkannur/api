import express from "express";
const router=express.Router();
import {ugData,pgData,bedData,emsData,hicData,ttcData,dayCollection} from '../controllers/HomeData.js';

router.get('/ugdata',ugData);
router.get('/pgdata',pgData);
router.get('/beddata',bedData);
router.get('/hicdata',hicData);
router.get('/emsdata',emsData);
router.get('/ttcdata',ttcData);

router.get('/dayamt',dayCollection)

export default router;
