import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer  from './user/userSlice'
import {persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import persistStore from 'redux-persist/es/persistStore'

const rootReducer = combineReducers({user:userReducer})
const persistConfig={
    key: 'root',
    storage,
    version:1,
    whitelist: ['user'], // Only persist user state
    blacklist: [] // Don't persist anything else, for example, we don't want to persist the token or the error message.  // You can add more keys here if needed.  // Note: This is a simple example, in a real-world application, you might want to persist more data.  // For example, you might want to persist the token, the error message, and the last visited page.  // Also, you might want to consider using a more advanced storage solution like redux-persist-fs.  // You can find more information about using redux-persist here: https://github.com/rt2zz/redux-persist/blob/master/docs/introduction/quick-start.md#usage-with-redux-toolkit-and-react-redux-v7-0-and-above.  // Also, you might want to
}
const persistedReducer = persistReducer(persistConfig,rootReducer)
export const store = configureStore({
  reducer: persistedReducer,
  middleware:(getDefaultMiddleware)=>getDefaultMiddleware({
    serializableCheck: false, // Disable Redux Toolkit's built-in serializable check for better performance
  })
})

export const persistor = persistStore(store);