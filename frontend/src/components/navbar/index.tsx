import React from 'react';
import {
Nav,
NavLink,
NavMenuStart,
NavMenuEnd,
} from './NavbarElements';

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
        <NavMenuEnd>
                <NavLink to='/login'>Login</NavLink>
                <NavLink to='/register'>Register</NavLink>
        </NavMenuEnd>
		
	</Nav>
);
};

export default Navbar;
