import axios from "axios"
const API = axios.create({ baseURL: "http://localhost:4000" })

API.interceptors.request.use((req) => {
  if (localStorage.getItem("userprofile")) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("userprofile")).token
      }`;
  }
  console.log( 'req.headers.Authorization'+ req.headers.Authorization)
  return req;
});


API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("profile")).token
      }`;
  }
  console.log( 'req.headers.Authorization'+ req.headers.Authorization)
  return req;
});

export const usersignIn = (formData) => API.post("/login", formData)
export const userregister = (formData) => API.post("/register", formData)
export const bookPackage=(packagedata)=>API.post('/bookings',packagedata)
export const bookingDetailes=(id)=>API.get(`/bookingdetails/${id}`)
export const payment=(id)=>API.post(`/create-payment-intent/${id}`)
export const orderdetailes=({ payment_intent })=>API.put('/order',{ payment_intent })
export const getToursBySearch=(searchQuery)=>API.get(`/search?searchQuery=${searchQuery}`)
export const getBookings=()=>API.post('/mybookings')
export const cancelbookings=({ bookingid, cancelText })=>API.post('/cancelbooking',{ bookingid, cancelText })
export const adminBooking=()=>API.get('/admin/allorders')
export const adminBookingstatus=({id,status})=>API.patch('/admin/bookingStatus',{id,status})



export const ListTours = () => API.get('/createtour')
export const getTour = (id) => API.get(`/getTour/${id}`);

 


export const adminlogin = (formData) => API.post("/admin/login", formData)
export const createTour = (formData) => API.post('/admin/createtour', formData)
export const getTours = () => API.get('/admin/createtour')
export const getUsers =() => API.get('/admin/getUsers')
export const adminaddCategory=(categorydata)=>API.post('/admin/addcategory',categorydata)
export const adminCategoryList=()=>API.get('/admin/listcategory')
export const adminDeletecategory=(id)=>API.delete(`/admin/deletecategory/${id}`)
export const getCategory=()=>API.get('/admin/getcategory')
export const adminBlockUser=(email)=>API.patch('/admin/blockuser', { email })
export const adminUnBlockagent=(email)=>API.patch('/admin/unblockagent',{email})
export const adminUnblockUser=(email)=>API.patch('/admin/unblockuser',{email})
export const adminUsers = () => API.get('/admin/users')
export const adminDeletePackage=(id)=>API.delete(`/admin/deletepackage/${id}`)

