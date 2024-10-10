import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useRef } from 'react';
import { useState } from 'react';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { type } from 'express/lib/response';
export default function CreateListing() {
const navigate = useNavigate();
 const {currentUser} = useSelector((state) => state.user);
 const [files, setFiles] = useState([]);
 const [formdata, setFormdata] = useState({
    imageUrls:[],
    name:'',
    description:'',
    address:'',
    type:'rent',
    bedrooms: 1,
    bathrooms:1,
    regularPrice:50,
    discountPrice:0,
    offer:false,
    parking:false,
    furnished:false,
 });
 const [imageUploadError, setimageUploadError] = useState(false);
 const [uploading, setuploading] = useState(false);
 const [error, setError] = useState(false);
 const [loading, setLoading] = useState(false);
 const handleImageSubmit = (e)=>{
    if (files.length>0 && files.length + formdata.imageUrls.length <7){
        setuploading(true);
        setimageUploadError(false);
        const promises = [];
        for (let i=0; i<files.length; i++){
            promises.push(storeImage(files[i]));
        }
        Promise.all(promises).then((urls)=>{
            setFormdata({...formdata, imageUrls: formdata.imageUrls.concat(urls) });
            setimageUploadError(false)
            setuploading(false)
        }).catch((err)=>{
            setimageUploadError('Image upload failed(2mb max size of img)');
            setuploading(false)
        }); 
    }else{
        setimageUploadError('Maximum 6 images allowed')
        setuploading(false)
    }
 };
 console.log(formdata)
 const storeImage = async(file) => {
    return new Promise((resolve, reject) =>{
        const storage = getStorage(app);
        const fileName = new Date().getTime()+ file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on('state_changed',(snapshot)=>{
            const Progress = (snapshot.bytesTransferred / snapshot.totalBytes)*100;
            console.log (`upload is ${Progress}% done`)
        },(error) => {
            reject(error);
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                resolve(downloadURL);
            });
        });
    })
 }
 const handleRemoveImage=(index) => {
    setFormdata({
        imageUrls: formdata.imageUrls.filter((_, i) => i!== index)
    })
 }
 const handleChange=(e)=>{
    if(e.target.id === 'sale' || e.target.id === 'rent'){
        setFormdata({
            ...formdata,
            type: e.target.id,
        });
    }
    if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
        setFormdata({
            ...formdata,
            [e.target.id]:e.target.checked,
        })
    }
    if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
        setFormdata({
            ...formdata,
            [e.target.id]: e.target.value,
        });
    }
 };
 const handleSubmit=async(e)=>{
    e.preventDefault();
    setLoading(true); 
    try {
        if (formdata.imageUrls.length < 1)
           return setError('You must upload atleast one image')
        if (+formdata.regularPrice < +formdata.discountPrice)
          return setError('Discount price must be less than regular price')
        setLoading(true);
        setError(false);
        // const token = localStorage.getItem('token'); 
        const res = await fetch('/api/listing/create',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                ...formdata,
             userRef:currentUser._id,
            }),
        });
        const data = await res.json();
        setLoading(false);
        if (data.success === false){
            setError(data.message);
            return;
        }
        navigate(`/listing/${data._id}`);
    } catch (error) {
        setError(error.message);
        setLoading(false);
    }
 }
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Name'
            className='border p-3 rounded-lg'
            id='name'
            maxLength='62'
            minLength='10'
            required
            onChange={handleChange}
            value={formdata.name}
          />
          <textarea
            type='text'
            placeholder='Description'
            className='border p-3 rounded-lg'
            id='description'
            required
            onChange={handleChange}
            value={formdata.description}
          />
          <input
            type='text'
            placeholder='Address'
            className='border p-3 rounded-lg'
            id='address'
            required
            onChange={handleChange}
            value={formdata.address}
          />
          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input type='checkbox' id='sale' className='w-5' onChange={handleChange} checked={formdata.type === 'sale'}/>
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='rent' className='w-5' onChange={handleChange} checked={formdata.type === 'rent'} />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='parking' className='w-5'onChange={handleChange} checked={formdata.parking} />
              <span>Parking spot</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='furnished' className='w-5' onChange={handleChange} checked={formdata.furnished}/>
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='offer' className='w-5' onChange={handleChange} checked={formdata.offer}/>
              <span>Offer</span>
            </div>
          </div>
          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bedrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange} 
                value={formdata.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bathrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange} 
                value={formdata.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='regularPrice'
                min='50'
                max='100000'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange} 
                value={formdata.regularPrice}
              />
              <div className='flex flex-col items-center'>
                <p>Regular price</p>
                <span className='text-xs'>($ / month)</span>
              </div>
            </div>
            {formdata.offer && (    
              <div className='flex items-center gap-2'>
              <input
                type='number'
                id='discountPrice'
                min='0'
                max='10000'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange} 
                value={formdata.discountPrice}
              />
              <div className='flex flex-col items-center'>
                <p>Discounted price</p>
                <span className='text-xs'>($ / month)</span>
              </div>
            </div>
        )}
      
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className='font-semibold'>Images:
          <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
          </p>
          <div className="flex gap-4">
            <input onChange={(e)=>setFiles(e.target.files)} className='p-3 border border-gray-300 rounded w-full' type="file" id='images' accept='image/*' multiple />
            <button type='button' disabled={uploading} onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>{uploading ? 'Uploading...':'Upload'}</button>
          </div>
          <p className='text-red-700 text-sm'>
            {imageUploadError && imageUploadError}
        </p>
        {
            formdata.imageUrls.length > 0 && formdata.imageUrls.map((url,index)=>(
                <div key={url} className='flex justify-between items-center'>
                    <img src={url} alt="listing image" className='w-20 h-20 object-contain rounded-lg' />
                    <button type='button' onClick={()=>handleRemoveImage(index)} className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75 font-semibold '>delete</button>
                </div>
            ))
        }
        <button 
         disabled ={ loading || uploading}
        className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
            {loading ? 'Creating...' : 'Create listing'}
        </button>
        {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
  );
}