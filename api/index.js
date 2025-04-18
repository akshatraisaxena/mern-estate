import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'
import cookieParser from 'cookie-parser';
import listingRouter from './routes/listing.route.js';

import dotenv from 'dotenv';
dotenv.config();

const app = express();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.error(err);
})

app.use(express.json());
app.use (cookieParser());

app.use('/api/user',userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
})

app.listen(3000 , () => {
    console.log ("server is running");
});
