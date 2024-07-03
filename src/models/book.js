import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
    code:{
        type: String,
        required: true,
    },
    title:{
        type: String,
        required: true,
    },
    author:{
        type: String,
        required: true,
    },
    stock:{
        type: Number,
        required: true,
    },
    isBorrowed :{
        type: Boolean
    }
})

const Book = mongoose.model('Book', BookSchema);

export default Book;