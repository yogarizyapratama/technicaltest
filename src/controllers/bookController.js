import Member from "../models/member.js";
import Book from "../models/book.js";
import { throwErr } from "../utils/index.js";
import moment from "moment";

const borrow = async (req, res, next) => {
  try {
    const { memberCode, bookCode } = req.body;

    const member = await Member.findOne({ code: memberCode });
    if (!member) throwErr(404, 'Member not found');

    if (member.isPenalized){
      let currentDate = moment().format('YYYY-MM-DD')
      if (!moment(currentDate).isAfter(moment(member.penalizedUntil).format('YYYY-MM-DD'))) throwErr(403, 'You are penalized and cannot borrow any books'); 
    }

    if (member.borrowedBooks && member.borrowedBooks.length >= 2) throwErr(412, 'You are already borrowing 2 books');

    const book = await Book.findOne({ code: bookCode });
    
    const membersBook = member.borrowedBooks?.find(item => item.bookId.toString() === book._id.toString());
    if(membersBook) throwErr(412, 'You have already borrowed this book');

    if(book.stock < 1) throwErr(412, 'Not enough stock')

    member.borrowedBooks.push({
      bookId: book._id,
      borrowedDate: new Date(),
    });

    await member.save();

    book.stock -= 1;
    book.isBorrowed = true
    await book.save();

    res.status(200).json({
      message: `You borrowed ${book.title}`,
    });

  } catch (error) {
    next(error);
  }
};

const returnBook = async (req, res, next) => {
  try {
    const { memberCode, bookCode } = req.body;

    const book = await Book.findOne({ code: bookCode });
    if (!book) throwErr(404, 'Book not found');

    const member = await Member.findOne({ code: memberCode });
    if (!member) throwErr(404, 'Member not found');
    
    const borrowedBook = member.borrowedBooks.find(item => item.bookId.toString() === book.code);
    if (!borrowedBook) throwErr(404, 'Member did not borrow this book');

    const currentDate = moment().format('YYYY-MM-DD');
    const borrowedDate = moment(borrowedBook.borrowedDate).format('YYYY-MM-DD');
    const next7days = moment(borrowedDate).add(7, 'days').format('YYYY-MM-DD');

    if (moment(currentDate).isAfter(next7days)) {
      member.penalizedUntil = moment().add(3, 'days').format('YYYY-MM-DD')
      member.isPenalized = true;
    }

    member.borrowedBooks = member.borrowedBooks.filter(item => item.bookId.toString() !== book._id.toString());

    book.stock += 1;
    book.isBorrowed = false
    await member.save();
    await book.save();

    res.status(200).json({
      message: `Book ${book.title} has been returned successfully`,
    });


  } catch (error) {
    next(error)
  }
}

const bookCheck = async (req, res, next) => {
  try {
    const book = await Book.find({
      $or: [{ isBorrowed: false }, { isBorrowed: { $exists: false } }]
    });

    res.status(200).json({
      book
    })
  } catch (error) {
    next(error)
  }
}

const memberCheck = async (req, res, next) => {
  try {
    const members = await Member.aggregate([
      {
        $project: {
          code: 1,
          name: 1,
          borrowedBooksCount: { $size: "$borrowedBooks" }
        }
      }
    ]);

    res.status(200).json({
      members
    });
  } catch (error) {
    next(error)
  }
}

export default { borrow, returnBook, bookCheck, memberCheck };
