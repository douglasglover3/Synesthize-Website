import React, { useState } from 'react';
import Navbar from '../components/navbar';
import * as API from '../functions/API';

import '../css/LoginRegister.css';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await API.login({username, password});
        const responseBody = await response.json();
        
        if (!response.ok) {
            console.log(responseBody.message);
            return;
        }

        localStorage.setItem("synesthizeUserData", JSON.stringify({
            userId: responseBody._id,
            username: responseBody.username,
        }));
    };

    return (
        <div>
            <Navbar/>
            <div className='form-container' id='login-register-background'>
                <form className='login-form' onSubmit={handleSubmit}>
                    <label htmlFor="username">Username</label>
                    <input type="text" placeholder="enter your username" id="username" name="username" onChange={(e) => setUsername(e.target.value)}></input>
                    <label htmlFor="password">Password</label>
                    <input type="password" placeholder="enter your password" id="password" name="password" onChange={(e) => setPassword(e.target.value)}></input>
                    <button type="submit">Login</button>
                </form> <br />
                <button className='linkToNextPage' onClick={() => window.location.href='/register'}>Register new account</button>
            </div>
        </div>
    )
}