import bcrypt from 'bcryptjs'
import User from '../models/user.model.js'
import { errorHandler } from '../../utils/error.js'

export  const test = (req,res)=>{
    res.json({ message: 'This is a test api working coming from controller' })
}

export const updateUser = async (req,res,next)=>{
    console.log('Entering updateUser function');
    // console.log('Request User:', req.user);
    // console.log('Request Params:', req.params);
    // console.log('Current User ID:', req.user._id);
    // console.log('User ID from Params:', req.params.id);
    // console.log('Request Body:', req.body);
    // if (req.user.id !== req.params.id){
    //     return next(errorHandler(401,"You can only update your own id"))
    // }
    // try {
    //     if(req.body.password ){
    //         req.body.password = bcryptjs.hashSync(req.body.password,10)
    //     }
    //     console.log('Updating user in the database...');
    //     const updatedUser = await User.findByIdAndUpdate(req.params.id, {
    //         $set:{
    //             username: req.body.username,
    //             email: req.body.email,
    //             password: req.body.password,
    //             avatar: req.body.avatar
    //         },
    //     }, {new:true})
    //     console.log('Updated User:', updatedUser); 
    //     if(!updatedUser){
    //         return next(errorHandler(404,"User not found"))
    //     }
    //     const {password, ...others}= updatedUser._doc;
    //     res.status(200).json(others)
    // } catch (error) {
    //     console.error('Update error:', error);  // Log the specific error
    //     next(errorHandler(500, "An error occurred while updating the user."));
    // }
    const {id} = req.params;
  const { username, email, password, avatar } = req.body;

  try {
    // Find user by ID
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update user fields
    user.username = username || user.username;
    user.email = email || user.email;
    if (password) {
        user.password = password; // You should hash the password if storing plaintext
    }
    user.avatar = avatar || user.avatar;

    // Save updated user
    await user.save();
    return res.status(200).json({ success: true, data: user });
} catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
}
}