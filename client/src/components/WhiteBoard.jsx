import React, { useEffect, useState } from "react";
import { fabric } from "fabric";
import { socket } from "../socket.js";
import pencil from "../assets/pencil.png";
import rectangle from "../assets/rectangle.png";
import circle from "../assets/circle.png";
import triangle from "../assets/triangle.png";
import line from "../assets/line.png";
import ellipse from "../assets/ellipse.png";
import bucket from "../assets/bucket.png";
import text from "../assets/text.png";
import dustbin from "../assets/dustbin.png";
import eraser from "../assets/eraser.png";
import clicker from "../assets/clicker.png";
import download from "../assets/download.png";
import people from "../assets/people.png";
import { useParams, useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext.js";
import axios from "axios";

let canvas;

const style = {
	backgroundColor: '#f1f1f1',
	height: '95%',
	width: '100%',
	overflowY: 'scroll',
	display: 'flex',
	flexDirection: 'column',
	margin: 0
}

function WhiteBoard() {
	const nav = useNavigate();
	const { user, setUser } = useUserContext();

	const [fillColor, setFillcolor] = useState("#ff004f");
	const [mode, setMode] = useState(true);
	const [strokeWidth, setStrokeWidth] = useState(2);
	const [strokeColor, setStrokeColor] = useState("#000000");
	const [brushColor, setBrushColor] = useState("#ff004f");
	const [brushWidth, setBrushWidth] = useState(5);
	const [msg, setMsg] = useState("");
	const [chat, setChat] = useState("");
	const [client, setClient] = useState(1);

	const { id } = useParams();

	const handleUser = async () => {
		if (user) return;
		try {
		  let res = await axios.get("/api/user", {baseURL: 'https://collabcanvas-backend.onrender.com'});
		  if (res.data.success) {
			setUser(res.data.user);
		  } else {
			nav("/login");
		  }
		} catch (e) {
		  console.log(e);
		}
	  };

	const download_image = () => {
		let canvas = document.getElementById("canvas");
		let image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
		let link = document.createElement('a');
		link.download = "my-image.png";
		link.href = image;
		link.click();
	  }

	const sendChat = () => {
		if(chat === '') return;
		socket.emit("chatSend", {username: user.username, msg:chat, roomID: id});
		let box = document.getElementById('box')
		box.innerHTML += `<div class="rounded border p-1 text-end bg-primary-subtle m-1" style="align-self: flex-end;width:fit-content;max-width:300px;word-wrap:break-word">${chat}</div>`;
		box.scrollTo(0, box.scrollHeight);
		setChat("");
	}

	const recievedChat = (msg, username) => {
		let box = document.getElementById('box')
		box.innerHTML += `<div class="rounded border p-1 text-end bg-primary-subtle m-1" style="align-self: flex-start;width:fit-content;max-width:300px;word-wrap:break-word"><strong>${username}:</strong>${msg}</div>`;
		box.scrollTo(0, box.scrollHeight);
	}

	useEffect(() => {

		if(user === null) {
			handleUser();
		}

		socket.connect();

		socket.emit("joinRoom", { roomID: id, username: user.username });

		canvas = new fabric.Canvas("canvas", {
			width: window.innerWidth * 0.7,
			height: window.innerHeight * 0.75,
			backgroundColor: "white",
			isDrawingMode: mode,
		});

		canvas.on("mouse:move", (e) => {
			socket.emit("objectAdded", { data: canvas.toJSON(), roomID: id });
		});

		socket.on("recievedObject", (data) => {
			canvas.loadFromJSON(data);
		});

		socket.on("newUserJoined", ({ users, user }) => {
			setMsg((prev) => `${user} Joined The Meeting ! ${users} are now in the meeting`);
			setClient(users);
		});

		socket.on("msgRecieved", ({msg, username}) => {
			recievedChat(msg, username);
		})

		socket.on("userLeft", ({ users, user }) => {
	setMsg(`${user} Left The Meeting ! ${users} are now in the meeting`);
	setClient(users);

		});

		window.addEventListener("beforeunload", (e) => {
			socket.emit("leaveRoom", { roomID: id, username: user.username });
		})
		
		// window.addEventListener("resize", (e) => {
		// 	canvas.setDimensions({width: window.innerWidth*0.7, height: window.innerHeight*0.75});
		// 	document.getElementById("canvas").style.width = window.innerWidth*0.7;
		// })

		return () => {
			socket.disconnect();
		}
	}, []);

	useEffect(() => {
		canvas.set({ isDrawingMode: mode });
	}, [mode]);

	useEffect(() => {
		canvas.set({ strokeWidth });
	}, [strokeWidth]);

	useEffect(() => {
		canvas.freeDrawingBrush.color = brushColor;
	}, [brushColor]);

	useEffect(() => {
		canvas.freeDrawingBrush.width = brushWidth;
	}, [brushWidth]);

	const addRect = () => {
		let obj = new fabric.Rect({
			width: 50,
			height: 50,
			fill: fillColor,
			strokeWidth,
			stroke: strokeColor,
		});
		canvas.add(obj);
		socket.emit("objectAdded", { data: canvas.toJSON(), roomID: id });
		setMode(false);
	};

	const addTri = () => {
		let obj = new fabric.Triangle({
			width: 50,
			height: 50,
			angle: 0,
			originX: "center",
			originY: "center",
			fill: fillColor,
			stroke: strokeColor,
			strokeWidth,
		});
		canvas.add(obj);
		socket.emit("objectAdded", { data: canvas.toJSON(), roomID: id });
		setMode(false);
	};

	const addCir = () => {
		let obj = new fabric.Circle({
			radius: 20,
			fill: fillColor,
			strokeWidth,
			stroke: strokeColor,
		});
		canvas.add(obj);
		setMode(false);
		socket.emit("objectAdded", { data: canvas.toJSON(), roomID: id });
	};

	const addLine = () => {
		let obj = new fabric.Line([50, 100, 100, 100], {
			left: 170,
			top: 150,
			stroke: strokeColor,
			strokeWidth,
		});
		canvas.add(obj);
		setMode(false);
		socket.emit("objectAdded", { data: canvas.toJSON(), roomID: id });
	};

	const addEllipse = () => {
		let obj = new fabric.Ellipse({
			rx: 40,
			ry: 50,
			radius: 30,
			fill: fillColor,
			stroke: strokeColor,
			strokeWidth: strokeWidth,
		});
		canvas.add(obj);
		setMode(false);
		socket.emit("objectAdded", { data: canvas.toJSON(), roomID: id });
	};

	const clear = () => {
		if (!canvas) return;
		canvas.clear();
		socket.emit("objectAdded", { data: canvas.toJSON(), roomID: id });
	};

	const erase = () => {
		if (!canvas) return;
		let active = canvas.getActiveObjects();
		active.forEach((obj) => {
			canvas.remove(obj);
		});
		socket.emit("objectAdded", { data: canvas.toJSON(), roomID: id });
	};

	const addTextInput = () => {
		const textInput = new fabric.Textbox("Enter Text", {
			left: 100,
			top: 100,
			fontFamily: "ubuntu",
			width: 30,
			height: 40,
		});
		canvas.add(textInput);
		canvas.isDrawingMode = false;
		setMode(false);
	};

	return (

		<div className="container-fluid bg-light d-flex flex-column align-items-center" style={{height: '100vh'}}>
			<div className="container-fluid d-flex flex-row align-items-center w-100 mt-3 justify-content-evenly">
			<div className='w-50 mx-2'>{msg?(<div className="alert alert-primary text-center w-100"> 
            <strong>{msg}!</strong>
        </div>):""}</div>
		<div>
				<span className="bg-light p-2 mx-3 rounded border text-secondary"><img src={people} /> {client}</span>
				<span className="bg-primary-subtle p-2 rounded border text-secondary">Room ID: <strong>{id}</strong></span>
				<button
					type="button"
					className="btn btn-primary mx-4"
					onClick={(e) => {
						socket.emit("leaveRoom", { roomID: id, username: user.username });
						nav("/");
					}}
				>
					Leave Room
				</button>
			</div>
			</div>
			<div className="d-flex flex-row align-items-center justify-content-start w-100 px-3 mb-2">
				<button
					className={mode ? "btn btn-light active" : "btn btn-light"}
					onClick={() => setMode(true)}
				>
					<img src={pencil} />
				</button>

				<input
					type="color"
					id="color"
					value={brushColor}
					style={{
						width: "30px",
						border: "none",
						backgroundColor: "inherit",
						cursor: "pointer",
					}}
					onChange={(e) => setBrushColor(e.target.value)}
				/>
				<input
					type="range"
					id="brushwidth"
					min={1}
					max={25}
					value={brushWidth}
					onChange={(e) => setBrushWidth(Number(e.target.value))}
				/>
				<span>{brushWidth}</span>

				<button className="btn btn-light mx-2 d-inline-flex flex-row">
					<label htmlFor="color" style={{ cursor: "pointer" }}>
						<img src={bucket} />
					</label>
					<input
						type="color"
						id="color"
						value={fillColor}
						style={{
							width: "30px",
							border: "none",
							backgroundColor: "inherit",
							cursor: "pointer",
						}}
						onChange={(e) => setFillcolor(e.target.value)}
					/>
				</button>

				<input
					type="range"
					id="strokewidth"
					min={0}
					max={15}
					value={strokeWidth}
					onChange={(e) => setStrokeWidth(Number(e.target.value))}
				/>
				<span>{strokeWidth}</span>

				<input
					type="color"
					id="color"
					value={strokeColor}
					onChange={(e) => setStrokeColor(e.target.value)}
					style={{
						width: "30px",
						border: "none",
						backgroundColor: "inherit",
						cursor: "pointer",
					}}
				/>

				<button className={!mode ? "btn btn-light active" : "btn btn-light"} onClick={() => setMode(false)}>
					<img src={clicker} />
				</button>
				<button className="btn btn-light mx-2" onClick={() => addRect()}>
					<img src={rectangle} />
				</button>
				<button className="btn btn-light mx-2" onClick={() => addTri()}>
					<img src={triangle} />
				</button>
				<button className="btn btn-light mx-2" onClick={() => addCir()}>
					<img src={circle} />
				</button>
				<button className="btn btn-light mx-2" onClick={() => addLine()}>
					<img src={line} />
				</button>
				<button className="btn btn-light mx-2" onClick={() => addEllipse()}>
					<img src={ellipse} />
				</button>
				<button className="btn btn-light mx-2" onClick={() => addTextInput()}>
					<img src={text} />
				</button>
				<button className="btn btn-light mx-2" onClick={() => erase()}>
					<img src={eraser} />
				</button>
				<button className="btn btn-light mx-2" onClick={() => clear()}>
					<img src={dustbin} />
				</button>
				<button className="btn btn-light mx-2" onClick={() => download_image()}>
					<img src={download} />
				</button>
			</div>
			<div className="container-fluid d-flex flex-row align-items-center">
				<canvas id="canvas" className="border border-3 rounded"></canvas>
				<div className="container d-flex flex-column border rounded p-2 w-25 border-4" style={{width:'25%', height: '100%'}}>
						<div id="box" style={style}>
							
						</div>
						<div className="container-fluid d-flex flex-row align-items-center">
						<input type="text" className="rounded p-2 border border-2 w-75 h-100" placeholder="Enter Message" value={chat} onChange={(e) => setChat(e.target.value)} onKeyPress={(e) => {
							if(e.key === 'Enter') {
								sendChat();
							}
						}}/>
						<button className="btn btn-primary mx-2" onClick={sendChat}>Send</button>
						</div>
				</div>
			</div>
		</div>
	);
}

export default WhiteBoard;
