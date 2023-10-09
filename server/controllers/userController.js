const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');
const Stripe = require("stripe");
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'sakdfnsadklfnasdgsdfgsdgfg';
const moment = require('moment');
const Users=require('../modelsss/user')
const Tour=require('../modelsss/tour')
const Booking = require('../modelsss/booking');
const Slot = require('../modelsss/slot');
const Category = require('../modelsss/category')
const Order = require('../modelsss/order');
const createError = require('http-errors');

const ChatModel =require('../modelsss/ChatModel')
const MessageModel =require('../modelsss/MessageModel')

exports.userRegister = async (req, res) => {
    const { firstname, email, number, password } = req.body;
    console.log("registerrrrvhjvjhvj...."+req.body.email)
    console.log("firstname...."+req.body.firstname)
    try { 
        const existingUser = await Users.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ error: 'Agent registration failed', message: 'Email already exists' });
        }

        const UserDoc = await Users.create({
            firstname,
            email,
            number,
            password: bcrypt.hashSync(password, bcryptSalt),
            createdAt: new Date().toISOString(),
        });
        
        const token = jwt.sign({ email: UserDoc.email, id: UserDoc._id }, jwtSecret, {
            expiresIn: '1h',
        });
        console.log("completed registeration..........")
        res.status(201).json({ UserDoc, token });
        
    } catch (e) {
        res.status(422).json({ error: 'Agent registration failed', message: e.message });
    }
};



exports.userLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const UserDoc = await Users.findOne({ email });


        if (!UserDoc.status) {
            return res.status(403).json({ error: 'Authentication failed',message: "User is blocked. Please contact support." });
        }
        else if (UserDoc) {
            const passok = bcrypt.compareSync(password, UserDoc.password);
            if (passok) {
                const token = jwt.sign({ email: UserDoc.email, id: UserDoc._id }, jwtSecret, {
                    expiresIn: '1h',
                });
                res.status(201).json({ UserDoc, token });

            } 
            
            else {
                res.status(401).json({ error: 'Authentication failed', message: 'Invalid credentials' });
            }
        } else {
            res.status(404).json({ error: 'User not found', message: 'No user with this email' });
        }
    } catch (e) {
        res.status(500).json({ error: 'Server error', message: e.message });
    }
};




exports.listTours=async (req,res)=>{
    try{
        const tours=await Tour.find()
        res.status(200).json(tours)
    }catch(error){
        res.status(404).json({message:"something went wrong" })
    }
}

exports.getTour=async (req,res)=>{
    const {id}=req.params;
    try{
        console.log("Single View"+id)
        const tour=await Tour.findById(id)
        console.log("Single View"+tour)
        res.status(200).json(tour)
       
    }catch(error){
        res.status(404).json({message:"something went wrong" })
    }
};

exports.bookPackage = async (req, res, next) => {
    try {
        const { bookin, guestno, name, email, phone, place, price, owner } = req.body;
       console.log(' req.body.owner'+ req.body.owner)
       console.log(' req.body.bookin'+ req.body.bookin)
       console.log(' req.body.guestno'+ req.body.guestno)
       console.log(' req.body.name'+ req.body.name)
       console.log(' req.body.phone'+ req.body.phone)
        const slotDoc = await Slot.find({ place: place, bookin: bookin });
        if (slotDoc) {
            if ((slotDoc[0]?.count + parseInt(guestno)) > 20) {
                const no = 20 - slotDoc[0].count;
                return res.status(400).json({ message: `Group of ${no} persons available for this date` });
            }
        }

        const bookinDate = new Date(bookin);
        const bookinoutDate = new Date(bookinDate.getTime() + 1 * 24 * 60 * 60 * 1000);
        console.log(bookinDate, "bookinDate");
        console.log(bookinoutDate, "bookinoutDate");

        const existingBooking = await Slot.findOne({
            place: place,
            bookin: { $lt: bookin },
            bookout: { $gte: bookin }
        });

        if (existingBooking) {
            return res.status(400).json({ message: "Slot is already filled for the selected date range" });
        }

        const selectedDate = moment(bookin);
        const minDate = moment().add(14, 'days');

        if (selectedDate.isBefore(minDate)) {
            return res.status(400).json({ message: "Booking date must be at least 14 days from now" });
        }

        if (guestno < 1) {
            return res.status(400).json({ message: "Min 1 Guest" });
        }

        const booking = await Booking.create({
            bookin, guestno, name, email, phone, place, price, owner
        });

        res.status(200).json(booking);
        console.log(booking, "aaaaaaaaaaa");
    } catch (err) {
        next(err);
    }
}

exports.getBookingdetails = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log(id)
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: 'Invalid booking ID' });
        }
      
        const bookingDoc = await Booking.findById(id);
        console.log(bookingDoc);
        res.status(200).json(bookingDoc);
    }
    catch (err) {
        next(err);
    }
}

exports.createOrder = async (req, res, next) => {
    try {
         console.log("")
        const stripe = new Stripe("sk_test_51No1l9SAjLQD2F0gFyiFek3GYMjKSL4a49jkA5gwv1SMl28petcKbqCVJt6WsOJ4wI5A0Qu8S385tGQAiEGTKps600Gr8nSBpB");
        const { id } = req.params;
        const bookingDoc = await Booking.findById(id);

        const paymentIntent = await stripe.paymentIntents.create({
            
            amount: (bookingDoc.price * bookingDoc.guestno) * 100,
            currency: 'inr',
            automatic_payment_methods: {
                enabled: true,
            },
        })


        const bookinDate = new Date(bookingDoc.bookin);
        const bookinoutDate = new Date(bookinDate.getTime() + 2 * 24 * 60 * 60 * 1000);

        const formattedBookinoutDate = bookingDoc.bookin.toISOString().split('T')[0];
        const no = parseInt(bookingDoc.guestno);
        console.log(formattedBookinoutDate, "formattedBookinoutDate")
        console.log(bookingDoc.place, "bookingDoc.place ")
        const slotDetails = await Slot.find({ place: bookingDoc.place, bookin: formattedBookinoutDate })
        console.log(slotDetails, "slotDetails")

        if (slotDetails.length > 0) {
            await Slot.findOneAndUpdate({ place: bookingDoc.place, bookin: formattedBookinoutDate }, { $inc: { count: no } });
        }
        else {
            const slotDoc = await Slot.create({
                user: req.userId,
                count: bookingDoc.guestno,
                bookin: bookingDoc.bookin,
                bookout: bookinoutDate,
                place: bookingDoc.place,
            });

        }


        console.log("paymentIntent"+paymentIntent)
         console.log("bookingDoc.owner",bookingDoc.owner)
        const orderdoc = await Order.create({
            owner: bookingDoc.owner,
            bookin: bookingDoc.bookin,
            guestno: bookingDoc.guestno,
            name: bookingDoc.name,
            email: bookingDoc.email,
            phone: bookingDoc.phone,
            place: bookingDoc.place,

            price: bookingDoc.price,
            total: bookingDoc.price * bookingDoc.guestno,
            payment_intent: paymentIntent.id,
        
        })
        console.log("paymentIntent"+paymentIntent.client_secret)
        res.status(200).send({ clientSecret: paymentIntent.client_secret })
        
    }
    catch (err) {
        next(err)
    }
}


exports.updateOrder = async (req, res, next) => {
    try {
        // Validate that req.body.payment_intent is a string
        if (typeof req.body.payment_intent !== 'string') {
            return res.status(400).json({ error: 'Invalid payment_intent format' });
        }

        // Find and update the order
        const order = await Order.findOneAndUpdate(
            { payment_intent: req.body.payment_intent },
            { $set: { orderstatus: 'Success', ordermethod: 'Stripe', deliverystatus: 'Pending' } },
            { new: true }
        );

        // Check if the order exists
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).send(order);
    } catch (err) {
        console.error(err);
        next(err);
    }
};


exports.getToursbySearch = async (req, res) => {
    const { searchQuery } = req.query
    console.log('qqqqqqqqqqqq')
    try {
        console.log('vvvvvvvvvvvvvvvvvvvbgfhvv')
        const title = new RegExp(searchQuery, "i")
        const tours = await Tour.find({ title })
        res.json(tours)
        console.log(tours)
    } catch (error) {
        console.log(error)
        res.status(404).json({ message: "something went wrongcbchbgfhgfnghjghjjghj" })
    }
}


exports.myBookings = async (req, res) => {
    try {
        console.log('Debug: Inside myBookings controller');
        console.log('User ID:', req.userId);

        // Find all bookings associated with the user and populate the 'tour' field.
        const allBookings = await Order.find({ owner: req.userId }).populate({
            path: 'place',
            model: 'Tour',
        }).sort({ _id: -1 });

        console.log('All Bookings:', allBookings);
        res.status(200).json(allBookings);
    } catch (err) {
      
        res.status(404).json({ message: "something went wrongcbchbgfhgfnghjghjjghj" })
    }
};


exports.cancelBooking = async (req, res, next) => {
    try {
        const { bookingid, cancelText } = req.body;
        const order = await Order.findById(bookingid);
        console.log("orderrrrrr", order);
        const amt = parseInt(order.total);
        console.log(amt, "amt");
        const currentDate = new Date();
        const bookingDate = new Date(order.bookin); // Convert to Date object
        const daysBeforeBooking = Math.floor((bookingDate - currentDate) / (1000 * 60 * 60 * 24));

        // Debugging: Check the value of daysBeforeBooking
        console.log("daysBeforeBooking:", daysBeforeBooking);

        const orderDeatials = await Order.findById(bookingid);
        console.log("orderdetailsssss", orderDeatials);
        const no = parseInt(orderDeatials.guestno);

        //  await Slot.findOneAndUpdate({ place: orderDeatials.place }, { $inc: { count: - no } });

        const orderDoc = await Order.findByIdAndUpdate(bookingid, { $set: { deliverystatus: 'Cancelled', reason: cancelText } });
        console.log('orderDocccccccccccc', orderDoc);
        const user = await Users.findByIdAndUpdate(req.userId, { new: true });

        if (!user) {
            return next(createError(500, "Failed to update user's wallet"));
        }
        console.log(user, "user");
        res.status(200).json(orderDoc);
    } catch (err) {
        next(err);
    }
}

exports.createChat = async (req, res) => {
    console.log("insideeee", req.body);
  
    // Ensure that req.body contains the expected data (user_id and adminid)
    const { user_id, adminid } = req.body;
  
    if (!user_id || !adminid) {
      return res.status(400).json({ error: "Missing user_id or adminid in the request body" });
    }
  
    const newChat = new ChatModel({
      members: [user_id, adminid], // Use user_id and adminid from the request body
    });
  
    try {
      const result = await newChat.save();
      res.status(200).json(result);
    } catch (error) {

        console.log("error")
      res.status(500).json(error);
    }
  };
  

  exports.userChats = async (req, res) => {
    console.log("userrrbackend"+req.params.userId)
    try {
      const chat = await ChatModel.find({
        members: { $in: [req.params.userId] },
      });
      res.status(200).json(chat);
    } catch (error) {
      res.status(500).json(error);
    }
  }
  
  exports.findChat = async (req, res) => {
    try {
      const chat = await ChatModel.findOne({
        members: { $all: [req.params.firstId, req.params.secondId] },
      });
      res.status(200).json(chat)
    } catch (error) {
      res.status(500).json(error)
    }
  }


exports.addMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;
  const message = new MessageModel({
    chatId,
    senderId,
    text,
  });
  try {
    const result = await message.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const result = await MessageModel.find({ chatId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get a User
exports.getUser = async (req, res) => {
    const id = req.params.id;
  
    try {
      const user = await Users.findById(id);
      if (user) {
        const { password, ...otherDetails } = user._doc;
  
        res.status(200).json(otherDetails);
      } else {
        res.status(404).json("No such User");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }





