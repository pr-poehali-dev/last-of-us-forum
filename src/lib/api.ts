const API_URL = 'https://functions.poehali.dev/df91ae66-4c74-44f8-b6e4-9a37f509129e';

export const getCurrentUserId = () => {
  const stored = localStorage.getItem('currentUserId');
  return stored || '1';
};

export const setCurrentUserId = (userId: string) => {
  localStorage.setItem('currentUserId', userId);
};

const apiRequest = async (action: string, options: RequestInit = {}) => {
  const userId = getCurrentUserId();
  
  const response = await fetch(`${API_URL}?action=${action}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': userId,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
};

export const api = {
  users: {
    getAll: () => apiRequest('users'),
    getCurrent: () => apiRequest('user'),
    update: (data: { displayName?: string; username?: string; avatarUrl?: string; bio?: string }) =>
      apiRequest('user', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  threads: {
    getAll: (category?: string) => apiRequest(`threads${category ? `&category=${category}` : ''}`),
    create: (data: { title: string; content: string; category: string }) =>
      apiRequest('thread', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (threadId: number, data: { title?: string; content?: string; isPinned?: boolean }) =>
      apiRequest('thread', {
        method: 'PUT',
        body: JSON.stringify({ threadId, ...data }),
      }),
  },

  comments: {
    getByThread: (threadId: number) => apiRequest(`comments&threadId=${threadId}`),
    create: (threadId: number, content: string) =>
      apiRequest('comment', {
        method: 'POST',
        body: JSON.stringify({ threadId, content }),
      }),
  },

  friends: {
    getAll: () => apiRequest('friends'),
    add: (friendId: number) =>
      apiRequest('friend', {
        method: 'POST',
        body: JSON.stringify({ friendId }),
      }),
    remove: (friendId: number) =>
      apiRequest('friend', {
        method: 'DELETE',
      }).then(() => fetch(`${API_URL}?action=friend&friendId=${friendId}`, {
        method: 'DELETE',
        headers: { 'X-User-Id': getCurrentUserId() },
      })),
  },

  messages: {
    getByFriend: (friendId: number) => apiRequest(`messages&friendId=${friendId}`),
    send: (receiverId: number, content: string) =>
      apiRequest('message', {
        method: 'POST',
        body: JSON.stringify({ receiverId, content }),
      }),
  },
};
