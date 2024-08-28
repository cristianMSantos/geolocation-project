import { createSlice } from "@reduxjs/toolkit";

export const user = createSlice({
    name: 'user',
    initialState: {
        user: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        }
    }
})

export default user.reducer;