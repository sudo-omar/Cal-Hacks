import styled from "styled-components";
import clipboardIcon from "./clipboardicon.svg";

const Container = styled.div`
  width: 100vw;
  height: 10vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow-x: hidden;
  backdrop-filter: blur(20px);
  position: fixed;
  background-color: #ffffff;
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
    content: "";
    position: absolute;
    left: 0;
    bottom: -2px; /* Adjust as needed */
    width: 0;
    height: 2px; /* Adjust as needed */
    background-color: #a784d9;
    transition: width 0.2s;
  }

  &:hover {
    color: #a784d9;
  }

  &:hover::after {
    width: 100%;
  }
`;

const SignUpButton = styled.div`
  background-color: #ffd700;
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
      <img
        src={clipboardIcon}
        style={{
          width: 70 + "px",
          height: 70 + "px",
          marginLeft: 2 + "%",
          cursor: "pointer",
        }}
        alt="Logo"
      />
      <RightNav>
        <MenuOption
          onClick={() => {
            window.location.replace("/");
          }}
        >
          Home
        </MenuOption>
        <MenuOption>About</MenuOption>
        <MenuOption>Contact</MenuOption>
        <MenuOption
          onClick={() => {
            window.location.replace("/report-and-talk");
          }}
        >
          Login
        </MenuOption>
        <SignUpButton
          onClick={() => {
            window.location.replace("/log-of-cases");
          }}
        >
          Sign Up
        </SignUpButton>
      </RightNav>
    </Container>
  );
};

export default Navbar;
