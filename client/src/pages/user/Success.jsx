import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { orderdetailes } from "../../redux/features/orderSlice";
import './success.css';
export default function Success() {
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const [redirect, setRedirect] = useState('');
    const payment_intent = params.get('payment_intent');
    const user = useSelector(state => state.userr.user);
    const dispatch = useDispatch();
    console.log(payment_intent)

    useEffect(() => {
   
                dispatch(orderdetailes({ payment_intent }));
       
    }, [dispatch, user]);

    if (redirect) {
        return <Navigate to={redirect} />;
    }

    return (
        <div className="payment-success">
  Payment Successful
</div>

    )
}