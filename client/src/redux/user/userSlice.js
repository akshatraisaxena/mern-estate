import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser:null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        signInStart:(state) => {
            state.loading = true;
        },
        signInSuccess:(state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure:(state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateUserStart:(state)=>{
            state.loading = true;
        },
        updateUserSuccess:(state , action)=>{
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateUserFailure:(state, action)=>{
            state.loading = false;
            state.error = action.payload;
        },
        deleteUserStart:(state)=>{
            state.loading = true;
        },
        deleteUserSuccess:(state)=>{
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        delteUserFailure:(state, action)=>{
            state.loading = false;
            state.error = action.payload;
        },
        SignOutUserStart:(state)=>{
            state.loading = true;
        },
        SignOutUserSuccess:(state)=>{
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        SignOutUserFailure:(state, action)=>{
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export const {signInStart, signInSuccess, signInFailure , 
    updateUserStart , updateUserFailure , updateUserSuccess,
    deleteUserStart,deleteUserSuccess,delteUserFailure,
    SignOutUserFailure,SignOutUserStart,SignOutUserSuccess} = userSlice.actions;
export default userSlice.reducer;