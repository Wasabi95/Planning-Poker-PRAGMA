// File: src/pages/Room.jsx
// File: src/pages/Room.jsx
// File: src/pages/Room.jsx
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { setPlayers, setRoom } from "../features/roomSlice";
import socket from "../socket";

const Room = () => {
  const { roomId } = useParams();
  const dispatch = useDispatch();

  const { room, user, players } = useSelector((state) => ({
    room: state.room.roomName,

    user: state.room.user || { name: state.room.name, role: "player" },
    players: state.room.players || [],
  }));

useEffect(() => {
  socket.on("updatePlayers", (data) => {
    dispatch(setPlayers(data));
  });

  socket.on("roomInfo", ({ roomName }) => {
    dispatch(setRoom({ id: roomId, name: roomName }));
  });

  return () => {
    socket.off("updatePlayers");
    socket.off("roomInfo");
  };
}, [dispatch, roomId]);


  const copyLink = () => {
    const roomLink = `${window.location.origin}/join/${roomId}`;
    navigator.clipboard.writeText(roomLink);
    alert("Room link copied to clipboard!");
  };

  return (
    <div className="container mt-5">
      <div className="p-4 bg-light rounded shadow">
        <h2 className="mb-3">
          Room: <span className="text-primary">{room}</span>
        </h2>
        <h4 className="mb-4">
          Welcome, <span className="text-success">{user.name}</span>{" "}
          <small className="text-muted">({user.role})</small>
        </h4>

        <button onClick={copyLink} className="btn btn-outline-primary mb-4">
          📋 Copy Room Link
        </button>

        <h5>Participants</h5>
        <ul className="list-group mb-4">
          {players.map((p, index) => (
            <li key={p.id || index} className="list-group-item d-flex justify-content-between">
              <span>{p.name}</span>
              {p.role === "spectator" ? (
                <span className="badge bg-secondary">Spectator</span>
              ) : (
                <span className="badge bg-success">Player</span>
              )}
            </li>
          ))}
        </ul>

        {/* Placeholder for Planning Cards */}
        <div className="text-center text-muted">
          <em>Planning cards will appear here...</em>
        </div>
      </div>
    </div>
  );
};

export default Room;

