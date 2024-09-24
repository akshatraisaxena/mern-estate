
import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../../utils/error.js';
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
        if(!validUser)return next(errorHandler(404,'user not found'));
        const validPassword = bcryptjs.compareSync(password,validUser.password);
        if(!validPassword) return next(errorHandler(401,'Wrong credentials'));
        const token = jwt.sign({_id:validUser._id},process.env.JWT_SECRET);
        const{password:pass, ...rest}=validUser._doc;
        // adding validUser._doc so that we cannot access password
        res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);
    } catch (error) {
        next(error);
    }
};

export const google = async (req,res ,next)=>{
    try {
        const user =await User.findOne({email:req.body.email})
        if(user){
            const token = jwt.sign({_id:user._id},process.env.JWT_SECRET);
            const{password:pass,...rest}=user._doc;
            res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);
        }
        // this is for the user which alreadyt exist
        else{
            const genratedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            // slice(-8) means wqe just want the last 8 digits of passwrd,we done it twice so that we can get a 16 digit secure pwd
            const hashedPassword = bcryptjs.hashSync(genratedPassword,10);
            const newUser = new User({username:req.body.name.split(" ").join("").toLowerCase()+ 
                Math.random().toString(36).slice(-4),
                email:req.body.email,
                password:hashedPassword,
                avatar:req.body.photo});
            await newUser.save();
            const token = jwt.sign({_id:newUser._id},process.env.JWT_SECRET);
            const{password:pass,...rest}=newUser._doc;
            res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);
            // backend of auth is completed here
        }
    } catch (error) {
        next(error);
    }
}