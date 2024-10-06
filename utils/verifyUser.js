import { errorHandler } from './error.js';
import jwt from  'jsonwebtoken'

export const verifyToken=(req,res,next)=>{
    const token = req.cookies.access_token;
    if (!token) return next(errorHandler(401, 'Unauthorized'));
        // return res.status(401).json({ success: false, message: 'Unauthorized' });
    jwt.verify(token, process.env.JWT_SECRET,(err,user)=>{
    //  if(err) return res.status(403).json({ success: false, message: 'Token is not valid' });
    if (err) return next(errorHandler(403, 'Forbidden'));
     req.user = user;
     next();
    });
};