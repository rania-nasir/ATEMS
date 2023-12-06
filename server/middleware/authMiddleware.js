// authMiddleware.js
const jwt = require('jsonwebtoken');

const generateToken = (userId, userType) => {
    const secretKey = process.env.JWT_SECRET || 'default-secret-key';
    return jwt.sign({ [`${userType}Id`]: userId }, secretKey, { expiresIn: '1h' });
};

const authenticate = (req, res, next) => {
    console.log('Entered authentication middleware');
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized - Missing token' });
    }

    try {

        console.log('Token', token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret-key');
        console.log('Decoded Token:', decoded);
        req.userId = decoded.facultyId || decoded.studentId;
        if (decoded.facultyId) {
            req.userId = decoded.facultyId;
            req.userType = 'faculty';
        } else if (decoded.studentId) {
            req.userId = decoded.studentId;
            req.userType = 'student';
        } else {
            // Handle the case when neither ID is present
            return res.status(401).json({ error: 'Unauthorized - Invalid token' });
        }

        req.token = generateToken(req.userId, req.userType);

        // Check if the user type is allowed to access the route
        if (req.baseUrl.includes('faculty') && req.userType !== 'faculty') {
            return res.status(403).json({ error: 'Forbidden - Faculty access only' });
        } else if (req.baseUrl.includes('std') && req.userType !== 'student') {
            return res.status(403).json({ error: 'Forbidden - Student access only' });
        }
        next();
    } catch (error) {
        console.error('Token verification failed:', error.message);
        return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
};

module.exports = { authenticate, generateToken };
