import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

import MainWindow from "./windows/MainWindow";
import AddSchema from "./windows/AddSchema";
import EditSchema from "./windows/EditSchema";
import Login from './windows/Login';
import Register from './windows/Register';

import { useCookies } from 'react-cookie';

export default function App() {
  const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);
  return (
    <div className="App">
      <Router>
        <Routes>
            <Route path="/" element={<MainWindow setCookie={setCookie} cookies={cookies}/>} />
            <Route path="/addSchema" element={<AddSchema setCookie={setCookie} cookies={cookies}/>} />
            <Route path="/editSchema" element={<EditSchema setCookie={setCookie} cookies={cookies}/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </div>
  );
}
