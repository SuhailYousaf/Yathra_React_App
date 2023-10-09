import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import { format, isValid } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { bookingDetailes  } from "../../redux/features/bookingSlice";
import { payment } from "../../redux/features/bookingSlice";
import CheckoutForm from "../../components/user/CheckoutForm";
import './Payment.css';

const stripePromise = loadStripe("pk_test_51No1l9SAjLQD2F0g8MdaaaDkb8oGGOxWCEa4TizLgqsMe2kQc0oJbomQ5iuIFQYEGke6qqnBaLWLQtf8ZnlO8lZI00LwecZRZ8");
export default function Payment() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [clientSecret, setClientSecret] = useState("");
    const [redirect, setRedirect] = useState('');
    const user = useSelector(state => state.userr)
    const navigate = useNavigate(); // Add this line to get the navigate function

    const { booking } = useSelector((state) => state.booking);
    console.log("idddd"+id)
    console.log("useer"+user)
  console.log("User ID: ", user.user.token)
  console.log("User ID: ", user.name)
    useEffect(() => {
      
        dispatch(bookingDetailes({ id }));
    }, [dispatch, id, user]);

    const bookingDate = booking ? new Date(booking.bookin) : null;

    const confirmThis = async () => {
        try {
            const response = await dispatch(payment({ id },[dispatch,user]));
            if (response && response.payload && response.payload.clientSecret) {
                setClientSecret(response.payload.clientSecret);
            } else {
                console.error("No clientSecret found in the response.");
            }
        } catch (error) {
            console.error("Error confirming the booking:", error);
        }
    };
    
const cancelThis = () => {
   
    navigate('/');
  };


    const appearance = {
        theme: 'stripe',
    };

    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div className="Appp">
            {redirect && <Navigate to={redirect} />}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-[1fr_2fr]">
                <div className="bg-white shadow p-4 rounded-2xl">
                    {booking && (
                        <>
                           <h1 className="mt-2 total-amount">Hai {booking.name}</h1>
                           <h1 className="mt-2 total-amount">
                           Total Amount: ${booking.guestno * booking.price}
                         </h1>
                            <h2 className="mt-2 no-of-guests">No of Guests: {booking.guestno}</h2>
                            {isValid(bookingDate) && (
                                <h2 className="mt-2">Booking Date On: {format(bookingDate, 'yyyy-MM-dd')}</h2>
                            )}
                            <div >
  <button onClick={confirmThis} className="btn btn-primary mt-4">Confirm Bookings</button>
  <br></br>
  <button onClick={cancelThis} className="btn btn-danger mt-4">Cancel Bookings</button>
</div>

                        </>
                    )}
                </div>
            </div>
            <div>
                {clientSecret && (
                    <Elements options={options} stripe={stripePromise}>
                        <CheckoutForm />
                    </Elements>
                    
                )}
            </div>
        </div>
    )
}
