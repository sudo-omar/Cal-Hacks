import React from 'react';
import Spline from '@splinetool/react-spline';
import styled, { keyframes } from 'styled-components';
import { Activity, Lock, Smartphone } from 'lucide-react';

const animateGradient = keyframes`
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
`;

const AnimatedBackground = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
            -45deg,
            rgba(74, 144, 226, 0.1),
            rgba(80, 227, 194, 0.1),
            rgba(245, 166, 35, 0.1),
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
                    <Tagline>Your AI-powered health companion</Tagline>
                    <FeatureBox>
                        <FeatureIcon><Activity size={24} /></FeatureIcon>
                        <FeatureInfo>
                            <h3>AI-Driven Insights</h3>
                            <p>Get personalized health recommendations based on your data.</p>
                        </FeatureInfo>
                    </FeatureBox>
                    <FeatureBox>
                        <FeatureIcon><Lock size={24} /></FeatureIcon>
                        <FeatureInfo>
                            <h3>Secure Data Storage</h3>
                            <p>Your health information is encrypted and protected.</p>
                        </FeatureInfo>
                    </FeatureBox>
                    <FeatureBox>
                        <FeatureIcon><Smartphone size={24} /></FeatureIcon>
                        <FeatureInfo>
                            <h3>Cross-Platform Sync</h3>
                            <p>Access your data on any device, anytime.</p>
                        </FeatureInfo>
                    </FeatureBox>
                    <CTAButton>Start Your Health Journey</CTAButton>
                </LeftNav>
                <RightNav>
                    <SplineContainer>
                        <Spline scene="https://prod.spline.design/7I6L59LBWm2a6kol/scene.splinecode" />
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
    justify-content: space-between;
    align-items: center;
    height: 100%;
    padding: 0 5%;

    h1 {
        font-size: 3.5rem;
        margin-bottom: 0.5rem;
        color: #4A90E2;
    }
`;

const Tagline = styled.h2`
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 2rem;
`;

const SplineContainer = styled.div`
    width: 100%;
    height: 80%;
`;

const LeftNav = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 50%;
    height: 100%;
`;

const RightNav = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50%;
    height: 100%;
`;

const FeatureBox = styled.div`
    display: flex;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 10px;
    padding: 1rem;
    margin-bottom: 1rem;
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
`;

const FeatureIcon = styled.div`
    margin-right: 1rem;
    color: #4A90E2;
`;

const FeatureInfo = styled.div`
    h3 {
        margin: 0 0 0.5rem 0;
        color: #333;
    }

    p {
        margin: 0;
        color: #666;
    }
`;

const CTAButton = styled.button`
    background-color: #F5A623;
    color: white;
    border: none;
    padding: 1rem 2rem;
    font-size: 1.2rem;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s;
    margin-top: 2rem;

    &:hover {
        background-color: #E69611;
    }
`;