import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

import * as api from "../api"

export const  orderdetailes= createAsyncThunk("order/orderdetailes", async ({payment_intent}, { rejectWithValue }) => {
    try {
        const response = await api. orderdetailes({payment_intent})

     console.log(response.data,"ssssssssssss")
 
        return response.data
        

    } catch (err) {
        return rejectWithValue(err.response.data);
    }
})



const orderSlice=createSlice({
    name:'order',
    initialState:{
        order :{},
        orders :[],
        error :"",
        loading :false,
    },

    extraReducers: {
        [ orderdetailes.pending]: (state, action) => {
            state.loading = true
        },
        [ orderdetailes.fulfilled]: (state, action) => {
            state.loading = false
            localStorage.setItem("orders", JSON.stringify({ ...action.payload }))
             state.orders.push(action.payload);
            // state.bookings = action.payload



        },
        [ orderdetailes.rejected]: (state, action) => {
            state.loading = false
         
        },

    }



})

export default orderSlice.reducer