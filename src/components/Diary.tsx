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
      setEntries(data);
    } catch (error) {
      console.error('Failed to fetch entries:', error);
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
        <h2 className="text-2xl font-bold mb-6">My Personal Diary</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">My Diary Entries</h2>
      
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
          <div key={entry.id} className="border p-4 rounded">
            <h3 className="text-xl font-semibold">{entry.title}</h3>
            <p className="text-gray-500 text-sm">{new Date(entry.date).toLocaleDateString()}</p>
            <p className="mt-2">{entry.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Diary;