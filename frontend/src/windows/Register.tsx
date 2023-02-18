import React, {useState} from 'react';
import Navbar from '../components/navbar';

import '../css/LoginRegister.css';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(username);
    }

    return (
        <div>
            <Navbar/>
        <div className='form-container' id='login-register-background'>
            <form className='register-form' onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input type="username" placeholder="John Smith" id="username" name="username"></input>
                <label htmlFor="password">Password</label>
                <input type="password" placeholder="enter your password" id="password" name="password"></input>
                <button type="button">Register</button>
            </form> <br />
            <button className='linkToNextPage' onClick={() => window.location.href='/login'}>Already have an account? Login here</button>
        </div>
        </div>
    )
}