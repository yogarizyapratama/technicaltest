import request from 'supertest';
import app from '../src/app.js';
import Member from '../src/models/member.js';
import Book from '../src/models/book.js';
import { books, members } from '../src/constants/index.js';
import moment from 'moment';

describe('Library API', () => {
  beforeAll(async () => {
    await Member.deleteMany({});
    await Book.deleteMany({});

    await Member.insertMany(members);
    await Book.insertMany(books);
  });

  describe('POST /api/books/borrow', () => {
    it('should borrow a book successfully', async () => {
      const res = await request(app)
        .post('/api/books/borrow')
        .send({ memberCode: 'M001', bookCode: 'JK-45' });

      expect(res.status).toBe(200);
      expect(res.body.message).toEqual('You borrowed Harry Potter');
    });

    it('should not borrow a book if the member has already borrowed 2 books', async () => {
      await Member.updateOne({ code: 'M001' }, { $set: { borrowedBooks: [{ bookId: 'JK-45', borrowedDate:new Date() }, { bookId: 'SHR-1',borrowedDate:new Date()  }] } });

      const res = await request(app)
        .post('/api/books/borrow')
        .send({ memberCode: 'M001', bookCode: 'TW-11' });
      expect(res.status).toBe(412);
      expect(res.body.message).toEqual('You are already borrowing 2 books');
    });

    it('should not borrow a book if the member is penalized', async () => {
      await Member.updateOne({ code: 'M001' }, { $set: { isPenalized: true, penalizedUntil: moment().add(1, 'days').toDate() } });

      const res = await request(app)
        .post('/api/books/borrow')
        .send({ memberCode: 'M001', bookCode: 'HOB-83' });

      expect(res.status).toBe(403);
      expect(res.body.message).toEqual('You are penalized and cannot borrow any books');
    });

    it('should not borrow a book if the book is already borrowed by another member', async () => {
      const res = await request(app)
        .post('/api/books/borrow')
        .send({ memberCode: 'M002', bookCode: 'JK-45' });

      expect(res.status).toBe(412);
      expect(res.body.message).toEqual('Not enough stock');
    });
  });

  describe('POST /api/books/return', () => {
    it('should return a book successfully', async () => {
      await Member.updateOne({ code: 'M001' }, { $set: { borrowedBooks: [{ bookId: 'JK-45', borrowedDate: moment().subtract(6, 'days').toDate() }] } });

      const res = await request(app)
        .post('/api/books/return')
        .send({ memberCode: 'M001', bookCode: 'JK-45' });
      expect(res.status).toBe(200);
      expect(res.body.message).toEqual('Book Harry Potter has been returned successfully');
    });

    it('should penalize member if the book is returned after 7 days', async () => {
      await Member.updateOne({ code: 'M001' }, { $set: { borrowedBooks: [{ bookId: 'SHR-1', borrowedDate: moment().subtract(8, 'days').toDate() }] } });

      const res = await request(app)
        .post('/api/books/return')
        .send({ memberCode: 'M001', bookCode: 'SHR-1' });

      expect(res.status).toBe(200);
      expect(res.body.message).toEqual('Book A Study in Scarlet has been returned successfully');

      const updatedMember = await Member.findOne({ code: 'M001' });
      expect(updatedMember.isPenalized).toBe(true);
    });
  });

  describe('GET /api/books/available', () => {
    it('should get available books', async () => {
      const res = await request(app)
        .get('/api/books/available');

      expect(res.status).toBe(200);
      expect(res.body.book).toBeInstanceOf(Array);
    });
  });

  describe('GET /api/members', () => {
    it('should get members and borrowed books count', async () => {
      const res = await request(app)
        .get('/api/members');

      expect(res.status).toBe(200);
      expect(res.body.members).toBeInstanceOf(Array);
    });
  });

  afterAll(async () => {
    await Member.deleteMany({});
    await Book.deleteMany({});
  });
});
