const express = require('express');
const router = express.Router();
const authuser = require('../middleware/authuser');



const userController = require('../controllers/userController')

router.post('/register', userController.userRegister)

router.post('/login', userController.userLogin)

router.get('/createtour', userController.listTours)

router.get('/getTour/:id', userController.getTour)

router.post('/bookings', userController.bookPackage)

router.get('/bookingdetails/:id', userController.getBookingdetails)

router.post('/create-payment-intent/:id',authuser,userController.createOrder)

router.put('/order', userController.updateOrder)

router.get('/search', userController.getToursbySearch)

router.post('/mybookings',authuser, userController.myBookings)

router.post('/cancelbooking',authuser,userController.cancelBooking)

router.post('/createChat', userController.createChat);
router.get('/userChats/:userId', userController.userChats);
router.get('/findChat/:firstId/:secondId', userController.findChat);
router.post('/addMessage',userController.addMessage );
router.get('/getMessages/:chatId',userController.getMessages );
router.get('/getUser/:id', userController.getUser)


module.exports = router;

// new update