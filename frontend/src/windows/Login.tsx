import React, { useState } from 'react';

import '../css/LoginRegister.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email);
    }
    
    return (
        <div className='form-container' id='login-register-background'>
            <form className='login-form' onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input type="email" placeholder="emailname@gmail.com" id="email" name="email"></input>
                <label htmlFor="password">Password</label>
                <input type="password" placeholder="enter your password" id="password" name="password"></input>
                <button type="button">Login</button>
            </form> <br />
            <button className='linkToNextPage' onClick={() => window.location.href='/register'}>Register new account</button>
        </div>
    )
}