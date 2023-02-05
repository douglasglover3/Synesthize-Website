import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

import MainWindow from "./windows/MainWindow";
import AddSchema from "./windows/AddSchema";
import EditSchema from "./windows/EditSchema";
import Login from './windows/Login';
import Register from './windows/Register';

export default function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
            <Route path="/" element={<MainWindow />} />
            <Route path="/addSchema" element={<AddSchema />} />
            <Route path="/editSchema" element={<EditSchema />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </div>
  );
}
