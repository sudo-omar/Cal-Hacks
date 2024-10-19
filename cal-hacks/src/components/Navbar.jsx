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
    //background-color: #F0F0F0; will change if needed
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
    transition: 0.2s;
`;

const SignUpButton = styled.div`
    background-color: #FFD700;
    padding: 10px 20px;
    border-radius: 50px;
    font-size: 1.25em;
    cursor: pointer;
`;

const Navbar = () => {
    return (
        <Container>
            <img src={logo} style={{width: 50 + "px", height: 50 + "px", marginLeft: 2 + "%"}}alt="Logo"/>
            <RightNav>
                <MenuOption onClick={() => {window.location.replace("/")}}>Home</MenuOption>
                <MenuOption>About</MenuOption>
                <MenuOption>Contact</MenuOption>
                <MenuOption onClick={() => {window.location.replace("/report-and-talk")}}>Login</MenuOption>
                <SignUpButton onClick={() => {window.location.replace("/log-of-cases")}}>Sign Up</SignUpButton>
            </RightNav>
        </Container>
    )
}

export default Navbar;