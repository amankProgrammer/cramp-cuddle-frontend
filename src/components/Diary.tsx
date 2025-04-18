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
    try {
      const response = await diaryApi.login(username, password);
      if (response.success) {
        setUserId(response.userId);
        setIsAuthenticated(true);
        localStorage.setItem('diaryUserId', response.userId);
        fetchEntries(response.userId);
      }
    } catch (error) {
      console.error('Login failed:', error);
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

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">My Personal Diary</h2>
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
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Diary Entries</h2>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
      <form onSubmit={handleAddEntry} className="mb-8">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Entry Title"
            value={newEntry.title}
            onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <textarea
            placeholder="Write your entry..."
            value={newEntry.content}
            onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
            className="w-full p-2 border rounded h-32"
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Add Entry
        </button>
      </form>

      <div className="space-y-4">
        {entries.map((entry) => (
          <div key={entry.id} className="border p-4 rounded relative">
            <h3 className="text-xl font-semibold">{entry.title}</h3>
            <p className="text-gray-500 text-sm">{new Date(entry.date).toLocaleDateString()}</p>
            <p className="mt-2">{entry.content}</p>
            <button
              onClick={() => handleDeleteEntry(entry.id)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Diary;