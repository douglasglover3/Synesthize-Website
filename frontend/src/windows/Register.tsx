import React, {useState} from 'react';

import '../css/LoginRegister.css';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email);
    }

    return (
        <div className='form-container' id='login-register-background'>
            <form className='register-form' onSubmit={handleSubmit}>
                <label htmlFor="firstName">First Name</label>
                <input type="firstName" placeholder="enter your first name"></input>
                <label htmlFor="lastName">Last Name</label>
                <input type="lastName" placeholder="enter your last name"></input>
                <label htmlFor="email">Email</label>
                <input type="email" placeholder="emailname@gmail.com" id="email" name="email"></input>
                <label htmlFor="password">Password</label>
                <input type="password" placeholder="enter your password" id="password" name="password"></input>
                <button type="button">Register</button>
            </form> <br />
            <button className='linkToNextPage' onClick={() => window.location.href='/login'}>Already have an account? Login here</button>
        </div>
    )
}