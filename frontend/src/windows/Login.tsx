import React, { useState } from "react";
import Navbar from "../components/navbar";
import * as API from "../functions/API";

import "../css/LoginRegister.css";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        await API.login({username, password})
            .then(() => window.location.href="/")
            .catch((apiError) => setError(apiError.message));
    };

    return (
        <div>
            <Navbar/>
            <div className="form-container" id="login-register-background">
                <form className="login-form" onSubmit={handleSubmit}>
                    <label htmlFor="username">Username</label>
                    <input type="username" placeholder="enter your username" id="username" name="username" onChange={(e) => setUsername(e.target.value)}></input>
                    <label htmlFor="password">Password</label>
                    <input type="password" placeholder="enter your password" id="password" name="password" onChange={(e) => setPassword(e.target.value)}></input>
                    <button type="submit">Login</button>
                </form>
                <span>{error}</span>
                <br />
                <button className="linkToNextPage" onClick={() => window.location.href="/register"}>Register new account</button>
            </div>
        </div>
    )
}