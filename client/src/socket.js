import { io } from "socket.io-client";

export const socket = io('https://collabcanvas-backend.onrender.com', {
    autoConnect: false
});