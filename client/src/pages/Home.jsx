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

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const createRoom = (e) => {
    e.preventDefault();
    const roomId = nanoid();

    // Redux state
    dispatch(setRoom({ id: roomId, name: roomName }));
    dispatch(setUser({ name, role }));

    // Socket event
    socket.emit("createRoom", {
      roomId,
      roomName,
      user: { name, role },
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
        </div>

        <div className="mb-3">
          <label className="form-label">Your Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Antonio"
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

        <button type="submit" className="btn btn-primary w-100">
          Create Room
        </button>
      </form>
    </div>
  );
};

export default Home;
