import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/navbar";
import * as API from "../functions/API";

import "../css/LoginRegister.css";

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async () => {
        await API.register({username, password})
            .then(() => navigate('/'))
            .catch((apiError) => setError(apiError.message));
    };

    return (
        <div>
            <Navbar/>
            <div className="form-container" id="login-register-background">
                <form className="register-form" onSubmit={handleSubmit}>
                    <label htmlFor="username">Username</label>
                    <input type="username" placeholder="enter a username" id="username" name="username" onChange={(e) => setUsername(e.target.value)}></input>
                    <label htmlFor="password">Password</label>
                    <input type="password" placeholder="enter a password" id="password" name="password" onChange={(e) => setPassword(e.target.value)}></input>
                </form>
                <button id='login-register-button' type="button" onClick={handleSubmit}>
                    Register
                </button>
                <span>{error}</span>
                <br />
                <button id='move-page' className="linkToNextPage" onClick={() => navigate('/login')}>
                    Already have an account? Login here
                </button>
            </div>
        </div>
    )
}