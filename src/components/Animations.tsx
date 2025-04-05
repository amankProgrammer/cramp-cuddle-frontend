import { Heart, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AnimatedElement {
  id: number;
  type: 'heart' | 'star' | 'circle';
  x: number;
  size: number;
  speed: number;
  delay: number;
  opacity: number;
  color: string;
}

const colors = ['#c4b5fd', '#f9a8d4', '#fbcfe8', '#ddd6fe', '#e9d5ff', '#fce7f3'];

const Animations = () => {
  const [elements, setElements] = useState<AnimatedElement[]>([]);

  useEffect(() => {
    // Create animated elements
    const newElements: AnimatedElement[] = [];

    // Add hearts
    for (let i = 0; i < 12; i++) {
      newElements.push({
        id: i,
        type: 'heart',
        x: Math.random() * 100, // random horizontal position (percentage)
        size: 16 + Math.random() * 16, // random size between 16-32px
        speed: 30 + Math.random() * 60, // random animation duration between 30-90s
        delay: Math.random() * 30, // random delay
        opacity: 0.4 + Math.random() * 0.4, // random opacity between 0.4-0.8
        color: colors[Math.floor(Math.random() * colors.length)], // random color
      });
    }

    // Add stars
    for (let i = 12; i < 20; i++) {
      newElements.push({
        id: i,
        type: 'star',
        x: Math.random() * 100,
        size: 12 + Math.random() * 12,
        speed: 40 + Math.random() * 40,
        delay: Math.random() * 30,
        opacity: 0.3 + Math.random() * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Add circles
    for (let i = 20; i < 30; i++) {
      newElements.push({
        id: i,
        type: 'circle',
        x: Math.random() * 100,
        size: 8 + Math.random() * 14,
        speed: 20 + Math.random() * 50,
        delay: Math.random() * 30,
        opacity: 0.2 + Math.random() * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    setElements(newElements);
  }, []);

  const renderElement = (element: AnimatedElement) => {
    const style = {
      left: `${element.x}%`,
      animationDuration: `${element.speed}s`,
      animationDelay: `${element.delay}s`,
      width: `${element.size}px`,
      height: `${element.size}px`,
      opacity: element.opacity,
      color: element.color
    };

    switch (element.type) {
      case 'heart':
        return (
          <div className="animated-element floating" style={style}>
            <Heart fill={element.color} size={element.size} />
          </div>
        );
      case 'star':
        return (
          <div className="animated-element falling" style={style}>
            <Star fill={element.color} size={element.size} />
          </div>
        );
      case 'circle':
        return (
          <div
            className="animated-element floating"
            style={{
              ...style,
              backgroundColor: element.color,
              borderRadius: '50%'
            }}
          ></div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="animations-container">
      {elements.map(element => (
        <div key={element.id}>
          {renderElement(element)}
        </div>
      ))}
    </div>
  );
};

export default Animations;
