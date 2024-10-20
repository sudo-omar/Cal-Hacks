import React from "react";
import styled from "styled-components";
import { Eye, ArrowRightCircle } from "lucide-react";
import GoogleIcon from '@mui/icons-material/Google';
import Spline from '@splinetool/react-spline';

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  z-index: 100;
`;

const LoginContainer = styled.div`
  font-family: Arial, sans-serif;
  width: 100%;
  max-width: 400px;
  padding: 30px 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 100;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  z-index: 100;
`;

const Title = styled.h1`
  color: #a784d9;
  font-size: 30px;
  font-weight: bold;
  margin: 0;
  z-index: 100;
`;

const Link = styled.a`
  color: #a784d9;
  text-decoration: underline;
  cursor: pointer;
  z-index: 100;
`;

const InputContainer = styled.div`
  position: relative;
  margin-bottom: 16px;
  z-index: 100;
`;

const Input = styled.input`
  width: 93.5%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  z-index: 100;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  z-index: 100;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #a784d9;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 16px;
  z-index: 100;
`;

const CantSignIn = styled.div`
  text-align: center;
  margin-bottom: 16px;
  z-index: 100;
`;

const SocialButton = styled(Button)`
  background-color: white;
  color: black;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  margin-bottom: 12px;
  z-index: 100;
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  gap: 16px;
  z-index: 100;
`;

const Login = () => {
  return (
      <>
        <Spline
            scene="https://prod.spline.design/HlMyK0A8D3bLp-iT/scene.splinecode"
            style={{ width: "100vw", height: "100vh", position: "absolute", zIndex: 0 , opacity: 0.9}}
        />
    <PageContainer>
      <LoginContainer>
        <Header>
          <Title>Sign in</Title>
          <Link>I don't have an account</Link>
        </Header>
        <InputContainer>
          <Input type="email" placeholder="Email" defaultValue="" />
        </InputContainer>
        <InputContainer>
          <Input type="password" placeholder="Password" />
          <PasswordToggle>
            <Eye size={20} color="#666" />
          </PasswordToggle>
        </InputContainer>
        <Button>Sign in</Button>
        <CantSignIn>
          <Link>Can't sign in?</Link>
        </CantSignIn>
        <SocialButton>
          <IconWrapper>
            <GoogleIcon />
            Sign in with Google
          </IconWrapper>
          <ArrowRightCircle size={20} />
        </SocialButton>
      </LoginContainer>
    </PageContainer>
  </>
  );
};

export default Login;
