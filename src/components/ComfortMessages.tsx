import { RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';

const comfortMessages = [
  "Aaj tumhare periods aaye hain or tention mujhe ho rhi hai",
  "Apna khyal rkho babyyy",
  "  I LOVE SO MUCH <3 ",
  "Tum sti hui bahut pyari lgti ho",
  "I wanted to wake up everyday with you",
  "I wanted to sleep every night with you",
  "You are my Princess",
  "Red suit and jeans and white shoes me tum meri bchhi lgogi",
  "Tum saree me bilkul meri wife lgti ho",
  "Tum gusse me bhi cute lgti ho bahut",
  "Lo ek pyara sa hug mmmmmmmm",
  "Lo ek pyari si kiss mmmmmuuuuuuuuuaaaaaaah",
  "Periods bahut bekar hote h ptani ladkiyo ko he kyu hote h ladko ko bhi hone chahiye",
  "Mood shiii krlo baby apna bhi or mera bhi",
  "Tumhare bina achaa ni lgra kuch bhi",
  "I misssss youuuuu jaaanuuu"
  "Tum jb hasti ho toh mere dil k garden me flowers khil jate h",
  "Tum jb smile krti ho toh dil khush ho jata h mera",
  "Babyy jaldi milenge hold on",
  "jb bhi low feel ho toh mujhse baat kr liya kro agr mai nhi hu toh unh purani memories ko yaad kr liya kro",
  "You make my day and i'll make your day beautiful",
  "Tum meri subah ki pehli kiran ho or meri raat ka ka chaand ",
  "I feel happy with you do u?",
  "I miss you all the time do u?",
  "Overthinking mt kro baby i am your only your",
  "ache se rest kro ",
  "Utho baby coffee pilo maine bnai h tumhare liye",
  "Babyy tbiyat thik h tumhari mujhe update dete rha kro i am your doctor you know na",
  "Ladai krne k baad bhi sath me h or pyar kr rhe h isse bda proof kya chahiye tumhe humare kbhi na tootne wale pyar ka ",
  "tum , tum , tum , haan baby tum he ho meri wife mera pyar mera sb kuch",
  "You are so beautiful"
  "You are so cute",
  "You are so kind",
  "You are so adorable",
  "You are my motivation",
  "You are my dream girl",
  "You are so precious to me",
  "Tumhari value bahut jyada ha meri life me its uncomparable and infinite",
  "Keep calm babyyy keep loving me ",
  "Tum pyar kro ya na kro , mai tumhe humesha pyar krta rhunga"
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
