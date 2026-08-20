/**
 * Route guard for /admin/* routes.
 * Sends anyone without an active session back to the login page.
 */

function requireAdmin(req, res, next) {
  if (req.session.adminId) {
    return next();
  }
  res.redirect('/login');
}

module.exports = requireAdmin;
