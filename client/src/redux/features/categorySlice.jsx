import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

import * as api from "../api"


export const adminaddCategory = createAsyncThunk("category/adminaddCategory", async ({ updatedTourData, navigate, toast }, { rejectWithValue }) => {
    try {
        const response = await api.adminaddCategory(updatedTourData)
        toast.success("Category added  Successfully")
        navigate("/admin/Category")
        return response.data
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
})



const categorySlice = createSlice({

    name: 'category',
    initialState: {
        category: {},
        
        error: "",
        loading: false,
    },

    extraReducers: {
        [adminaddCategory.pending]: (state, action) => {
            state.loading = true
        },
        [adminaddCategory.fulfilled]: (state, action) => {
            state.loading = false
            localStorage.setItem("category", JSON.stringify({ ...action.payload }))
            state.category=action.payload;

        },
        [adminaddCategory.rejected]: (state, action) => {
            state.loading = false
            state.error = action.payload.message
        },
    }





})

export default categorySlice.reducer