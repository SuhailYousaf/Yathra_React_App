const jwt = require('jsonwebtoken');
const secret = 'sakdfnsadklfnasdgsdfgsdgfg'; // Replace with your actual secret

const authuser = async (req, res, next) => {
    console.log("Authentication middlewareeeeeeeeeeeeee");
    try {
        const authorizationHeader = req.headers.authorization;
       console.log('authorizationHeaderrrrrrrrrrrjbkbvkbvwduviwgdvbvlv'+authorizationHeader)
        if (!authorizationHeader) {
            console.log("No Authorization header provided");
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const parts = authorizationHeader.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer") {
            console.log("Invalid Authorization header format");
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const token = parts[1];

        // Verify the token
        jwt.verify(token, secret, (err, decodedData) => {
            if (err) {
                console.error('JWT verification error:', err.message);
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // Attach the decoded data (e.g., user ID) to the request object
            req.adminId = decodedData.id;
            console.log("Token is valid. Admin ID:", req.adminId);
            next();
        });
    } catch (error) {
        console.error('Authentication error:', error.message);
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = authuser;
