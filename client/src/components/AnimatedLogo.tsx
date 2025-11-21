import { useState, useEffect } from 'react';

interface AnimatedLogoProps {
  className?: string;
}

export default function AnimatedLogo({ className = "" }: AnimatedLogoProps) {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const phrases = [
    'TheCookFlow',
    'Generando menú...',
    'Analizando gustos...',
    'Creando recetas...',
    'Optimizando precios...'
  ];

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % phrases.length;
      const fullText = phrases[i];

      if (isDeleting) {
        setDisplayText(fullText.substring(0, displayText.length - 1));
        setTypingSpeed(75);
      } else {
        setDisplayText(fullText.substring(0, displayText.length + 1));
        setTypingSpeed(150);
      }

      if (!isDeleting && displayText === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && displayText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, loopNum, typingSpeed, phrases]);

  return (
    <div className={`text-center ${className}`}>
      {/* Logo estático */}
      <div className="mb-6">
        <img 
          src="/logo.PNG" 
          alt="TheCookFlow" 
          className="logo mx-auto opacity-90"
        />
      </div>
      
      {/* Texto animado */}
      <div className="relative">
        <h1 className="text-4xl md:text-5xl font-bold text-chalk-white min-h-[60px] flex items-center justify-center">
          <span className="font-handwritten">
            {displayText}
            <span className="animate-pulse text-chalk-green">|</span>
          </span>
        </h1>
        
        {/* Efecto de "pensando" adicional */}
        <div className="flex justify-center mt-4 space-x-1">
          <div className="w-2 h-2 bg-chalk-green rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-chalk-green rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-chalk-green rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}