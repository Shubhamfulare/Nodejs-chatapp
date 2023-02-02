const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");
const serverless = require("serverless-http");
const { Router } = require("express");

const app = express();
const server = http.createServer(app);

const io = socketio(server);
app.use(cors())
app.use(Router)
app.use('function/api/',Router)

const port=4500 || process.env.port
const users=[];
io.on("connection", socket => {
    console.log("New client connected");
    
    socket.on('joined',({name})=>{
      users [socket.id]=name;
      socket.broadcast.emit('userjoined',{user: users[socket.id], message:" joined "})
    })
    socket.emit('welcome',()=>{

    })


    socket.on('message',(data)=>{
      console.log(users)
      console.log(data)
      io.emit('sendMessage',{user:users[data.id],message:data.message,id:data.id})
    })


    socket.on("dis", () => {
      socket.broadcast.emit('userLeft',{user: users[socket.id], message: "user left "})
      console.log("Client disconnected");
    });
  });


server.listen(port,()=>{
    console.log(`server started at ${port}`)
})
module.exports = app;
module.exports.handler= serverless(app);