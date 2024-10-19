import React from "react";
import styled from "styled-components";
import { Eye } from "lucide-react";

const LoginContainer = styled.div`
  font-family: Arial, sans-serif;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const Link = styled.a`
  color: #2c7a7b;
  text-decoration: underline;
  cursor: pointer;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #2c7a7b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
`;

const SocialButton = styled(Button)`
  background-color: white;
  color: black;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

const IconWrapper = styled.span`
  margin-right: 10px;
`;

const Footer = styled.footer`
  font-size: 12px;
  color: #666;
  margin-top: 20px;
`;

const Login = () => {
  return (
    <LoginContainer>
      <Title>Sign in</Title>
      <Link style={{ float: "right" }}>I don't have an account</Link>
      <Input
        type="email"
        placeholder="Email"
        defaultValue="randomemail@gmail.com"
      />
      <Input type="password" placeholder="Password" />
      <Button>Sign in</Button>
      <Link>Can't sign in?</Link>
      <SocialButton>
        <IconWrapper>
          <img src="/api/placeholder/20/20" alt="Google icon" />
        </IconWrapper>
        Sign in with Google
      </SocialButton>
      <SocialButton>
        <IconWrapper>
          <img src="/api/placeholder/20/20" alt="Facebook icon" />
        </IconWrapper>
        Sign in with Facebook
      </SocialButton>
      <SocialButton>
        <IconWrapper>
          <img src="/api/placeholder/20/20" alt="Apple icon" />
        </IconWrapper>
        Sign in with Apple
      </SocialButton>
      <Footer>
        This site is protected by reCAPTCHA and the Google{" "}
        <Link>Privacy Policy</Link> and <Link>Terms of Service</Link> apply.
        <br />
        <Link>Terms and Conditions</Link> · <Link>Privacy Policy</Link> ·{" "}
        <Link>CA Privacy Notice</Link>
      </Footer>
    </LoginContainer>
  );
};

export default Login;
