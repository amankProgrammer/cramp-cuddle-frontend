const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

interface DiaryEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  date: string;
}

export const diaryApi = {
  login: async (username: string, password: string) => {
    const response = await fetch(`${BASE_URL}/api/diary/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    return response.json();
  },

  getEntries: async (userId: string) => {
    const response = await fetch(`${BASE_URL}/api/diary/entries/${userId}`);
    return response.json() as Promise<DiaryEntry[]>;
  },

  addEntry: async (userId: string, title: string, content: string) => {
    const response = await fetch(`${BASE_URL}/api/diary/entries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, title, content }),
    });
    return response.json();
  },

  deleteEntry: async (entryId: string) => {
    const response = await fetch(`${BASE_URL}/api/diary/entries/${entryId}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};