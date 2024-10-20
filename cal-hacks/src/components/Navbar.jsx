import styled from "styled-components";
import logo from "./logo192.png";

const Container = styled.div`
    width: 100vw;
    height: 10vh;
    display: flex;
    justify-content: space-between;
    align-items: center;
    overflow-x: hidden;
    backdrop-filter: blur(20px);
    position: fixed;
    background-color: rgba(255, 255, 255, 0.3);
    z-index: 100;
`;

const RightNav = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 50%;
    margin-right: 2%;
`;

const MenuOption = styled.p`
    font-size: 1.25em;
    color: black;
    cursor: pointer;
    position: relative;
    transition: color 0.2s;

    &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -2px; /* Adjust as needed */
        width: 0;
        height: 2px; /* Adjust as needed */
        background-color: #A784D9;
        transition: width 0.2s;
    }

    &:hover {
        color: #A784D9;
    }

    &:hover::after {
        width: 100%;
    }
`;

const SignUpButton = styled.div`
    background-color: #FFD700;
    padding: 10px 20px;
    border-radius: 50px;
    font-size: 1.25em;
    cursor: pointer;
    transition: all 0.2s;
    &:hover {
        transform: scale(1.1);
        color: purple;
    }
`;

const Navbar = () => {
    return (
        <Container>
            <img src={logo} style={{width: 50 + "px", height: 50 + "px", marginLeft: 2 + "%", cursor: "pointer"}} alt="Logo"/>
            <RightNav>
                <MenuOption onClick={() => {window.location.replace("/")}}>Home</MenuOption>
                <MenuOption>About</MenuOption>
                <MenuOption>Contact</MenuOption>
                <MenuOption onClick={() => {window.location.replace("/report-and-talk")}}>Login</MenuOption>
                <SignUpButton onClick={() => {window.location.replace("/signUp")}}>Sign Up</SignUpButton>
            </RightNav>
        </Container>
    )
}

export default Navbar;