const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/auth");
const messageRoute = require("./routes/messagesRoute");
const socket = require("socket.io");
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoute);

app.get("/", (req, res) => {
    res.send("Welcome to the API!");
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
    console.log(`Server started on port ${PORT}`)
);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
    
})
.then(() => {
    console.log("DB Connection Successful");
})
.catch((err) => {
    console.error("DB Connection Error:", err.message);
});

// Socket.io setup
const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    }
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });
    
    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-receive", data.msg);
        }
    });
});

// Basic error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
