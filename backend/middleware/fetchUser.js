const jwt = require('jsonwebtoken');

const fetchuser = (req, res, next) => {
    const JWT_SECRET = 'Hussainisadeveloper';

    // Get token from header
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ error: "Please authenticate using a valid token" });
    }

    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = { id: data.id }; // Fixed: assign the id correctly
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }
};

module.exports = fetchuser;
