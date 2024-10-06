import React, { useState } from 'react'
import {useSelector} from 'react-redux'
import { useRef, useEffect } from 'react'
import {getDownloadURL, getStorage,  ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import {updateUserStart, updateUserSuccess, updateUserFailure, 
  delteUserFailure, deleteUserStart, deleteUserSuccess,
  SignOutUserFailure,SignOutUserStart,SignOutUserSuccess} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';


const Profile = () => {
  const fileRef = useRef(null)
  const {currentUser , loading ,error} = useSelector((state)=>state.user)
  const [file, setfile] = useState(undefined)
  const [fileper, setFileper] = useState(0)
  const [fileUploadError, setfileUploadError] = useState(false)
  const [formData, setformData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch()
    
  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }
  },[file]);
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    //  passed app from firebase that we have exported

    const fileName = new Date().getTime() + file.name;
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
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
  } catch (error) {
      console.error("Error during update:", error);
      dispatch(updateUserFailure(error.message));
    }
  };
  const handleDeleteUser = async(req,res,next)=>{
    try {
       dispatch(deleteUserStart());
       const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method: 'DELETE',
       });
       const data = await res.json();
       if (data.success === false){
         dispatch(delteUserFailure(data.message));
         return;
       }
       dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(delteUserFailure(error.message))
    }
  }
  const handleSignOUt = async(req,res,next)=>{
    try {
      dispatch(SignOutUserStart())
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false){
        dispatch(delteUserFailure(data.message))
        return;
      }
      dispatch(deleteUserSuccess(data))
    } catch (error) {
      dispatch(delteUserFailure(data.message))
    }
  }
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
           :('')
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
         <button
          disabled={loading}
          className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-600 cursor-pointer'>Delete account</span>
        <span onClick={handleSignOUt} className='text-red-600 cursor-pointer'>Sign out</span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>
        {updateSuccess ? 'User is updated successfully!' : ''}
      </p>
    </div>
  );
}

export default Profile