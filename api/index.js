import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user.route.js'
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.error(err);
})
const app = express();

app.use('/api/user',userRouter);

app.listen(3000 , () => {
    console.log ("server is running");
});
