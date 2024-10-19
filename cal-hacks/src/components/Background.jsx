import React, { useEffect, useState } from 'react';

const AnimatedBackground = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const animateBackground = () => {
            setPosition(prevPos => ({
                x: (prevPos.x + 1) % 100,
                y: (prevPos.y + 1) % 100,
            }));
        };

        const intervalId = setInterval(animateBackground, 50);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="fixed inset-0 w-full h-full" style={{
            background: `
        linear-gradient(
          217deg,
          rgba(255, 0, 0, ${0.3 + Math.sin(position.x * 0.05) * 0.2}),
          rgba(255, 0, 0, 0) 70.71%
        ),
        linear-gradient(
          127deg,
          rgba(0, 255, 0, ${0.3 + Math.sin(position.y * 0.05) * 0.2}),
          rgba(0, 255, 0, 0) 70.71%
        ),
        linear-gradient(
          336deg,
          rgba(0, 0, 255, ${0.3 + Math.cos((position.x + position.y) * 0.05) * 0.2}),
          rgba(0, 0, 255, 0) 70.71%
        )
      `,
            transition: 'background 0.5s ease',
        }}>
        </div>
    );
};

export default AnimatedBackground;