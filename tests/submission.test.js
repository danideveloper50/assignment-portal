const request = require('supertest');
const app = require('../app');

beforeEach(async () => {
  // Clear submissions before each test
  await request(app).delete('/submissions');
});

describe('Assignment Submission Portal', () => {

  // TEST 1: Valid submission is saved
  test('saves a valid submission with complete details', async () => {
    const res = await request(app)
      .post('/submit')
      .send({
        name: 'Muhammad Daniyal',
        regNumber: 'FA23-BAI-009',
        title: 'DevOps Lab Mid',
        url: 'https://github.com/danideveloper50/assignment-portal'
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Submission saved.');

    // Verify it appears in the list
    const listRes = await request(app).get('/submissions');
    expect(listRes.body.length).toBe(1);
    expect(listRes.body[0].regNumber).toBe('FA23-BAI-009');
  });

  // TEST 2: Missing registration number is rejected
  test('rejects submission with missing registration number', async () => {
    const res = await request(app)
      .post('/submit')
      .send({
        name: 'Muhammad Daniyal',
        regNumber: '',  // empty
        title: 'DevOps Lab Mid',
        url: 'https://github.com/example/repo'
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  // TEST 3: Invalid URL is rejected and not saved
  test('rejects submission with invalid URL', async () => {
    const res = await request(app)
      .post('/submit')
      .send({
        name: 'Muhammad Daniyal',
        regNumber: 'FA23-BAI-009',
        title: 'DevOps Lab Mid',
        url: 'not-a-valid-url'
      });

    expect(res.status).toBe(400);

    // Verify nothing was saved
    const listRes = await request(app).get('/submissions');
    expect(listRes.body.length).toBe(0);
  });

});