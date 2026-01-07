import jwt from "jsonwebtoken";
import config from "../config/config.js";

const generateToken = (user) =>{
    return jwt.sign( {userId: user.id, email: user.email}, config.JWT_SECRET, { expiresIn: '3d' } );
}

export default generateToken;