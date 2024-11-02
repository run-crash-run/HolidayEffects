import React, { useState, useEffect, useCallback } from 'react';

// Left styles inline (and as a single component) so someone can add this single file to their repo
const styles = {
  fallAnimation: `
    @keyframes fall {
      0% {
        transform: translateY(-10vh) rotate(0deg);
      }
      100% {
        transform: translateY(100vh) rotate(360deg);
      }
    }
  `,
  twinkleAnimation: `
    @keyframes gentleTwinkle {
      0%, 100% { 
        opacity: 1;
        filter: brightness(1);
      }
      50% { 
        opacity: 0.7;
        filter: brightness(0.8);
      }
    }
  `,
  animateFall: `
    .animate-fall {
      animation: fall linear forwards;
    }
  `
};

interface Snowflake {
  id: number;
  left: number;
  animationDuration: string;
  opacity: number;
  size: number;
  delay: string;
}

const HolidayEffects: React.FC = () => {
  const [showSnow, setShowSnow] = useState<boolean>(false);
  const [lightsOn, setLightsOn] = useState<boolean>(false);
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);
  const [accumulation, setAccumulation] = useState<number>(0);
  const [buttonsVisible, setButtonsVisible] = useState<boolean>(true);

  const lightColors: string[] = [
    'rgb(255, 60, 60)',    // Soft red
    'rgb(80, 255, 80)',    // Soft green
    'rgb(80, 140, 255)',   // Soft blue
    'rgb(255, 200, 80)',   // Warm gold
    'rgb(255, 100, 255)',  // Soft pink
  ];

  const generateSnowflake = useCallback((id: number): Snowflake => ({
    id,
    left: Math.random() * window.innerWidth,
    animationDuration: `${Math.random() * 2 + 1.5}s`,
    opacity: Math.random() * 0.7 + 0.3,
    size: Math.random() * 6 + 6,
    delay: `${Math.random() * 2}s`
  }), []);

  useEffect(() => {
    if (showSnow) {
      setButtonsVisible(false);
      
      const createSnowflakes = () => {
        const newSnowflakes = Array.from({ length: 100 }, (_, i) => 
          generateSnowflake(Date.now() + i)
        );
        setSnowflakes(prev => [...prev, ...newSnowflakes]);
      };

      createSnowflakes();

      const snowInterval = setInterval(() => {
        const newFlakes = Array.from({ length: 20 }, (_, i) => 
          generateSnowflake(Date.now() + i)
        );
        setSnowflakes(prev => [...prev.slice(-150), ...newFlakes]);
      }, 500);

      const accumInterval = setInterval(() => {
        setAccumulation(prev => Math.min(prev + 1, 100));
      }, 300);

      const stopTimer = setTimeout(() => {
        clearInterval(snowInterval);
        clearInterval(accumInterval);
        
        setTimeout(() => {
          const meltInterval = setInterval(() => {
            setAccumulation(prev => {
              if (prev <= 0) {
                clearInterval(meltInterval);
                setShowSnow(false);
                setSnowflakes([]);
                setTimeout(() => setButtonsVisible(true), 5000);
                return 0;
              }
              return prev - 1;
            });
          }, 50);
        }, 1000);
      }, 30000);

      return () => {
        clearInterval(snowInterval);
        clearInterval(accumInterval);
      };
    }
  }, [showSnow, generateSnowflake]);

  useEffect(() => {
    const handleResize = () => {
      if (showSnow) {
        setSnowflakes(prev => prev.map(flake => ({
          ...flake,
          left: Math.random() * window.innerWidth
        })));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showSnow]);

  const renderLight = (index: number) => {
    const color = lightColors[index % lightColors.length];
    const delay = Math.random() * 2.5;
    const duration = 1.5 + Math.random() * 1.5;
    const offsetY = Math.sin(index * 0.5) * 4;
    
    return (
      <div
        key={index}
        style={{
          position: 'absolute',
          left: `${(index * 3.4) + 1.7}%`,
          top: `${6 + offsetY}px`,
          transform: 'translateX(-50%)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '-8px',
            transform: 'translateX(-50%)',
            width: '8px',
            height: '12px',
            backgroundColor: '#595959',
            borderRadius: '1px',
            zIndex: 1,
          }}
        />
        
        <div
          style={{
            width: '14px',
            height: '20px',
            backgroundColor: lightsOn ? color : '#888',
            borderRadius: '40% 40% 60% 60%',
            animation: lightsOn ? `gentleTwinkle ${duration}s ease-in-out infinite ${delay}s` : 'none',
            boxShadow: lightsOn ? `
              0 0 10px 2px ${color}cc,
              0 0 20px 6px ${color}66,
              0 0 30px 10px ${color}22
            ` : 'none',
            transition: 'all 0.5s ease-in-out',
            opacity: lightsOn ? 1 : 0.5,
          }}
        >
          {lightsOn && (
            <div
              style={{
                position: 'absolute',
                top: '20%',
                left: '20%',
                width: '60%',
                height: '60%',
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                borderRadius: '50%',
                filter: 'blur(2px)',
              }}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none'
    }}>
      <style>{`${styles.fallAnimation}${styles.twinkleAnimation}${styles.animateFall}`}</style>

      {buttonsVisible && (
        <div style={{
          position: 'fixed',
          bottom: '1rem',
          left: '1rem',
          display: 'flex',
          gap: '0.5rem',
          pointerEvents: 'auto',
          zIndex: 9999
        }}>
          <button 
            onClick={() => {
              setShowSnow(true);
              setAccumulation(0);
            }}
            className="bg-blue-500 hover:bg-blue-600 rounded-full w-12 h-12 p-0 shadow-lg flex items-center justify-center transition-colors"
            title="Make it snow!"
          >
            <span className="text-2xl">❄️</span>
          </button>
          <button 
            onClick={() => setLightsOn(!lightsOn)}
            className="bg-green-600 hover:bg-green-700 rounded-full w-12 h-12 p-0 shadow-lg flex items-center justify-center transition-colors"
            title="Toggle holiday lights"
          >
            <span className="text-2xl">🎄</span>
          </button>
        </div>
      )}

      {showSnow && (
        <>
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(226, 232, 240, 0.3)',
            transition: 'opacity 1000ms',
            zIndex: 9997
          }} />
          
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9998
          }}>
            {snowflakes.map(snowflake => (
              <div
                key={snowflake.id}
                className="animate-fall"
                style={{
                  position: 'absolute',
                  left: `${snowflake.left}px`,
                  top: '-10px',
                  width: `${snowflake.size}px`,
                  height: `${snowflake.size}px`,
                  opacity: snowflake.opacity,
                  background: 'white',
                  borderRadius: '50%',
                  filter: 'blur(2px)',
                  boxShadow: '0 0 10px 2px rgba(255, 255, 255, 0.8), 0 0 20px 4px rgba(255, 255, 255, 0.4)',
                  animationDuration: snowflake.animationDuration,
                  animationDelay: snowflake.delay,
                }}
              />
            ))}

            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: `${accumulation}px`,
              borderTopLeftRadius: '100%',
              borderTopRightRadius: '100%',
              background: 'rgba(255, 255, 255, 0.5)',
              filter: 'blur(2px)',
              transform: `scaleY(${Math.max(0.2, accumulation / 100)})`,
              opacity: Math.min(0.7, accumulation / 50),
              transition: 'all 300ms'
            }} />
          </div>
        </>
      )}

      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '4rem',
        zIndex: 9996
      }}>
        <div style={{
          position: 'absolute',
          top: '24px',
          left: 0,
          right: 0,
          height: '2px',
          background: '#4a5568',
          transform: 'translateY(-50%)',
        }} />
        
        {Array.from({ length: 30 }).map((_, index) => renderLight(index))}
      </div>
    </div>
  );
};

export default HolidayEffects;