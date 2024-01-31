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
import clicker from "../assets/clicker.png"
import { useUserContext } from "../contexts/UserContext.js";
import { useNavigate } from "react-router-dom";

function WhiteBoard() {

  const { user } = useUserContext();
  const nav = useNavigate();

  if(user === null) {
    nav("/login");
  }

  const [fillColor, setFillcolor] = useState("#ff004f");
  const [mode, setMode] = useState(true);
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [brushColor, setBrushColor] = useState("#ff004f");
  const [brushWidth, setBrushWidth] = useState(5);

  let canvas;
  useEffect(() => {
    socket.connect();
    canvas = new fabric.Canvas("canvas", {
      width: window.innerWidth * 0.7,
      height: window.innerHeight * 0.9,
      backgroundColor: "white",
      isDrawingMode: mode,
    });

    canvas.on("mouse:move", (e) => {
      socket.emit("objectAdded", canvas.toJSON());
    });

    socket.on("recievedObject", (data) => {
      canvas.loadFromJSON(data);
    });

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
    socket.emit("objectAdded", canvas.toJSON());
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
    socket.emit("objectAdded", canvas.toJSON());
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
    socket.emit("objectAdded", canvas.toJSON());
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
    socket.emit("objectAdded", canvas.toJSON());
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
    socket.emit("objectAdded", canvas.toJSON());
  };

  const clear = () => {
    if (!canvas) return;
    canvas.clear();
    socket.emit("objectAdded", canvas.toJSON());
  };

  const erase = () => {
    if (!canvas) return;
    let active = canvas.getActiveObjects();
    active.forEach((obj) => {
      canvas.remove(obj);
    });
    socket.emit("objectAdded", canvas.toJSON());
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
    <div className="container-fluid bg-light p-2 rounded border">
      <div className="d-flex flex-row align-items-center">
      <button
        className={mode ? "btn btn-light active" : "btn btn-light"}
        onClick={() => setMode((prev) => !prev)}
      >
        <img src={pencil}/>
      </button>

      <input
        type="color"
        id="color"
        value={brushColor}
        style={{width:'30px', border: 'none', backgroundColor: 'inherit', cursor: 'pointer'}}
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
      <label htmlFor="color" style={{cursor: 'pointer'}}><img src={bucket}/></label>
      <input
        type="color"
        id="color"
        value={fillColor}
        style={{width:'30px', border: 'none', backgroundColor: 'inherit', cursor: 'pointer'}}
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
      />

      <button className="btn btn-light mx-2" onClick={() => addRect()}>
        <img src={clicker}/>
      </button>
      <button className="btn btn-light mx-2" onClick={() => addRect()}>
        <img src={rectangle}/>
      </button>
      <button className="btn btn-light mx-2" onClick={() => addTri()}>
      <img src={triangle}/>
      </button>
      <button className="btn btn-light mx-2" onClick={() => addCir()}>
      <img src={circle}/>
      </button>
      <button className="btn btn-light mx-2" onClick={() => addLine()}>
      <img src={line}/>
      </button>
      <button className="btn btn-light mx-2" onClick={() => addEllipse()}>
      <img src={ellipse}/>
      </button>
      <button className="btn btn-light mx-2" onClick={() => addTextInput()}>
      <img src={text}/>
      </button>
      <button className="btn btn-light mx-2" onClick={() => erase()}>
      <img src={eraser}/>
      </button>
      <button className="btn btn-light mx-2" onClick={() => clear()}>
      <img src={dustbin}/>
      </button>
      </div>
      <canvas id="canvas" className="border border-5"></canvas>
    </div>
  );
}

export default WhiteBoard;
