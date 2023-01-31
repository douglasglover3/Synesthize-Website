import './App.css';
import React, { useState } from "react";
import { Login } from "./Pages/Login";
import { Register } from "./Pages/Register";

function App() {
  const [currentForm, setCurrentForm] = useState('register');

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  }
  return (
    <div className="App">
        <header>
          <h1>Synesthized</h1>
        </header>
      {
        currentForm === "login" ? <Login onFormSwitch={toggleForm}/> : <Register onFormSwitch={toggleForm}/>
      }
    </div>
  );
}

export default App;
