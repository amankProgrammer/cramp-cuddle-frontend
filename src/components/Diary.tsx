import React, { useState } from 'react';
import { useEffect } from 'react';
import { diaryApi } from '../api/diaryApi';

interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  date: string;
}

const Diary: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  // Add this line
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
      setEntries(Array.isArray(data) ? data : []); // Ensure entries is always an array
    } catch (error) {
      console.error('Failed to fetch entries:', error);
      setEntries([]); // Set empty array on error
    }
  };

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      const response = await diaryApi.addEntry(
        userId,
        newEntry.title,
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
    try {
      const response = await diaryApi.deleteEntry(entryId);
      if (response.success && userId) {
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

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-dancing-script text-center mb-6">Dear Diary...</h2>
        <form onSubmit={handleLogin} className="space-y-4">
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
            Login / Register
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <div className="flex justify-end mb-6">
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
          <div key={entry.id} className="bg-[#fff8dc] p-6 rounded-lg shadow-md relative">
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
              onClick={() => handleDeleteEntry(entry.id)}
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