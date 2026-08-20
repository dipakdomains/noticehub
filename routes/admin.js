/**
 * Admin routes (all protected by requireAdmin)
 * GET  /admin                     management table
 * GET  /admin/notices/add         creation form
 * POST /admin/notices/add         validate and save
 * POST /admin/notices/delete/:id  remove a notice
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const Notice = require('../models/Notice');
const requireAdmin = require('../middleware/auth');

const router = express.Router();

// option lists,
const CATEGORIES = ['Academic', 'IT & Systems', 'Exam Schedule', 'Campus Life', 'Student Services'];
const URGENCIES = ['Low', 'Medium', 'High'];

// Every route in this file needs an active admin session
router.use(requireAdmin);

/* Validation rules*/
const noticeRules = [
  body('title').trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters.'),
  body('category').isIn(CATEGORIES).withMessage('Choose a category.'),
  body('urgency').isIn(URGENCIES).withMessage('Choose an urgency level.'),
  body('authorDepartment').trim().notEmpty().withMessage('Department cannot be empty.'),
  body('content').trim().isLength({ min: 15 }).withMessage('Notice body must be at least 15 characters.')
];

/* GET /admin - table of every notice */
router.get('/', async (req, res) => {
  const notices = await Notice.find().sort({ createdAt: -1 });
  res.render('admin/dashboard', { notices });
});

/* GET /admin/notices/add - blank creation form */
router.get('/notices/add', (req, res) => {
  res.render('admin/add', {
    categories: CATEGORIES,
    urgencies: URGENCIES,
    errors: [],
    values: { title: '', category: '', urgency: '', authorDepartment: '', content: '' }
  });
});

/* POST /admin/notices/add - validate, then save */
router.post('/notices/add', noticeRules, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).render('admin/add', {
      categories: CATEGORIES,
      urgencies: URGENCIES,
      errors: errors.array(),
      values: req.body
    });
  }

  await Notice.create(req.body);
  res.redirect('/admin');
});

/* remove one notice */
router.post('/notices/delete/:id', async (req, res) => {
  await Notice.findByIdAndDelete(req.params.id);
  res.redirect('/admin');
});

module.exports = router;
