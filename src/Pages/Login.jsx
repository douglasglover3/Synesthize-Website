import React, { useState } from 'react';

export const Login = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email);
    }
    return (
        <div className='form-container'>
            <form className='login-form' onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input type="email" placeholder="emailname@gmail.com" id="email" name="email"></input>
                <label htmlFor="password">Password</label>
                <input type="password" placeholder="enter your password" id="password" name="password"></input>
                <button type="login">Login</button>
            </form>
            <button className='linkToNextPage' onClick={() => props.onFormSwitch('register')}>Register new account</button>
        </div>
    )
}