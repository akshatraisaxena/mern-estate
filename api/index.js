import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'

import dotenv from 'dotenv';
dotenv.config();

const app = express();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.error(err);
})

app.use(express.json());

app.use('/api/user',userRouter);
app.use('/api/auth', authRouter);

app.listen(3000 , () => {
    console.log ("server is running");
});
