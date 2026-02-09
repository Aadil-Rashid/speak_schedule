import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Schedules from "./Schedules";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/schedules" element={<Schedules />} />
    </Routes>
  );
}

export default App;
