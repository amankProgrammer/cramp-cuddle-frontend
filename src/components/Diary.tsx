import React, { useState } from 'react';
import { useEffect } from 'react';
import { diaryApi } from '../api/diaryApi';

// Update the interface to match MongoDB response
interface DiaryEntry {
  _id: string;
  userId: string;
  title: string;
  content: string;
  date: string;
  __v?: number; // Add this to match MongoDB document version
}

// Move isRegistering state to the top with other states
const Diary: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [newEntry, setNewEntry] = useState({ title: '', content: '' });
  const [userId, setUserId] = useState<string | null>(null);

  // Add a logout function
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserId(null);
    localStorage.removeItem('diaryUserId');
  };

  useEffect(() => {
    // Clear any existing session when component mounts
    localStorage.removeItem('diaryUserId');
    setIsAuthenticated(false);
    setUserId(null);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await diaryApi.login(username, password);
      if (response.success) {
        setUserId(response.userId);
        setIsAuthenticated(true);
        localStorage.setItem('diaryUserId', response.userId);
        await fetchEntries(response.userId);
      }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEntries = async (currentUserId: string) => {
    try {
      const data = await diaryApi.getEntries(currentUserId);
      // Handle the response data more safely
      if (data && typeof data === 'object') {
        const entries = Array.isArray(data) ? data : [];
        setEntries(entries.map(entry => ({
          _id: entry._id || '',
          userId: entry.userId || '',
          title: entry.title || '',
          content: entry.content || '',
          date: entry.date || new Date().toISOString()
        })));
      } else {
        setEntries([]);
      }
    } catch (error) {
      console.error('Failed to fetch entries:', error);
      setEntries([]);
    }
  };

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      const response = await diaryApi.addEntry(
        userId,
        new Date().toLocaleDateString(),  // Use current date as title
        newEntry.content
      );
      if (response.success) {
        setNewEntry({ title: '', content: '' });
        fetchEntries(userId);
      }
    } catch (error) {
      console.error('Failed to add entry:', error);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!entryId || !userId) return;
    try {
      const response = await diaryApi.deleteEntry(entryId);
      if (response.success) {
        fetchEntries(userId);
      }
    } catch (error) {
      console.error('Failed to delete entry:', error);
    }
  };

  // Check for existing session
  useEffect(() => {
    const savedUserId = localStorage.getItem('diaryUserId');
    if (savedUserId) {
      setUserId(savedUserId);
      setIsAuthenticated(true);
      fetchEntries(savedUserId);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-violet-600 font-dancing-script text-xl">Opening your diary...</p>
        </div>
      </div>
    );
  }

  // Add separate handlers for login and register
  // Remove the old handleLogin function and keep only handleAuth
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await (isRegistering 
        ? diaryApi.register(username, password)
        : diaryApi.login(username, password));
      
      if (response.success) {
        setUserId(response.userId);
        setIsAuthenticated(true);
        localStorage.setItem('diaryUserId', response.userId);
        await fetchEntries(response.userId);
      }
    } catch (error) {
      console.error(isRegistering ? 'Registration failed:' : 'Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update the form's onSubmit handler
  <form onSubmit={handleAuth} className="space-y-4">
    {/* ... form inputs ... */}
  </form>

  // Update the form submission in the login/register section
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-dancing-script text-center mb-6">
          {isRegistering ? "Create Your Diary" : "Dear Diary..."}
        </h2>
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-violet-500 text-white p-2 rounded hover:bg-violet-600 transition-colors"
          >
            {isRegistering ? "Create Account" : "Login"}
          </button>
        </form>
        <button
          onClick={() => setIsRegistering(!isRegistering)}
          className="w-full mt-4 text-violet-500 hover:text-violet-600 font-dancing-script"
        >
          {isRegistering ? "Already have a diary? Login" : "Create a new diary"}
        </button>
      </div>
    );
  }
  
  // Update the authenticated view header to show entry count
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <div className="flex justify-between items-center mb-6">
        <p className="font-dancing-script text-lg text-gray-600">
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'} in your diary
        </p>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 font-dancing-script text-lg"
        >
          Close Diary
        </button>
      </div>
      
      <form onSubmit={handleAddEntry} className="mb-8 bg-[#fff8dc] p-6 rounded-lg shadow-md">
        <input
          type="text"
          placeholder="Date..."
          value={new Date().toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
          className="w-full bg-transparent border-none font-dancing-script text-xl mb-4"
          readOnly
        />
        <textarea
          placeholder="Dear diary..."
          value={newEntry.content}
          onChange={(e) => setNewEntry({ ...newEntry, title: new Date().toLocaleDateString(), content: e.target.value })}
          className="w-full bg-transparent border-none font-dancing-script text-lg min-h-[200px] focus:outline-none leading-relaxed"
        />
        <button
          type="submit"
          className="mt-4 text-gray-600 hover:text-gray-800 font-dancing-script text-lg"
        >
          Save Entry
        </button>
      </form>

      <div className="space-y-6">
        {entries.map((entry) => (
          <div key={entry._id} className="bg-[#fff8dc] p-6 rounded-lg shadow-md relative">
            <p className="font-dancing-script text-lg mb-4">
              {new Date(entry.date).toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <p className="font-dancing-script text-lg leading-relaxed">{entry.content}</p>
            <button
              onClick={() => handleDeleteEntry(entry._id)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Diary;