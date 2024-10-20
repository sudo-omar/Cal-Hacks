import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const SignUpForm = styled.div`
  width: 100%;
  max-width: 400px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0;
`;

const AccountLink = styled.a`
  color: #a784d9;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const Input = styled.input`
  width: 95%;
  padding: 10px;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #a784d9;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    background-color: #8a6bb8;
  }
`;

const SocialButton = styled(Button)`
  background-color: white;
  color: #333;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
`;

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Container>
      <SignUpForm>
        <Header>
          <Title>Sign up</Title>
          <AccountLink href="#">I have an account</AccountLink>
        </Header>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button>Agree and Sign up</Button>
        <SocialButton>
          <span>G</span> Sign up with Google <span>›</span>
        </SocialButton>
      </SignUpForm>
    </Container>
  );
};

export default SignUp;
