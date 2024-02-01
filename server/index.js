import express from 'express';
import { Server } from "socket.io";
import * as http from 'http';
import connect from './lib/connectDB.js';
import { userModel } from "./lib/user.model.js"
import session from 'express-session';
import cors from "cors";
import bodyParser from 'body-parser';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors:{
        origin: 'http://localhost:5173',
        credentials: true
    }
});

app.use(session({ 
    secret: 'your-secret-key', 
    resave: false, 
    saveUninitialized: true,
  })); 

app.use(cors());

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

connect('mongodb+srv://mdrehan4650:Sharukhian1234@collabcanvas.iwtndj6.mongodb.net/?retryWrites=true&w=majority')

let clients = 0;
let canvas;

app.get("/api/user", async (req, res) => {
    if(req.session.user) {
        res.send(user);
    }else{
        res.send(null);
    }
})

app.post("/api/signup", async (req, res) => {
    const { username, email, password } = req.body;

    let user1 = await userModel.findOne({username: username});
    let user2 = await userModel.findOne({email: email});

    if(user1 || user2) {
        res.send({success: false, msg: "User Already Exists"});
        return;
    } 

    try{
        const newUser = new userModel({username, email, password});
        newUser.save();
        res.json({success: true ,user: {
            username, email
        }});
        req.session.user = {
            username, email
        }
    } catch(e) {
        console.log(e);
    }
});

app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;

    let user = await userModel.findOne({username: username});
    if(!user) {
        res.send({success: false, msg: "User Does Not Exist"});
        return;
    }

    if(user.password == password) {
        res.send({success: true, user: user});
        return;
    }else{
        res.send({success: false, msg: "Wrong Password"});
    }
})

io.on('connection', (socket) => {
    clients++;
    console.log("connected");

    socket.on("setUser", (user) => {
        socket.user = user;
        socket.broadcast.emit("newUser", socket.user);
        socket.emit("recievedObject", canvas);
    })

    socket.on("objectAdded", (data) => {
        canvas = data;
        socket.broadcast.emit("recievedObject", data);
    })

    socket.on("disconnection", () => {
        console.log("disconnected");
    })
});

server.listen(3000, () => {
    console.log("listening on port http://localhost:3000");
})
