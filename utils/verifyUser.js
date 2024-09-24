import { errorHandler } from './error.js';
import jwt from  'jsonwebtoken'

export const verifyToken=(req,res,next)=>{
    const token = req.cookies.acess_token;
    if(!token)
        return next (errorHandler(401,'Unauthorized user'));
        jwt.verify(token , process.env.JWT_SECRET,(err,user)=>{
            if(err) return next(errorHnadler(403,'Forbidden'));
            req.user = user;
            next();
        })
}