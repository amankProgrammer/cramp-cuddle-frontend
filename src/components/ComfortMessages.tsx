import { RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';

const comfortMessages = [
  "You're doing amazing. Take it one moment at a time.",
  "Your feelings are valid. Be gentle with yourself today.",
  "This discomfort is temporary. You are strong and resilient.",
  "You deserve rest and comfort right now. Take care of yourself.",
  "Baby, I Love You So much.",
  "Mujhe tumse bahut sari batein krni hai lekin jab bhi tumhari aawaz sunta hu ya tumhare paas aata hu mera mind blank ho jata hai.",
  "Heartbeats bdh jati hai or madhoshi si ho jati hai, feelings ki river behene lgti hai.",
  "Tum sukoon ho mera jab bhi tum paas hoti ho toh mai bahut relax feel krta hu.",
  "I feel very happy with you , humesha mere sath rehna baby.",
  "Koi baat ni tum saq krlo, gussa krlo chahe kitni bhi ladai krlo mai humesha tumhare paas rhunga humesha.",
  "I never leave you. You deserve love my love.",
  "I hope these messages will comfort whenever you feel low and whenever you feel sad.",
  "One day we will together and seeing each other everyday being growing old",
  "Baby , i always loves you ever to forever. My love grows everyday for you.",
  "Today i love you more than Yesterday, Tomorrow i will love you more than Today.",
  "Reminding You how much i love you, so so so so so so so so muchhhhhhhh.",
  "Listen to what your body needs right now - rest, comfort, or relax.",
  "Keep calm my love, you are so beautiful, so kind, so lovely."
];

const ComfortMessages = () => {
  const [currentMessage, setCurrentMessage] = useState('');

  const getRandomMessage = () => {
    const randomIndex = Math.floor(Math.random() * comfortMessages.length);
    return comfortMessages[randomIndex];
  };

  useEffect(() => {
    setCurrentMessage(getRandomMessage());
  }, []);

  const handleNewMessage = () => {
    let newMessage = getRandomMessage();
    // Make sure we don't get the same message twice in a row
    while (newMessage === currentMessage) {
      newMessage = getRandomMessage();
    }
    setCurrentMessage(newMessage);
  };

  return (
    <div className="card bg-gradient-to-r from-violet-100 to-pink-100">
      <h2 className="text-xl font-semibold text-violet-700 mb-4">Comfort Message</h2>
      <p className="text-lg text-violet-800 font-medium italic mb-6">"{currentMessage}"</p>
      <button 
        onClick={handleNewMessage}
        className="flex items-center justify-center space-x-2 btn-primary mx-auto"
      >
        <RefreshCw size={16} />
        <span>New Message</span>
      </button>
    </div>
  );
};

export default ComfortMessages;
