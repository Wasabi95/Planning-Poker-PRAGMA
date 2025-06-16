// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Join from "./pages/Join";
import Room from "./pages/Room";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/join/:roomId" element={<Join />} />
      <Route path="/room/:roomId" element={<Room />} />
    </Routes>
  </Router>
);

export default App;

