/**
 * Public routes
 * GET  /        public notice board
 * GET  /login   admin login form
 * POST /login   authenticate and start session
 * GET  /logout  destroy session
 */

const express = require('express');
const Notice = require('../models/Notice');
const Admin = require('../models/Admin');

const router = express.Router();

/* GET / - public card grid, newest notice first */
router.get('/', async (req, res) => {
  const notices = await Notice.find().sort({ createdAt: -1 });
  res.render('index', { notices });
});

/* GET /login - show the login form */
router.get('/login', (req, res) => {
  // Already signed in, go straight to the dashboard
  if (req.session.adminId) return res.redirect('/admin');
  res.render('login', { error: null, username: '' });
});

/* POST /login - check credentials against the Admin collection */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });

  if (!admin || admin.password !== password) {
    return res.status(401).render('login', {
      error: 'That username and password combination did not match an admin account.',
      username: username || ''
    });
  }

  req.session.adminId = admin._id.toString();
  req.session.displayName = admin.displayName;
  res.redirect('/admin');
});

/* GET /logout - end the session and return home */
router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

module.exports = router;
