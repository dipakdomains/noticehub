/**
 * NoticeHub - Campus Announcement & Bulletin Board System
 * Humber College
 *
 * Main application file. Sets up Express, EJS, MongoDB and sessions.
 */

require('dotenv').config();

const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

/* ---------- Database connection ---------- */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection failed:', err.message));

/* ---------- View engine ---------- */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* ---------- Core middleware ---------- */
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false })); // reads posted form fields

/* ---------- Session setup ---------- */
// Sessions are stored in MongoDB so they survive server restarts and
// work correctly on Vercel, where memory is not shared between requests.
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'noticehub-dev-secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
  })
);

/* ---------- Share login state with every view ---------- */
// res.locals.admin is used by the navbar partial to switch between the
// logged out and logged in states.
app.use((req, res, next) => {
  res.locals.admin = req.session.adminId
    ? { id: req.session.adminId, displayName: req.session.displayName }
    : null;
  next();
});

/* ---------- Routes ---------- */
app.use('/', require('./routes/public'));
app.use('/admin', require('./routes/admin'));

/* ---------- 404 fallback ---------- */
app.use((req, res) => {
  res.status(404).render('404');
});

/* ---------- Start server ---------- */
// Only listen when run directly. On Vercel the app is exported instead.
const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`NoticeHub running on http://localhost:${PORT}`));
}

module.exports = app;
