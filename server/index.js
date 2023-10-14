const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const http = require('http'); // Import Node's built-in HTTP module
const socketIo = require('socket.io'); // Import Socket.IO

const app = express();

const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.get('/test', (req, res) => {
  res.json('test');
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const server = http.createServer(app); // Create an HTTP server

// Socket.IO setup
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Change this to your frontend URL
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  // add new User
  socket.on("new-user-add", (newUserId) => {
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
      console.log("New User Connected", activeUsers);
    }
    io.emit("get-users", activeUsers);
  });

  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User Disconnected", activeUsers);
    io.emit("get-users", activeUsers);
  });

  // send message to a specific user
   // send message to a specific user
   socket.on("send-message", (data) => {
    const { receiverId } = data;
    console.log('receiverId',receiverId)
    console.log('activeUsers',activeUsers)
    const user = activeUsers.find((user) => user.userId === receiverId);
    console.log('user',user)
    console.log("Sending from socket to :", receiverId)
    console.log("Data: ", data)
    if (user) {
      io.to(user.socketId).emit("recieve-message", data);
    }
  });
});



const mongoURI ='mongodb+srv://ysuhail444:12FEFE2I4zYCdOTf@cluster0.0vbxqzr.mongodb.net/?retryWrites=true&w=majority';

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB has been started successfully');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

app.use('/', userRouter);
app.use('/admin', adminRouter);

const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
