// src/api.ts
const BASE_URL = 'https://cramp-cuddle.onrender.com';

export const fetchMoodEntries = async () => {
  const res = await fetch(`${BASE_URL}/api/moods`);
  return await res.json();
};

export const postMoodEntry = async (entry: any) => {
  const res = await fetch(`${BASE_URL}/api/moods`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
  return await res.json();
};

export const fetchMessages = async () => {
  const res = await fetch(`${BASE_URL}/api/messages`);
  return await res.json();
};

export const postMessage = async (message: any) => {
  const res = await fetch(`${BASE_URL}/api/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  });
  return await res.json();
};
