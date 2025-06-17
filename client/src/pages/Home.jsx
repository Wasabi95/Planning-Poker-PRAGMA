// src/pages/Home.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setRoom, setUser } from "../features/roomSlice";
import { nanoid } from "nanoid";
import socket from "../socket";

const Home = () => {
  const [roomName, setRoomName] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("player");
  const [nameError, setNameError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

const validateRoomName = (name) => {
  const trimmed = name.trim();
  
  // Check empty
  if (trimmed === "") return false;
  
  // Check length (MUST BE AT LEAST 5 CHARACTERS)
  if (trimmed.length < 5) return false; // Minimum 5 characters
  if (trimmed.length > 20) return false; // Maximum 20 characters
  
  // Check for special characters
  if (/[^a-zA-Z0-9\s]/.test(trimmed)) return false;
  
  // Check if only numbers
  if (/^\d+$/.test(trimmed)) return false;
  
  // Check digit count (MAXIMUM 3 DIGITS)
  const digitCount = (trimmed.match(/\d/g) || []).length;
  if (digitCount > 3) return false;
  
  return true;
};

  const createRoom = (e) => {
    e.preventDefault();

    // Validate name first with MINIMUM 3 CHARACTERS
const trimmedName = name.trim();
if (!trimmedName) {
  setNameError("Please enter your name");
  return;
} else if (trimmedName.length < 5) { // Should be 5, not 3
  setNameError("Name must be at least 5 characters");
  return;
} else {
  setNameError(""); // Clear error if valid
}

    // Then validate room name
    if (!validateRoomName(roomName)) {
      alert(
        "Room name must be 5-20 characters, max 3 digits, not only numbers, and no special characters"
      );
      return;
    }

    const roomId = nanoid();
    const userRole = role || "player";

    // Redux state
    dispatch(setRoom({ id: roomId, name: roomName.trim() }));
    dispatch(setUser({ name: trimmedName, role: userRole }));

    // Socket event
    socket.emit("createRoom", {
      roomId,
      roomName: roomName.trim(),
      user: { name: trimmedName, role: userRole },
    });

    // Redirect
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Create a Planning Poker Room</h2>
      <form onSubmit={createRoom} className="p-4 shadow rounded bg-light">
        <div className="mb-3">
          <label className="form-label">Room Name</label>
          <input
            type="text"
            className="form-control"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="e.g. Sprint Poker, Dev Team, etc."
            required
          />
          <small className="form-text text-muted">
            5-20 characters, max 3 digits, no special characters
          </small>
        </div>
        <div className="mb-3">
          <label className="form-label">Your Name</label>
          <input
            type="text"
            className={`form-control ${nameError ? "is-invalid" : ""}`}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError("");
            }}
            placeholder="e.g. Antonio"
            required
          />
          {nameError && <div className="invalid-feedback">{nameError}</div>}
          <small className="form-text text-muted">
            Minimum 3 characters
          </small>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="role-select">
            Role
          </label>
          <select
            className="form-select"
            id="role-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="player">Player</option>
            <option value="spectator">Spectator</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Create Room
        </button>
      </form>
    </div>
  );
};

export default Home;