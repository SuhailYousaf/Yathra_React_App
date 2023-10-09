const jwt = require('jsonwebtoken');

const jwtSecret = 'sakdfnsadklfnasdgsdfgsdgfg';
const Admin = require('../modelsss/admin')
const bcrypt = require('bcryptjs');
const bcryptSalt = bcrypt.genSaltSync(10);
const Users = require('../modelsss/user');
const Category = require('../modelsss/category')
const Tour = require('../modelsss/tour'); // Import your Tour model
const cloudinary = require('../config/cloudinary') // Import Cloudinary
const Order =require('../modelsss/order')
const Slot = require('../modelsss/slot');
const ChatModel =require('../modelsss/ChatModel')

exports.adminRegister = async (req, res) => {
    console.log('heeeeeeeeeeeeeeeeeeeee')
    const { name, email, number, password } = req.body;
    try {
        const AdminDoc = await Admin.create({
            name,
            email,
            number,
            password: bcrypt.hashSync(password, bcryptSalt)

        })
        res.json(AdminDoc);
        console.log('jjjjjjjjjjjjjjjjjj')
    }
    catch (e) {
        res.status(422).json(e)
    }
}

exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const adminDoc = await Admin.findOne({ email });

        if (!adminDoc) {
            return res.status(404).json({ error: 'Admin not found', message: 'No admin with this email' });
        }

        if (password !== adminDoc.password) {
            return res.status(401).json({ error: 'Authentication failed', message: 'Invalid credentials' });
        }

        const token = jwt.sign({ email: adminDoc.email, id: adminDoc._id }, jwtSecret, {
            expiresIn: '1h',
        });

        res.status(201).json({ adminDoc, token });
    } catch (e) {
        res.status(500).json({ error: 'Server error', message: e.message });
    }
}



exports.createTour = async (req, res) => {
    const tourData = req.body; // Assuming you have the required data in the request body
  
    try {
      const cloudImageUrls = []; // To store Cloudinary image URLs
  
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No images uploaded.' });
      }
  
      // Upload images to Cloudinary in parallel
      await Promise.all(
        req.files.map(async (image) => {
          try {
            const result = await cloudinary.uploader.upload(image.path); // Upload image to Cloudinary
            cloudImageUrls.push(result.secure_url); // Store the secure URL
          } catch (uploadError) {
            // Handle the image upload error here, you can choose to skip this image and continue with the next one
            return res.status(500).json({ message: 'Image upload failed' });
          }
        })
      );
  
      // Create a new Tour object with the data from the request
      const newTour = new Tour({
        ...tourData,
        images: cloudImageUrls,   // Store the Cloudinary image URLs
        Creator: req.adminId,    // Assuming you have adminId in the request
        createdAt: new Date().toISOString(),
      });
  
      // Save the new tour to your database
      const savedTour = await newTour.save();
  
      // Respond with the created tour including Cloudinary image URLs
      res.status(201).json({ message: 'Tour created successfully', tour: savedTour });
    } catch (error) {
      
      res.status(500).json({ message: "Something went wrong" });
    }
  };
  
exports.getTours=async (req,res)=>{
    try{
        
        const tours=await Tour.find()
        res.status(200).json(tours)
       
    }catch(error){
        res.status(404).json({message:"something went wrong" })
    }
};


exports.getUsers=async (req,res)=>{
    try{
       
        // const users=await User.find()
        // res.status(200).json(users)
        const userData = await Users.find()
      console.log(userData)
        res.json(userData)
        
    }catch(error){
        res.status(404).json({message:"something went wrong" })
    }
}


exports.getAdmin = async (req, res) => {
  const id = req.params.id;
  console.log("adminbackend" + id);
  try {
    // Ensure that the Admin model is imported before using it
    const admin = await Admin.findById(id);
    console.log("adminnnntr", admin);
    if (admin) {
      const { password, ...otherDetails } = admin._doc;
      console.log("Admin._doc", admin._doc);
      res.status(200).json(otherDetails);
    } else {
      res.status(404).json("No such User");
    }
  } catch (error) {
    console.error("error",error); // Log the error for debugging
    res.status(500).json(error);
  }
};

exports.getAdminID = async (req, res) => {
    console.log("adminddddaaaaa")
  try {
    const admin = await Admin.findOne(); // Find one admin document, you can add conditions as needed
    if (admin) {
      const id = admin._id;
      console.log('adminId', id);
      res.status(200).json({ adminId: id }); // Return the adminId in a JSON object
    } else {
      res.status(404).json({ error: 'Admin not found' });
    }
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};





exports.addCategory = async (req, res, next) => {
    try {
        const { title, description,
        } = req.body;
        const categoryDoc = await Category.create({
            title,
            description,
        })
        console.log(categoryDoc, "jsdjjfjhsdhh")
        res.json(categoryDoc);
    }
    catch (err) {
        next(err);
    }
}

exports.listCategory = async (req, res) => {
    const categoryData = await Category.find()
    res.json(categoryData)
}

exports.deleteCategory = async (req, res) => {
    const { id } = req.params; 

    try {
        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({ message: `No category found with id: ${id}` });
        }

        // Toggle the status field between true and false
        category.status = !category.status;

        // Save the updated category
        const updatedCategory = await category.save();

        res.json({ message: 'Category status updated successfully', category: updatedCategory });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};




exports.getCategory = async (req, res) => {
    try {
        const category = await Category.find({ status: true })
        res.status(200).json(category );
    } catch (error) {
        res.status(404).json({ message: "Something went wrong" });
    }
};

exports.blockUser = async (req, res, next) => {
    try {
        const { email } = req.body;


        const user = await Users.findOne({ email }); // Find the user by email

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.status = false; // Set the status to false to block the user
        await user.save(); // Save the updated user

        res.status(200).json({ success: true, message: 'User blocked successfully' });
    } catch (err) {
        next(err);
    }
};
exports.unBlockuser = async (req, res, next) => {
    try {
        const { email } = req.body;
        await Users.updateOne({ email: email }, { status: true });
        res.json({ success: true, message: 'User unblocked successfully' });
    } catch (err) {
        next(err);
    }
};

exports.deletePackage = async (req, res) => {
    const { id } = req.params;

    try {
        const tour = await Tour.findById(id);

        if (!tour) {
            return res.status(404).json({ message: `No package found with id: ${id}` });
        }

        // Toggle the 'status' field between true and false
        tour.status = !tour.status;

        // Save the updated package
        await tour.save();

        res.json({ message: 'Package status toggled successfully', status: tour.status });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

exports.allOrders = async (req, res, next) => {
    try {
        const allBookings = await Order.find().populate({
            path: 'place',
            model: 'Tour',
        });
        res.status(200).json(allBookings)
    }
    catch (err) {
        next(err);
    }

}

exports.bookingStatus = async (req, res, next) => {
    try {
        const { id, status } = req.body;
        console.log(id, status);
        const orderDeatials = await Order.findById(id);
        const no = parseInt(orderDeatials.guestno);
        const formattedBookinoutDate = orderDeatials.bookin.toISOString().split('T')[0];

        if (status == 'Pending') {
            await Slot.findOneAndUpdate({ place: orderDeatials.place, bookin: formattedBookinoutDate }, { $inc: { count: + no } });
        }

        if (status == 'Cancelled') {
            await Slot.findOneAndUpdate({ place: orderDeatials.place, bookin: formattedBookinoutDate }, { $inc: { count: - no } });
        }

        if (status == 'Success') {
            await Slot.findOneAndUpdate({ place: orderDeatials.place, bookin: formattedBookinoutDate }, { $inc: { count: - no } });
        }

        const orderDoc = await Order.findByIdAndUpdate(id, {
            $set: {
                deliverystatus: status
            }
        })
        res.status(200).json(orderDoc);
    }
    catch (err) {
        next(err);
    }
}


exports.adminChats = async (req, res) => {
    console.log("adminbackend"+req.params.adminid)
    try {
      const chat = await ChatModel.find({
        members: { $in: [req.params.adminid] },
      });
      console.log("chat",chat)
      res.status(200).json(chat);
    } catch (error) {
        console.log("error")
      res.status(500).json(error);
    }
  }