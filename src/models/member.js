import mongoose from 'mongoose';

const BorrowedBookSchema = new mongoose.Schema({
    bookId: {
      type: String,
    },
    borrowedDate: {
      type: Date,
    },
    dueDate: {
      type: Date,
    },
  });

const MemberSchema = new mongoose.Schema({
    code:{
        type: String,
        required: true,
    },
    name:{
        type: String,
    },
    isPenalized:{
      type: Boolean,
    },
    penalizedUntil:{
        type: Date,
    },
    borrowedBooks: [BorrowedBookSchema],
})

const Member = mongoose.model('Member', MemberSchema);

export default Member;