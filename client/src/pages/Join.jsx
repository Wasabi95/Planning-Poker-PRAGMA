// src/pages/Join.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setRoom, setUser, setPlayers } from "../features/roomSlice";
import socket from "../socket";

const Join = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("player");
  const { roomId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("updatePlayers", (players) => {
      dispatch(setPlayers(players));
    });

    socket.on("roomInfo", ({ roomName }) => {
      dispatch(setRoom({ id: roomId, name: roomName }));
      navigate(`/room/${roomId}`);
    });

    return () => {
      socket.off("updatePlayers");
      socket.off("roomInfo");
    };
  }, [dispatch, navigate, roomId]);

  // Add validation function here
  const validateName = (name) => {
    return name.trim() !== '';
  };

  // Update joinRoom function with validation
  const joinRoom = () => {
    if (!validateName(name)) {
      alert('Please enter your name');
      return;
    }
    
    const user = { name, role };
    dispatch(setUser(user));
    socket.emit("joinRoom", { roomId, user });
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Join Planning Poker Room</h2>
      <div className="p-4 shadow rounded bg-light">
        <div className="mb-3">
          <label className="form-label">Room ID</label>
          <input
            type="text"
            className="form-control mb-2"
            value={roomId}
            readOnly
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Your Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Maria"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Role</label>
          <select
            className="form-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="player">Player</option>
            <option value="spectator">Spectator</option>
          </select>
        </div>

        <button onClick={joinRoom} className="btn btn-success w-100">
          Join Room
        </button>
      </div>
    </div>
  );
};

export default Join;