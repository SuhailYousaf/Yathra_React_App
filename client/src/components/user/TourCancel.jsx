import * as React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from "axios";
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { cancelbookings } from '../../redux/features/bookingSlice';
import { useNavigate } from 'react-router-dom';

export default function TourCancel({ bookingid ,onCancellationSuccess }) {

    const [open, setOpen] = React.useState(false);
    const [cancelText, setCancelText] = React.useState('');
    const dispatch=useDispatch()
    const navigate=useNavigate()
    

    const notify = (error) => toast.info(error, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleCancelSubmit = async () => {
        console.log("Submitted Review:", cancelText);
        console.log('bookingid',bookingid)
        try {
          const response = await dispatch(cancelbookings({ bookingid, cancelText, toast }));
          notify("Cancellation Successful");
          // Call the callback function to handle cancellation success
          onCancellationSuccess(response.data);
        } catch (error) {
          console.log(error.response?.data, "error.response?.data");
        }
        handleClose();
      };

    return (
        <div>
        <Button
        variant="outlined"
        onClick={handleClickOpen}
        style={{ backgroundColor: 'red', color: 'white' }}
      >
        Cancel
      </Button>
      
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Cancel Tour</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To cancel you package, please enter your reason.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label=" Write Reason"
                        type="email"
                        fullWidth
                        variant="standard"
                        onChange={(e) => setCancelText(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>cancel</Button>
                    <Button onClick={handleCancelSubmit}>Save</Button>
                </DialogActions>
            </Dialog>
            <ToastContainer />
        </div>
    );
}