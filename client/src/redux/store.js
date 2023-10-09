import { configureStore } from "@reduxjs/toolkit";
import TourReducer from './features/tourSlice'
import UserrReducer from './features/userrSlice'
import AdminReducer from './features/adminSlice';
import BookingReducer from './features/bookingSlice'
import CategoryReducer from './features/categorySlice'
import OrderReducer from './features/orderSlice'

//add key
export default configureStore({
    reducer: {
        tour: TourReducer,
        userr: UserrReducer,
        admin: AdminReducer,
        booking :BookingReducer,
        category:CategoryReducer,
        order:OrderReducer,
        

    },
})