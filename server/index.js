import express from 'express';
import { Server } from "socket.io";
import * as http from 'http';
import connect from './lib/connectDB.js';
import { userModel } from "./lib/user.model.js"
import session from 'express-session';
import cors from "cors";
// import bodyParser from 'body-parser';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3000
const server = http.createServer(app);
const io = new Server(server, {
    cors:{
        origin: '*',
        credentials: true
    }
});

app.use(session({
    secret: 'dcvbnmklkjnbvcxzxcvghjk', 
    resave: false, 
    saveUninitialized: true,
  })); 

app.use(cors());

app.use(express.urlencoded());
app.use(express.json());

connect(process.env.MONGO_URI);

let rooms = {
    'test': {canvas: null, clients: 0}
};

app.get("/api/user", async (req, res) => {
    if(req.session.user) {
        res.send({success: true, user});
    }else{
        res.send({success: false, user: null});
    }
})

app.get("/api/room/:id", (req, res) => {
    const { id } = req.params;
    for(let key of Object.keys(rooms)) {
        if(key == id) {
            res.send({success: true});
            return;
        }
    }
    res.send({success: false});
})

app.get("/api/logout", (req, res) => {
    req.session.user = null;
    res.sendStatus(200);
    res.end();
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
    console.log("connected");

    socket.on("objectAdded", ({data, roomID}) => {
        rooms[roomID]['canvas'] = data;
        socket.in(roomID).emit("recievedObject", data);
    });

    socket.on("joinRoom", ({roomID, username}) => {
        if(!rooms[roomID]) {
            rooms[roomID] = {};
            rooms[roomID]['clients'] = 1;
        }else{
            rooms[roomID]['clients']++;
        }
        socket.join(roomID);
        io.in(roomID).emit("newUserJoined", {users: rooms[roomID]['clients'], user: username});
        console.log(rooms)
        socket.emit("recievedObject", rooms[roomID]['canvas']);
    })

    socket.on("leaveRoom", ({roomID, username}) => {
        console.log("leaved");
        rooms[roomID]['clients']--;
        if(rooms[roomID]['clients'] == 0) {
            delete rooms[roomID];
        }else{
            io.sockets.in(roomID).emit("userLeft", {users: rooms[roomID]['clients'], user: username});
        }
        socket.leave(roomID);
        console.log(rooms);
    })

    socket.on("chatSend", ({msg, username, roomID}) => {
        socket.in(roomID).emit("msgRecieved", {msg:msg, username:username});
    })

    socket.on("disconnection", (data) => {
        console.log(data);
        console.log("disconnected");
    })
});

server.listen(port, () => {
    console.log(`listening on port http://localhost:${port}`);
})
