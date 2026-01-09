import jwt from 'jsonwebtoken';

import config from '../config/config.js';


const authMiddleware = async (req, res, next) => {
    try {
        if (req.cookies.loginToken) {
            const token = req.cookies.loginToken;
            const decoded = jwt.verify(token, config.JWT_SECRET);
            req.user = decoded;
            next();
        }
        else if (req.user) {
            console.log('middleware', req.user);
            req.user = {
                userId: req.user.id,
                email: req.user.email,
            };
            next();
        } else {
            return res.status(401).json({
                error: "Unauthorized"
            });
        }


    } catch (err) {
        next(err);
    }
}

export default authMiddleware;