// /////src/pages/Room.jsx
// import { useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useParams } from "react-router-dom";
// import { setPlayers, setRoom } from "../features/roomSlice";
// import socket from "../socket";

// const Room = () => {
//   const { roomId } = useParams();
//   const dispatch = useDispatch();

//   const { room, user, players } = useSelector((state) => ({
//     room: state.room.roomName,

//     user: state.room.user || { name: state.room.name, role: "player" },
//     players: state.room.players || [],
//   }));

//   useEffect(() => {
//     socket.on("updatePlayers", (data) => {
//       dispatch(setPlayers(data));
//     });

//     socket.on("roomInfo", ({ roomName }) => {
//       dispatch(setRoom({ id: roomId, name: roomName }));
//     });

//     return () => {
//       socket.off("updatePlayers");
//       socket.off("roomInfo");
//     };
//   }, [dispatch, roomId]);

//   const copyLink = () => {
//     const roomLink = `${window.location.origin}/join/${roomId}`;
//     navigator.clipboard.writeText(roomLink);
//     alert("Room link copied to clipboard!");
//   };

//   return (
//     <div className="container mt-5">
//       <div className="p-4 bg-light rounded shadow">
//         <h2 className="mb-3">
//           Room: <span className="text-primary">{room}</span>
//         </h2>
//         <h4 className="mb-4">
//           Welcome, <span className="text-success">{user.name}</span>{" "}
//           <small className="text-muted">({user.role})</small>
//         </h4>

//         <button onClick={copyLink} className="btn btn-outline-primary mb-4">
//           📋 Copy Room Link
//         </button>

//         <h5>Participants</h5>
//         <ul className="list-group mb-4">
//           {players.map((p, index) => (
//             <li
//               key={p.id || index}
//               className="list-group-item d-flex justify-content-between"
//             >
//               <span>{p.name}</span>
//               {p.role === "spectator" ? (
//                 <span className="badge bg-secondary">Spectator</span>
//               ) : (
//                 <span className="badge bg-success">Player</span>
//               )}
//             </li>
//           ))}
//         </ul>

//         {/* Placeholder for Planning Cards */}
//         <div
//           className="position-relative my-5"
//           style={{ width: "400px", height: "400px", margin: "0 auto" }}
//         >
//           {players.map((player, index) => {
//             const angle = (index / players.length) * 2 * Math.PI;
//             const radius = 150;
//             const x = radius * Math.cos(angle);
//             const y = radius * Math.sin(angle);

//             return (
//               <div
//                 key={player.id || index}
//                 className="position-absolute text-center"
//                 style={{
//                   width: "80px",
//                   height: "80px",
//                   borderRadius: "50%",
//                   background: "#f8f9fa",
//                   border: "2px solid #007bff",
//                   boxShadow: "0 0 10px rgba(0,0,0,0.1)",
//                   top: `${200 + y - 40}px`,
//                   left: `${200 + x - 40}px`,
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   fontWeight: "bold",
//                 }}
//               >
//                 {player.name}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Room;




import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import socket from "../socket";
import { setPlayers, setCurrentStory, submitVote, revealVotes, resetVotes, addStory } from "../features/roomSlice";
import { nanoid } from "nanoid";

const Room = () => {
  const { roomId } = useParams();
  const dispatch = useDispatch();
  const { roomName, user, players, currentStory, votes, voteStatus } = useSelector(state => state.room);
  const [newStory, setNewStory] = useState({ title: "", description: "" });
  const [selectedCard, setSelectedCard] = useState(null);

  // Socket event handlers
  useEffect(() => {
    socket.emit("joinRoom", { roomId, user });

    socket.on("playerJoined", (players) => {
      dispatch(setPlayers(players));
    });

    socket.on("playerLeft", (players) => {
      dispatch(setPlayers(players));
    });

    socket.on("newStoryStarted", (story) => {
      dispatch(setCurrentStory(story));
    });

    socket.on("voteReceived", (voteData) => {
      dispatch(submitVote(voteData));
    });

    socket.on("votesRevealed", () => {
      dispatch(revealVotes());
    });

    socket.on("votesReset", () => {
      dispatch(resetVotes());
      setSelectedCard(null);
    });

    return () => {
      socket.off();
    };
  }, [roomId, dispatch, user]);

  const copyLink = () => {
    const roomLink = `${window.location.origin}/join/${roomId}`;
    navigator.clipboard.writeText(roomLink);
    alert("Room link copied to clipboard!");
  };

  const handleVote = (value) => {
    setSelectedCard(value);
    socket.emit("submitVote", { 
      roomId, 
      userId: user.id, 
      vote: value 
    });
  };

  const handleRevealVotes = () => {
    socket.emit("revealVotes", roomId);
  };

  const handleNextStory = () => {
    socket.emit("nextStory", roomId);
  };

  const handleAddStory = () => {
    const story = {
      id: nanoid(),
      ...newStory,
    };
    dispatch(addStory(story));
    socket.emit("addStory", { roomId, story });
    setNewStory({ title: "", description: "" });
  };

  // Calculate vote results
  const calculateResults = () => {
    const voteValues = Object.values(votes)
      .filter(vote => typeof vote === 'number')
      .map(Number);
    
    if (voteValues.length === 0) return null;
    
    const sum = voteValues.reduce((a, b) => a + b, 0);
    return (sum / voteValues.length).toFixed(1);
  };

  return (
    <div className="container mt-5">
      <div className="p-4 bg-light rounded shadow">
        <h2 className="mb-3">
          Room: <span className="text-primary">{roomName}</span>
        </h2>
        <h4 className="mb-4">
          Welcome, <span className="text-success">{user.name}</span>{" "}
          <small className="text-muted">({user.role})</small>
        </h4>

        <button onClick={copyLink} className="btn btn-outline-primary mb-4">
          📋 Copy Room Link
        </button>

        {/* Current Story */}
        {currentStory && currentStory.title && (
          <div className="mb-4 p-3 bg-white rounded border">
            <h3>Current Story: {currentStory.title}</h3>
            <p className="mb-0">{currentStory.description}</p>
          </div>
        )}

        {/* Voting Area */}
        {user.role === "player" && voteStatus === "voting" && (
          <div className="mb-4">
            <h5 className="mb-3">Select your estimate</h5>
            <div className="d-flex flex-wrap gap-2">
              {[1, 2, 3, 5, 8, 13, 21, '?'].map((value) => (
                <button
                  key={value}
                  className={`btn ${selectedCard === value ? 'btn-primary' : 'btn-outline-primary'}`}
                  style={{ width: '60px', height: '90px' }}
                  onClick={() => handleVote(value)}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {voteStatus === "revealed" && (
          <div className="mb-4 p-3 bg-white rounded border">
            <h4 className="text-center">Average: {calculateResults() || "N/A"}</h4>
          </div>
        )}

        {/* Players List */}
        <div className="mb-4">
          <h5 className="mb-3">Participants ({players.length})</h5>
          <ul className="list-group">
            {players.map((player, index) => (
              <li 
                key={player.id || index} 
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <span className="fw-bold">{player.name}</span>
                  <span className="text-muted ms-2">({player.role})</span>
                </div>
                <div>
                  {voteStatus === "revealed" && votes[player.id] !== undefined && (
                    <span className="badge bg-primary rounded-pill">
                      Voted: {votes[player.id]}
                    </span>
                  )}
                  {voteStatus === "voting" && (
                    <span className={`badge ${votes[player.id] ? 'bg-success' : 'bg-warning'} rounded-pill`}>
                      {votes[player.id] ? "✓ Voted" : "⌛ Waiting"}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Moderator Controls */}
        <div className="mb-4 d-flex gap-2">
          <button 
            className="btn btn-success flex-grow-1"
            onClick={handleRevealVotes} 
            disabled={voteStatus === "revealed"}
          >
            Reveal Votes
          </button>
          <button 
            className="btn btn-info flex-grow-1"
            onClick={handleNextStory}
          >
            Next Story
          </button>
        </div>

        {/* Story Management */}
        <div className="mb-4 p-3 bg-white rounded border">
          <h5 className="mb-3">Add New Story</h5>
          <div className="mb-3">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Story title"
              value={newStory.title}
              onChange={(e) => setNewStory({...newStory, title: e.target.value})}
            />
            <textarea
              className="form-control mb-2"
              placeholder="Description"
              value={newStory.description}
              onChange={(e) => setNewStory({...newStory, description: e.target.value})}
              rows="2"
            />
            <button 
              className="btn btn-primary w-100"
              onClick={handleAddStory}
            >
              Add Story
            </button>
          </div>
        </div>

        {/* Circular arrangement of players */}
        {players.length > 0 && (
          <div 
            className="position-relative my-5 mx-auto" 
            style={{ width: "400px", height: "400px" }}
          >
            {players.map((player, index) => {
              const angle = (index / players.length) * 2 * Math.PI;
              const radius = 150;
              const x = radius * Math.cos(angle);
              const y = radius * Math.sin(angle);

              return (
                <div
                  key={player.id || index}
                  className="position-absolute text-center d-flex flex-column justify-content-center"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "#f8f9fa",
                    border: "2px solid #007bff",
                    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                    top: `${200 + y - 40}px`,
                    left: `${200 + x - 40}px`,
                    fontWeight: "bold",
                  }}
                >
                  <div className="small">{player.name}</div>
                  {voteStatus === "revealed" && votes[player.id] !== undefined && (
                    <div className="vote-value fw-bold" style={{ fontSize: '1.2em' }}>
                      {votes[player.id]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Room;