import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

import MainWindow from "./windows/MainWindow"
import AddSchema from "./windows/AddSchema"
import EditSchema from "./windows/EditSchema"
import DebugWindow from "./windows/DebugWindow"

export default function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
            <Route path="/" element={<MainWindow/>}/>
            <Route path="/debug" element={<DebugWindow/>}/>
            <Route path="/addSchema" element={<AddSchema/>}/>
            <Route path="/editSchema" element={<EditSchema/>}/>
        </Routes>
      </Router>
    </div>
  );
}
