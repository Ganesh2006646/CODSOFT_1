// This middleware checks if the logged-in user is an admin
// It should be used AFTER authMiddleware (so req.user exists)
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); // User is admin, allow them through
    } else {
        res.status(403).json({ message: 'Access denied. Admins only.' });
    }
};

module.exports = { adminOnly };
