import React, { useState, useEffect } from 'react';
import { diaryApi } from '../api/diaryApi';

interface DiaryEntry {
  _id: string;
  userId: string;
  title: string;
  content: string;
  date: string;
  __v?: number;
}

const Diary: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [newEntry, setNewEntry] = useState({ title: '', content: '' });
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(0); // State for the current page

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserId(null);
    localStorage.removeItem('diaryUserId');
  };

  useEffect(() => {
    localStorage.removeItem('diaryUserId');
    setIsAuthenticated(false);
    setUserId(null);
  }, []);

  const fetchEntries = async (currentUserId: string) => {
    try {
      const data = await diaryApi.getEntries(currentUserId);
      if (data && typeof data === 'object') {
        const entries = Array.isArray(data) ? data : [];
        setEntries(entries.map(entry => ({
          _id: entry._id || '',
          userId: entry.userId || '',
          title: entry.title || '',
          content: entry.content || '',
          date: entry.date || new Date().toISOString()
        })));
        setCurrentPage(entries.length > 0 ? entries.length - 1 : 0);
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
        new Date().toLocaleDateString(),
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

  useEffect(() => {
    const savedUserId = localStorage.getItem('diaryUserId');
    if (savedUserId) {
      setUserId(savedUserId);
      setIsAuthenticated(true);
      fetchEntries(savedUserId);
    }
  }, []);

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, entries.length - 1));
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-violet-600 font-architects-daughter text-xl">Opening your diary...</p>
        </div>
      </div>
    );
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await (isRegistering
        ? diaryApi.register(username, password)
        : diaryApi.login(username, password));

      if (response.success) {
        setUserId(response.userId);
        setIsAuthenticated(true);
        localStorage.setItem('diaryUserId', response.userId);
        await fetchEntries(response.userId);
      } else {
        setError(response.message || 'Authentication failed');
      }
    } catch (error) {
      setError(isRegistering
        ? 'Registration failed. Please try again.'
        : 'Invalid username or password.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-10 p-8 bg-paper-texture border-2 border-gray-400 rounded-lg shadow-2xl">
        <h2 className="text-4xl font-architects-daughter text-center mb-6">
          {isRegistering ? "Start a New Diary" : "Welcome Back"}
        </h2>
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 bg-transparent border-b-2 border-gray-400 focus:outline-none focus:ring-0 font-architects-daughter text-xl"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 bg-transparent border-b-2 border-gray-400 focus:outline-none focus:ring-0 font-architects-daughter text-xl"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full mt-4 text-center text-gray-700 font-architects-daughter text-2xl px-4 py-2 hover:bg-gray-200 transition-colors"
          >
            {isRegistering ? "✍️ Create Account" : "📖 Open Diary"}
          </button>
        </form>
        <button
          onClick={() => setIsRegistering(!isRegistering)}
          className="w-full mt-4 text-center text-gray-500 hover:underline font-architects-daughter"
        >
          {isRegistering ? "Already have a diary? Login" : "Create a new diary"}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 pt-4 bg-transparent rounded-lg notebook-container">
      <div className="flex justify-between items-center mb-6 border-b border-gray-400 pb-4">
        <p className="font-architects-daughter text-2xl text-gray-700">
          Your Diary: {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
        </p>
        <button
          onClick={handleLogout}
          className="font-architects-daughter text-gray-700 hover:text-gray-900 text-xl"
        >
          Close Diary 🔐
        </button>
      </div>

      {/* New Entry Form */}
      <form onSubmit={handleAddEntry} className="mb-8 p-6 bg-transparent">
        <input
          type="text"
          placeholder="Date..."
          value={new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
          className="w-full bg-transparent border-none font-architects-daughter text-2xl mb-4 text-gray-600"
          readOnly
        />
        <textarea
          placeholder="Dear diary..."
          value={newEntry.content}
          onChange={(e) => setNewEntry({ ...newEntry, title: new Date().toLocaleDateString(), content: e.target.value })}
          className="w-full bg-transparent border-none font-architects-daughter text-xl min-h-[200px] focus:outline-none resize-none leading-relaxed text-gray-800"
        />
        <button
          type="submit"
          className="mt-4 px-6 py-2 text-center text-gray-700 font-architects-daughter text-2xl hover:bg-gray-200 transition-colors"
        >
          Write Entry ✍️
        </button>
      </form>

      {/* Pages Container with Sliding Effect */}
      <div className="relative h-[400px] overflow-hidden">
        {entries.map((entry, index) => (
          <div
            key={entry._id}
            className={`absolute inset-0 p-6 bg-transparent lined-paper transition-transform duration-500 ease-in-out transform ${index === currentPage ? 'translate-x-0' : (index < currentPage ? '-translate-x-full' : 'translate-x-full')}`}
          >
            <p className="font-architects-daughter text-xl mb-4 text-gray-600">
              {new Date(entry.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <p className="font-architects-daughter text-lg leading-relaxed text-gray-800">{entry.content}</p>
            <button
              onClick={() => handleDeleteEntry(entry._id)}
              className="absolute top-4 right-4 text-red-400 hover:text-red-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className="px-4 py-2 text-gray-700 font-architects-daughter disabled:text-gray-400"
        >
          &larr; Previous Page
        </button>
        <p className="font-architects-daughter text-lg text-gray-600">
          Page {currentPage + 1} of {entries.length}
        </p>
        <button
          onClick={handleNextPage}
          disabled={currentPage === entries.length - 1}
          className="px-4 py-2 text-gray-700 font-architects-daughter disabled:text-gray-400"
        >
          Next Page &rarr;
        </button>
      </div>
    </div>
  );
};

export default Diary;