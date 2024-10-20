import styled from "styled-components";
import Logo from "./Logo.jsx";

const Container = styled.div`
    width: 100vw;
    height: 10vh;
    display: flex;
    justify-content: space-between;
    align-items: center;
    overflow-x: hidden;
    backdrop-filter: blur(5px);
    position: fixed;
    background-color: transparent;
    z-index: 100;
`;

const RightNav = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: 40px;
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
    background-color: #C4A9E2;
    padding: 10px 20px;
    border-radius: 50px;
    font-size: 1.25em;
    cursor: pointer;
    transition: all 0.2s;
    &:hover {
        transform: scale(1.1);
    }
`;

const Navbar = () => {
    return (
        <Container>
            <div style={{width: 13 + "vw", display: "flex", flexDirection: "row", alignItems: "center", marginLeft: "2vw"}}>
                <a href="/" target="_self" style={{display: "flex", alignItems: "center" , textDecoration: "none"}}>
                    <Logo />
                    <p style={{fontWeight: "bold", marginLeft: "10px"}}>MedicAl</p>
                </a>
            </div>
            <RightNav>
                <SignUpButton onClick={() => {window.location.replace("/")}}>Home</SignUpButton>
            </RightNav>
        </Container>
    )
}

export default Navbar;