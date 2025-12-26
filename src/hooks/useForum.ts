import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export function useForum() {
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [threads, setThreads] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, threadsData, userData, friendsData] = await Promise.all([
        api.users.getAll(),
        api.threads.getAll(),
        api.users.getCurrent(),
        api.friends.getAll(),
      ]);

      setUsers(usersData.users);
      setThreads(threadsData.threads);
      setCurrentUser(userData.user);
      setFriends(friendsData.friends);
    } catch (error) {
      toast({
        title: 'Ошибка загрузки',
        description: 'Не удалось загрузить данные форума',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createThread = async (title: string, content: string, category: string) => {
    try {
      const result = await api.threads.create({ title, content, category });
      await loadData();
      toast({
        title: 'Тема создана!',
        description: 'Ваша тема опубликована на форуме',
      });
      return result;
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать тему',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateThread = async (threadId: number, data: any) => {
    try {
      await api.threads.update(threadId, data);
      await loadData();
      toast({
        title: 'Тема обновлена!',
        description: 'Изменения сохранены',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить тему',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const addFriend = async (friendId: number) => {
    try {
      await api.friends.add(friendId);
      await loadData();
      toast({
        title: 'Друг добавлен!',
        description: 'Пользователь добавлен в список друзей',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить друга',
        variant: 'destructive',
      });
    }
  };

  const removeFriend = async (friendId: number) => {
    try {
      await api.friends.remove(friendId);
      await loadData();
      toast({
        title: 'Друг удалён',
        description: 'Пользователь удалён из списка друзей',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить друга',
        variant: 'destructive',
      });
    }
  };

  const isFriend = (userId: number) => {
    return friends.some(f => f.id === userId);
  };

  return {
    users,
    threads,
    currentUser,
    friends,
    loading,
    loadData,
    createThread,
    updateThread,
    addFriend,
    removeFriend,
    isFriend,
  };
}
