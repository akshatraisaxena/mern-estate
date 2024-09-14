import { error } from 'console';
import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs';
import { errorHnadler } from '../../utils/error.js';
import jwt from 'jsonwebtoken';
import { userInfo } from 'os';

export const Signup = async (req,res,next)=>{
    const{username,email,password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password,10);
    const newUser = new User({username,email,password:hashedPassword});
    try {
        await newUser.save()
        res.status(201).json({message:'User registered successfully'})
    } catch (error) {
        next(error);
    }
    
};

export const Signin =async(req,res,next) => {
    const {email, password}=req.body;
    try {
        const validUser = await User.findOne({email});
        if(!validUser)return next(errorHnadler(404,'user not found'));
        const validPassword = bcryptjs.compareSync(password,validUser.password);
        if(!validPassword) return next(errorHnadler(401,'Wrong credentials'));
        const token = jwt.sign({_id:validUser._id},process.env.JWT_SECRET);
        const{password:pass, ...rest}=validUser._doc;
        // adding validUser._doc so that we cannot access password
        res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);
    } catch (error) {
        next(error);
    }
};