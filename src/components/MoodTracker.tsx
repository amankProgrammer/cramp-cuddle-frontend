import { useState, useEffect } from 'react';
import {
  Frown, Meh, MessageSquare, Plus,
  Save, Send, Smile
} from 'lucide-react';
import {
  fetchMoodEntries,
  postMoodEntry,
  fetchMessages,
  postMessage
} from '../api';

interface MoodEntry {
  date: string;
  mood: 'good' | 'neutral' | 'bad';
  symptoms: string[];
  notes: string;
}

interface Message {
  id: string;
  text: string;
  date: string;
}

const symptoms = [
  'Cramps', 'Headache', 'Bloating', 'Fatigue',
  'Backache', 'Nausea', 'Breast tenderness', 'Mood swings'
];

const MoodTracker = () => {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [mood, setMood] = useState<'good' | 'neutral' | 'bad'>('neutral');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchMoodEntries()
      .then(setEntries)
      .catch(err => console.error('Error fetching entries:', err));

    fetchMessages()
      .then(setMessages)
      .catch(err => console.error('Error fetching messages:', err));
  }, []);

  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    const newEntry: MoodEntry = {
      date: today,
      mood,
      symptoms: selectedSymptoms,
      notes
    };

    try {
      const savedEntry = await postMoodEntry(newEntry);
      const updated = [...entries];
      const index = updated.findIndex(entry => entry.date === today);
      if (index >= 0) {
        updated[index] = savedEntry;
      } else {
        updated.push(savedEntry);
      }
      setEntries(updated);
    } catch (err) {
      console.error('Error submitting entry:', err);
    }

    setShowForm(false);
    setMood('neutral');
    setSelectedSymptoms([]);
    setNotes('');
  };

  const handleAddMessage = async () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      date: new Date().toISOString()
    };

    try {
      await postMessage(message);
      setMessages([message, ...messages]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short', month: 'short', day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatMessageTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getMoodIcon = (moodType: string) => {
    switch (moodType) {
      case 'good': return <Smile className="text-green-500" />;
      case 'neutral': return <Meh className="text-yellow-500" />;
      case 'bad': return <Frown className="text-red-500" />;
      default: return <Meh className="text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-violet-700">Mood & Symptoms</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center space-x-1"
          >
            <Plus size={16} />
            <span>Log Today</span>
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-violet-50 rounded-lg mb-6">
            <div>
              <label className="block text-sm font-medium text-violet-700 mb-2">
                How are you feeling today?
              </label>
              <div className="flex justify-between items-center">
                {['bad', 'neutral', 'good'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setMood(type as 'bad' | 'neutral' | 'good')}
                    className={`p-3 rounded-full ${mood === type
                      ? `bg-${type === 'bad' ? 'red' : type === 'neutral' ? 'yellow' : 'green'}-100 ring-2 ring-${type === 'bad' ? 'red' : type === 'neutral' ? 'yellow' : 'green'}-300`
                      : 'bg-gray-50'
                      }`}
                  >
                    {getMoodIcon(type)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-violet-700 mb-2">
                Symptoms (select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {symptoms.map(symptom => (
                  <button
                    key={symptom}
                    type="button"
                    onClick={() => handleSymptomToggle(symptom)}
                    className={`py-2 px-3 text-sm rounded-lg text-left ${selectedSymptoms.includes(symptom)
                      ? 'bg-pink-100 text-pink-700 border border-pink-200'
                      : 'bg-white border'
                      }`}
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-violet-700 mb-2">
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input-field w-full h-20 resize-none"
                placeholder="How you're feeling today..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              <Save size={16} />
              <span>Save Entry</span>
            </button>
          </form>
        )}

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {entries.length > 0 ? (
            [...entries]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((entry, index) => (
                <div key={index} className="p-3 bg-violet-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-violet-700">{formatDate(entry.date)}</span>
                    <div className="w-6 h-6">{getMoodIcon(entry.mood)}</div>
                  </div>

                  {entry.symptoms.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs text-gray-500 mb-1">Symptoms:</p>
                      <div className="flex flex-wrap gap-1">
                        {entry.symptoms.map(symptom => (
                          <span
                            key={symptom}
                            className="text-xs bg-pink-100 text-pink-800 rounded-full px-2 py-0.5"
                          >
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {entry.notes && (
                    <p className="text-sm text-gray-700 mt-1">{entry.notes}</p>
                  )}
                </div>
              ))
          ) : (
            <p className="text-gray-500 text-center py-4">
              No entries yet. Log your first mood!
            </p>
          )}
        </div>
      </div>

      {/* Message Section */}
      <div className="card">
        <div className="flex items-center mb-4">
          <MessageSquare size={20} className="text-pink-500 mr-2" />
          <h2 className="text-xl font-semibold text-violet-700">Messages</h2>
        </div>

        <div className="mb-4">
          <div className="flex space-x-2">
            <textarea
              className="input-field flex-1 resize-none h-16"
              placeholder="Leave a message for yourself..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            ></textarea>
            <button
              onClick={handleAddMessage}
              className="bg-pink-400 hover:bg-pink-500 text-white rounded-lg px-3 transition-colors flex items-center justify-center"
              disabled={!newMessage.trim()}
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1 pl-1">
            Use this space to express your thoughts or leave notes for future you.
          </p>
        </div>

        <div className="space-y-3 max-h-60 overflow-y-auto">
          {messages.length > 0 ? (
            messages.map((message) => (
              <div
                key={message.id}
                className="p-3 bg-gradient-to-r from-pink-50 to-violet-50 rounded-lg border-l-4 border-pink-300"
              >
                <p className="text-gray-800 mb-2">{message.text}</p>
                <p className="text-xs text-gray-500 text-right">
                  {formatMessageTime(message.date)}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              <MessageSquare size={24} className="mx-auto text-gray-300 mb-2" />
              <p>No messages yet. Share your thoughts!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;
