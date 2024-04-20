import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Home from "./components/Home";
import Login from './components/Login';
import Signup from './components/Signup';
import Forgot from "./components/Forgot";
import Rpass from "./components/Rpass";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/Forgot" element={<Forgot />} />
          <Route exact path="/Rpass" element={<Rpass />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
