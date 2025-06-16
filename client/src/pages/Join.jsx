// src/pages/Join.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setRoom, setUser, setPlayers } from "../features/roomSlice";
import socket from "../socket";

const Join = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("player"); // Add role state
  const { roomId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Add socket listener BEFORE joining
  useEffect(() => {
    socket.on("updatePlayers", (players) => {
      dispatch(setPlayers(players));
    });

    return () => socket.off("updatePlayers");
  }, [dispatch]);

  const joinRoom = () => {
    // Create complete user object
    const user = { name, role };
    
    // Update Redux
    dispatch(setRoom({ id: roomId }));
    dispatch(setUser(user));
    
    // Emit with complete user data
    socket.emit("joinRoom", { roomId, user }); // Send user object
    
    navigate(`/room/${roomId}`);
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

        {/* Add role selection */}
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