import { RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';

const comfortMessages = [
                          "You’re the most beautiful part of my life.",
                          "With you, every moment is magic.",
                          "I didn’t believe in soulmates until I met you.",
                          "Your smile can heal my worst days.",
                          "I fall for you more every single day.",
                          "You’re my forever favorite person.",
                          "Loving you feels like breathing—effortless.",
                          "You bring colors to my world.",
                          "I still get butterflies when I see your name pop up.",
                          "You’re the reason I believe in love.",
                          "Even in a crowd, all I see is you.",
                          "I am yours—completely, endlessly, and truly.",
                          "You’re the sweetest addiction I never want to quit.",
                          "You're the best part of every day.",
                          "My heart whispers your name in every beat.",
                          "With you, I’ve found my peace.",
                          "You're my muse, my melody, my magic.",
                          "Every love song makes sense because of you.",
                          "You make my world better, just by being in it.",
                          "Even the stars are jealous of your glow.",
                          "My dreams are sweeter because you’re in them.",
                          "You're not just my love, you're my home.",
                          "Your love is my greatest treasure.",
                          "You’re my person. Always have been, always will be.",
                          "With you, forever doesn't feel long enough.",
                          "तुम मेरी ज़िन्दगी की सबसे खूबसूरत वजह हो।",
                          "जब तुम मुस्कुराती हो, तो दुनिया और भी प्यारी लगती है।",
                          "तुमसे मिलकर लगा, हाँ यही है मेरा प्यार।",
                          "तेरे बिना सब अधूरा लगता है।",
                          "तेरी आँखों में एक जादू है, जो हर दर्द भुला देता है।",
                          "मैं हर रोज़ तुम्हें और ज़्यादा चाहने लगता हूँ।",
                          "तुम्हारी हँसी मेरी कमजोरी है।",
                          "तू है तो सब कुछ है, तू नहीं तो कुछ नहीं।",
                          "तेरा नाम लेते ही चेहरे पर मुस्कान आ जाती है।",
                          "तेरे साथ वक्त का पता ही नहीं चलता।",
                          "तू है तो हर दिन ख़ास लगता है।",
                          "तेरी बातों में सुकून है, तेरे पास होने में चैन है।",
                          "तेरी आवाज़ सबसे प्यारी लोरी सी लगती है।",
                          "तू जब पास होती है तो दुनिया ठहर जाती है।",
                          "तू नहीं जानती, पर तू मेरी पूरी दुनिया है।",
                          "तेरे प्यार में खुद को खो देना भी मंज़ूर है।",
                          "तेरा साथ हो तो सफर आसान हो जाता है।",
                          "तेरी हर बात मुझे और तेरे करीब ले आती है।",
                          "मैं खुद को सबसे खुशकिस्मत समझता हूँ कि तू मेरी ज़िन्दगी में है।",
                          "तू सिर्फ़ मेरी नहीं, मेरी दुआओं का जवाब भी है।",
                          "You're the missing piece I never knew I needed.",
                          "You make my life feel like a love story.",
                          "One smile from you can change my whole day.",
                          "You're my first thought every morning and last every night.",
                          "You are all the things I prayed for—and more.",
                          "You make me want to be a better man.",
                          "You’re my wish that came true.",
                          "Every moment with you is a memory I cherish.",
                          "You’re my light in the darkest nights.",
                          "My life got its meaning the day you came in.",
                          "तू साथ है तो सब आसान लगता है।",
                          "तेरे बिना रहना अब नामुमकिन सा लगता है।",
                          "तेरी बातों में जादू है, जो सीधा दिल को छू जाता है।",
                          "जब तू मुस्कुराती है, तो सबकुछ रौशन हो जाता है।",
                          "तू मेरी हर दुआ का जवाब है।",
                          "तेरे लिए मेरा प्यार हर दिन बढ़ता ही जा रहा है।",
                          "तू मेरी आँखों का सपना और दिल की हकीकत है।",
                          "तेरा साथ मुझे पूरा कर देता है।",
                          "तेरे चेहरे की रौशनी से मेरा दिन बन जाता है।",
                          "तू वो ख्वाब है जो मैं खुली आँखों से देखता हूँ।",
                          "You're the most beautiful emotion I’ve ever felt.",
                          "तू मेरे ख्वाबों से भी ज्यादा हसीन है।",
                          "You’re my reason to believe in goodness.",
                          "तेरा प्यार मेरे लिए सबसे बड़ी दौलत है।",
                          "Even a lifetime isn’t enough to love you fully.",
                          "तू मेरी तन्हाईयों की सबसे प्यारी साथी है।",
                          "With you, I found my forever.",
                          "तेरी मुस्कान मेरी दुनिया है।",
                          "You're not just in my heart—you are my heart.",
                          "तू मेरी हर ख़ुशी की वजह है।",
                          "You are my safe space and my wildest adventure.",
                          "तेरे साथ बिताया हर पल मेरे लिए अनमोल है।",
                          "My love for you grows stronger every day.",
                          "तेरे ख्यालों में ही मेरी दुनिया बसती है।",
                          "You’re my favorite human being.",
                          "तेरे बिना ये दिल अधूरा लगता है।",
                          "You are what every love song is about.",
                          "तू ही तो है जो मेरी धड़कनों का राज़ है।",
                          "My heart smiles whenever I think of you.",
                          "तेरे साथ हर दर्द आसान लगता है।",
                          "You feel like home.",
                          "तेरा नाम लेते ही सुकून मिल जाता है।",
                          "You're my sunshine on rainy days.",
                          "तेरी हर बात में मिठास है।",
                          "You're my best decision ever.",
                          "तू मेरे लिए सबसे प्यारी तोहफ़ा है।",
                          "You're everything I never knew I needed.",
                          "तेरे बिना कुछ भी अच्छा नहीं लगता।",
                          "You’re my dream come true.",
                          "तू है तो सब कुछ है।",
                          "You’re my favorite reason to smile.",
                          "तेरी हर मुस्कान मेरी जान ले जाती है।",
                          "I love you more than words can ever say."
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
    <div className="card bg-gradient-to-r from-violet-100 to-pink-100 ">
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
