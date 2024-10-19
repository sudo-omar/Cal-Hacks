import React from 'react';
import Spline from '@splinetool/react-spline';
import styled, { keyframes } from 'styled-components';

const animateGradient = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const AnimatedBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    -45deg,
    rgba(255, 0, 0, 0.1),
    rgba(0, 255, 0, 0.1),
    rgba(0, 0, 255, 0.1),
    rgba(255, 255, 255, 0.1)
  );
  background-size: 400% 400%;
  animation: ${animateGradient} 15s ease infinite;
`;

export default function Home() {
    return (
        <Container>
            <AnimatedBackground />
            <Content>
                <LeftNav>
                    <h1>MedicAI</h1>
                    <Box><Logo></Logo>
                        <Info><b>Who are we?</b><br/>MedicAI is a platform that allows you to record and track your health data.</Info></Box>
                    <Box><Logo></Logo>
                        <Info><b>Who are we?</b><br/>MedicAI is a platform that allows you to record and track your health data.</Info></Box>
                    <Box><Logo></Logo>
                        <Info><b>Who are we?</b><br/>MedicAI is a platform that allows you to record and track your health data.</Info></Box>
                </LeftNav>
                <RightNav>
                    <SplineContainer>
                        <Spline
                            scene="https://prod.spline.design/7I6L59LBWm2a6kol/scene.splinecode"
                        />
                    </SplineContainer>
                </RightNav>
            </Content>
        </Container>
    );
}

const Container = styled.div`
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
`;

const Content = styled.div`
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 100%;
    top: 2%;

    h1 {
        font-size: 3rem;
        margin-bottom: 2rem;
        color: #333;
    }
`;

const SplineContainer = styled.div`
    top: 10%;
    width: 100%;
    height: 80%;
`;

const LeftNav = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 60%;
    height: 100%;
`;

const RightNav = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 40%;
    height: 100%;
`;

const Box = styled.p`
    position: relative;
    border: rgb(243, 250, 250) 1px solid;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    padding: 15px;
    transition: padding 0.2s, opacity 0.2s;
    display: flex;
    flex-direction: row;
    gap: 20px;
    &:hover {
        padding: 20px;
    }

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgb(243, 250, 250);
        opacity: 0.3;
        border-radius: 10px;
        z-index: -1;
        transition: opacity 0.2s;
    }

    &:hover::after {
        opacity: 1;
    }
`;

const Logo = styled.div`
    width: 100px;
    height: 100px;
    background-color: #333;
    border-radius: 50%;
 `;

const Info = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;