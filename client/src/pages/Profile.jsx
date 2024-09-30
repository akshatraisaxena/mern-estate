import React, { useState } from 'react'
import {useSelector} from 'react-redux'
import { useRef, useEffect } from 'react'
import {getDownloadURL, getStorage,  ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import {updateUserStart, updateUserSuccess, updateUserFailure} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import axios from 'axios';

const Profile = () => {
  const fileRef = useRef(null)
  const {currentUser} = useSelector((state)=>state.user)
  const [file, setfile] = useState(undefined)
  const [fileper, setFileper] = useState(0)
  const [fileUploadError, setfileUploadError] = useState(false)
  const [formData, setformData] = useState({})
  const dispatch = useDispatch()
    
  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }
  },[file]);
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    //  passed app from firebase that we have exported

    const fileName=new Date().getTime() + file.name;
    // this will help to give a unique file name so if you added same file twice it will prevent the app from error

    const storageRef= ref(storage,fileName);
    const uploadTask= uploadBytesResumable(storageRef,file)
    // to see the percentage of file uploading , and also to track the error we can use this uploadTask

    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setFileper(Math.round(progress))
    },
    (error)=>{
      setfileUploadError(true)
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then
     ( (downloadUrl)=>{
        setformData({...formData, avatar: downloadUrl})
      })
    }
  );
  }
  const handleChange =(e)=>{
    setformData({...formData, [e.target.id]: e.target.value})
  }
  const handleSubmit =async(e)=>{
    e.preventDefault();
    dispatch(updateUserStart());
    try {
      const res = await axios.put(
                `/api/user/update/${currentUser._id}`,
                formData, // Form data including the updated fields
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true, // Send cookies with the request
                }
            );
      console.log("Response:", res);
      const data = res.data;
      if (data.success === false){
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
    } catch (error) {
      console.error("Error during update:", error);
      dispatch(updateUserFailure(error.message));
    }
  };
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-2xl font-semibold text-center my-5'>Profile</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={(e) => setfile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*' />
        <img onClick={()=>fileRef.current.click()} 
        className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-1' 
         src={formData ?.avatar || currentUser.avatar} alt="profile"
          />
        <p className='text-sm self-center'>
         {fileUploadError ? 
          (<span className='text-red-700'>Error image upload(image must be less then 5mb)</span>):
           fileper>0 && fileper<100 ?
           (<span className='text-slate-700'>{`Uploading ${fileper}%`}</span>):
            fileper === 100 ? 
           (<span className='text-green-700'>Image uploaded successfully</span>)
           :
           ""
         }
        </p>
        <input type="text"
         placeholder='username' 
         id='username' 
         className='border p-3 rounded-lg ' 
         defaultValue={currentUser.username}
         onChange={handleChange}
         />
        <input type="email" 
        placeholder='email' 
        id='email' 
        className='border p-3 rounded-lg ' 
        defaultValue={currentUser.email}
        onChange={handleChange}
         />
        <input type="password"
         placeholder='password' 
         id='password' 
         className='border p-3 rounded-lg '
         onChange={handleChange}
          />
         <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-05 '>Update</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-600 cursor-pointer'>Delete account</span>
        <span className='text-red-600 cursor-pointer'>Sign out</span>
      </div>
    </div>
  )
}

export default Profile