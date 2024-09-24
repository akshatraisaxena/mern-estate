
import bcryptjs from 'bcryptjs'
import User from '../models/user.model.js'
import { errorHandler } from '../../utils/error.js'

export  const test = (req,res)=>{
    res.json({ message: 'This is a test api working coming from controller' })
}

export const updateUser = async (req,res,next)=>{
    if (req.user.id !== req.params.id)return next(errorHandler(401,"You can only update yourown id"))
    try {
        if(req.body.password ){req.body.password = bcryptjs.hashSync(req.body.password,10)}
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set:{
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar
            }
        }, {new:true})
        const {password, ...others}= updatedUser._doc
        res.status(200).json(others)
    } catch (error) {
        next(error)
    }
}