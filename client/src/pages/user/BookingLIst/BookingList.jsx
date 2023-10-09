import React, { useState, useEffect } from "react";
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import './bookinglist.css';
import { getBookings } from "../../../redux/features/bookingSlice";
import TourCancel from "../../../components/user/TourCancel";
import Spinner from "../../../components/user/Spinner";

export default function BookingList() {
  const dispatch = useDispatch();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector(state => state.userr.user);

  useEffect(() => {
    dispatch(getBookings())
      .then((response) => {
        setBookings(response.payload);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching bookings:", error);
      });
  }, [dispatch, user]);

  const handleTourCancellationSuccess = (cancelledBooking) => {
    const updatedBookings = bookings.map((booking) =>
      booking._id === cancelledBooking._id ? { ...booking, deliverystatus: 'Cancelled' } : booking
    );

    setBookings(updatedBookings);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="booking-list">
      <table className="table">
        <thead>
          <tr>
            <th>Booking Date</th>
            <th>No of Guests</th>
            <th>Total Price</th>
            <th>Tour Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{format(new Date(booking.bookin), 'yyyy-MM-dd')}</td>
              <td>{booking.guestno}</td>
              <td>{booking.total}</td>
              <td className={booking.deliverystatus === 'Success' ? 'success' : 'cancelled'}>
                {booking.deliverystatus}
              </td>
              <td>
                {booking.deliverystatus !== 'Success' && (
                  <button className="cancel-button">
                    <i className="fas fa-trash" style={{ color: '#dd439' }}></i>
                    <TourCancel bookingid={booking._id} onCancellationSuccess={handleTourCancellationSuccess} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
