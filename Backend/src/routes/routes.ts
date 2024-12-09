import express from 'express';
import { bookController } from '../controllers/bookController';
const router = express.Router();
import upload from '../utils/multer';

router.post('/addBook', upload.single('image'), bookController.addBook);
router.delete('/book/:id', bookController.deleteBook)
router.get('/books', bookController.fetchBooks);
router.get('/book/:id', bookController.singleBook);
router.put('/book/:id', upload.single('image'), bookController.updateBook)
router.get('/search', bookController.search)

export { router }