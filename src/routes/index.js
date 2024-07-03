import express from 'express';
const router = express.Router();

import sampleController  from '../controllers/bookController.js';

router.post('/books/borrow', sampleController.borrow);
router.post('/books/return', sampleController.returnBook);
router.get('/books/available', sampleController.bookCheck);
router.get('/members', sampleController.memberCheck);

export default{
    router
}