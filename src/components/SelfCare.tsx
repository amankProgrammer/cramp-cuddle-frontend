import { Heart } from 'lucide-react';

const SelfCare = () => {
  const selfCareTips = [
    {
      category: "Physical Comfort",
      tips: [
        "Use a heating pad on your lower abdomen",
        "Take a warm bath with epsom salts",
        "Stay hydrated with plenty of water",
        "Gentle stretching or yoga can help reduce cramps",
        "Wear comfortable, loose clothing"
      ]
    },
    {
      category: "Nutrition",
      tips: [
        "Eat iron-rich foods like leafy greens and lean proteins",
        "Include anti-inflammatory foods like berries and omega-3s",
        "Avoid excessive salt, sugar, and caffeine",
        "Herbal teas like ginger, chamomile, or peppermint can help",
        "Dark chocolate (70%+ cocoa) may help improve mood"
      ]
    },
    {
      category: "Emotional Support",
      tips: [
        "Practice mindfulness meditation for 5-10 minutes",
        "Journal about your feelings without judgment",
        "Watch a comfort movie or show you love",
        "Connect with understanding friends",
        "Be kind to yourself - period symptoms are real"
      ]
    }
  ];

  return (
    <div className="card bg-gradient-to-r from-violet-100 to-pink-100">
      <h2 className="text-xl font-semibold text-violet-700 mb-4">Self-Care Suggestions</h2>
      
      <div className="space-y-6">
        {selfCareTips.map((section, idx) => (
          <div key={idx}>
            <h3 className="flex items-center text-lg font-medium text-pink-600 mb-2">
              <Heart size={18} className="mr-2 fill-pink-200 text-pink-500" />
              {section.category}
            </h3>
            <ul className="space-y-2">
              {section.tips.map((tip, tipIdx) => (
                <li key={tipIdx} className="flex items-start">
                  <span className="inline-block h-5 w-5 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center text-xs mr-2 mt-0.5">•</span>
                  <span className="text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelfCare;
