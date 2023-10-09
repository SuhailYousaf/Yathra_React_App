const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const upload = require('../config/multer')

router.post('/login', adminController.adminLogin);
router.post('/register', adminController.adminRegister);


router.post('/createtour', upload.array('imageFiles', 4), adminController.createTour);
router.get('/createtour', adminController.getTours);
router.get('/users',auth, adminController.getUsers);
router.post('/addcategory', adminController.addCategory);
router.get('/listcategory', adminController.listCategory);
router.delete('/deletecategory/:id', adminController.deleteCategory);
router.get('/getcategory',auth, adminController.getCategory);
router.patch('/blockuser', adminController.blockUser);
router.patch('/unblockuser', adminController.unBlockuser);
router.delete('/deletepackage/:id', adminController.deletePackage);
router.get('/allorders',auth, adminController.allOrders)
router.patch('/bookingStatus', adminController.bookingStatus)

router.get('/admin/:id', adminController.getAdmin)
router.get('/adminid', adminController.getAdminID)
router.get('/adminChats/:adminid', adminController.adminChats);

module.exports = router;
