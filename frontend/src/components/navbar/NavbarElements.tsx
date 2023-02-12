import { NavLink as Link } from 'react-router-dom';
import styled from 'styled-components';

export const Nav = styled.nav`
background: #2a1663;
height: 45px;
width: 100%;
display: flex;
padding-top: 10px;
padding-bottom: 10px;
z-index: 12;
`;

export const NavLink = styled(Link)`
color: white;
display: flex;
align-items: center;
text-decoration: none;
padding: 0 1rem;
height: 100%;
cursor: pointer;
&:hover {
	transition: all 0.2s ease-in-out;
	color: #fb2576;
}
`;

export const NavMenuStart = styled.div`
display: flex;
flex-grow:1;
align-items: center;
@media screen and (max-width: 768px) {
	display: none;
}
`;
export const NavMenuEnd = styled.div`
display: flex;
flex-grow:1;
align-items: center;
justify-content: flex-end;
@media screen and (max-width: 768px) {
	display: none;
}
`;
