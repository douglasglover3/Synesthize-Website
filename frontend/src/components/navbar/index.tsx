import React from 'react';
import {
Nav,
NavLink,
NavMenuStart,
NavMenuEnd,
} from './NavbarElements';

const logout = () => {
    localStorage.removeItem('synesthizeUserData');
    window.location.reload();
}

const Navbar = () => {
return (
	<Nav>
		<NavMenuStart>
            <NavLink to='/'>
                Home
            </NavLink>
            <NavLink to='/about'>
                About Us
            </NavLink>
		</NavMenuStart>
            {
                localStorage.getItem('synesthizeUserData')
                ?
                <NavMenuEnd>
                    <NavLink to='/' onClick={logout}>Logout</NavLink>
                </NavMenuEnd>
                :         
                <NavMenuEnd>
                    <NavLink to='/login'>Login</NavLink>
                    <NavLink to='/register'>Register</NavLink>
                </NavMenuEnd>
            }
	</Nav>
);
};

export default Navbar;
