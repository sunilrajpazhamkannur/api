import express from 'express';
import {stdentByDep} from '../controllers/Search.js';
const router= express.Router();

router.post('/student',stdentByDep)


export default router;