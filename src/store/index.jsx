import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/User"

export default configureStore({
    reducer: {
        user: userReducer
    }
})