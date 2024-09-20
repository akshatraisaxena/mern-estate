import React from 'react'
import {getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth'
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice'
import {useNavigate} from 'react-router-dom'

export default function Oauth(){
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleGoogleClick = async() => {
        try {
            const provider= new GoogleAuthProvider()
            const auth = getAuth(app)
            const result = await signInWithPopup(auth,provider)
            //  console.log("Google Login Result:", result.user)
            const res= await fetch('/api/auth/google',{
                method:'POST',
                headers:{
                    'content-type': 'application/json',
                },
                body: JSON.stringify({name:result.user.displayName, 
                    email:result.user.email, 
                    photo:result.user.photoURL}),
            })
            const data = await res.json();
            dispatch (signInSuccess(data));
            navigate('/')
            // completed the frontend setup of auth using dipatch
        } catch (error) {
            console.log('could not sign in with google',error);
        }
    }
    return (
        <button type='button' onClick={handleGoogleClick} className='bg-red-600 text-white hover:opacity-95 uppercase p-2 rounded-lg'>continue with google</button>
      )
}


  

