// authMiddleware.js
const jwt = require('jsonwebtoken');


//Function to generate token based on userID and userType
const generateToken = (userId, userType) => {
    const secretKey = process.env.JWT_SECRET || 'default-secret-key'; // using secret key from .env
    return jwt.sign({ [`${userType}Id`]: userId }, secretKey, { expiresIn: '6h' }); // [`${userType}Id`] : It means the name of this property is dynamically determined based on the value of userType
};

// authentication function which runs for every url in the system except loggin in
const authenticate = (req, res, next) => {

    const token = req.headers.authorization; // get the token from headers->authorization
    //console.log('----> ', token);


    if (!token) {
        return res.status(401).json({ error: 'Unauthorized - Missing token' }); // if token does not exist
    }

    try {
        //console.log('Token', token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret-key'); // decode with secret-key to verify
        //console.log('Decoded Token:', decoded);
        req.userId = decoded.facultyId || decoded.studentId || decoded.gcId; // finding the user type after decoding
        if (decoded.facultyId) {
            req.userId = decoded.facultyId;
            req.userType = 'faculty';
        } else if (decoded.studentId) {
            req.userId = decoded.studentId;
            req.userType = 'student';
        } else if (decoded.gcId) {
            req.userId = decoded.gcId;
            req.userType = 'gc';
        } else {
            // Handle the case when neither ID is present
            return res.status(401).json({ error: 'Unauthorized - Invalid token' }); // otherwise if decoding is not successful, token is invalid
        }

        req.token = generateToken(req.userId, req.userType); // Refreshing token for expirary to be set at 6h again

        // Check if the user type is allowed to access the route
        if (req.baseUrl.includes('faculty') && req.userType !== 'faculty') {
            return res.status(403).json({ error: 'Forbidden - Faculty access only' });
        } else if (req.baseUrl.includes('std') && req.userType !== 'student') {
            return res.status(403).json({ error: 'Forbidden - Student access only' });
        } else if (req.baseUrl.includes('gc') && req.userType !== 'gc') {
            return res.status(403).json({ error: 'Forbidden - GC access only' });
        }
        next();
    } catch (error) {
        console.error('Token verification failed:', error.message);
        return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
};

module.exports = { authenticate, generateToken };
