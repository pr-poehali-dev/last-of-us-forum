import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Thread {
  id: number;
  title: string;
  author: string;
  replies: number;
  views: number;
  category: string;
  pinned?: boolean;
}

interface Badge {
  id: number;
  name: string;
  icon: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('discussions');

  const threads: Thread[] = [
    { id: 1, title: 'Тактика прохождения больницы без обнаружения', author: 'Joel_Miller', replies: 47, views: 1203, category: 'Гайды', pinned: true },
    { id: 2, title: 'Новый трейлер сезона 2 - разбор', author: 'Ellie_Williams', replies: 89, views: 2456, category: 'Новости', pinned: true },
    { id: 3, title: 'Лучшие моменты из The Last of Us Part II', author: 'Abby_Anderson', replies: 34, views: 892, category: 'Видео' },
    { id: 4, title: 'Теория: связь кордицепса с реальными грибами', author: 'Dr_Infected', replies: 67, views: 1567, category: 'Обсуждения' },
    { id: 5, title: 'Как получить все достижения на 100%', author: 'Achievement_Hunter', replies: 23, views: 678, category: 'Гайды' },
  ];

  const badges: Badge[] = [
    { id: 1, name: 'Выживший', icon: '🎯', description: '10+ сообщений', rarity: 'common' },
    { id: 2, name: 'Охотник', icon: '🏹', description: '50+ сообщений', rarity: 'rare' },
    { id: 3, name: 'Заражённый', icon: '🧟', description: 'Первая тема', rarity: 'common' },
    { id: 4, name: 'Споры', icon: '🍄', description: '100+ лайков', rarity: 'epic' },
    { id: 5, name: 'Светлячок', icon: '🔥', description: 'Модератор раздела', rarity: 'legendary' },
    { id: 6, name: 'Легенда', icon: '👑', description: '500+ сообщений', rarity: 'legendary' },
  ];

  const topUsers = [
    { name: 'Joel_Miller', posts: 1247, badges: ['👑', '🔥', '🏹'] },
    { name: 'Ellie_Williams', posts: 982, badges: ['🔥', '🏹', '🍄'] },
    { name: 'Tommy_Texas', posts: 756, badges: ['🏹', '🍄', '🎯'] },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-amber-600 text-white';
      case 'epic': return 'bg-purple-600 text-white';
      case 'rare': return 'bg-blue-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🍄</div>
              <div>
                <h1 className="text-3xl font-bold horror-text text-accent">THE LAST OF US</h1>
                <p className="text-sm text-muted-foreground">Форум выживших</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Icon name="Bell" className="text-muted-foreground hover:text-accent transition-colors cursor-pointer" />
              <Avatar className="border-2 border-primary">
                <AvatarFallback className="bg-primary text-primary-foreground">JM</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-6 mb-6 bg-card">
                <TabsTrigger value="discussions" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Icon name="MessageSquare" size={16} className="mr-2" />
                  Обсуждения
                </TabsTrigger>
                <TabsTrigger value="news" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Icon name="Newspaper" size={16} className="mr-2" />
                  Новости
                </TabsTrigger>
                <TabsTrigger value="guides" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Icon name="BookOpen" size={16} className="mr-2" />
                  Гайды
                </TabsTrigger>
                <TabsTrigger value="videos" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Icon name="Video" size={16} className="mr-2" />
                  Видео
                </TabsTrigger>
                <TabsTrigger value="profiles" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Icon name="Users" size={16} className="mr-2" />
                  Профили
                </TabsTrigger>
                <TabsTrigger value="ratings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Icon name="Trophy" size={16} className="mr-2" />
                  Рейтинг
                </TabsTrigger>
              </TabsList>

              <TabsContent value="discussions" className="space-y-4">
                {threads.filter(t => activeTab === 'discussions' ? true : t.category.toLowerCase() === activeTab).map(thread => (
                  <Card key={thread.id} className="p-4 hover:border-accent transition-all duration-300 cursor-pointer group">
                    <div className="flex items-start gap-4">
                      <Avatar className="border border-border">
                        <AvatarFallback className="bg-secondary text-secondary-foreground">
                          {thread.author.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {thread.pinned && <Icon name="Pin" size={14} className="text-accent" />}
                              <h3 className="text-lg font-semibold group-hover:text-accent transition-colors">
                                {thread.title}
                              </h3>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Icon name="User" size={14} />
                                {thread.author}
                              </span>
                              <span className="flex items-center gap-1">
                                <Icon name="MessageCircle" size={14} />
                                {thread.replies}
                              </span>
                              <span className="flex items-center gap-1">
                                <Icon name="Eye" size={14} />
                                {thread.views}
                              </span>
                            </div>
                          </div>
                          <Badge variant="outline" className="ml-4">
                            {thread.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="news" className="space-y-4">
                {threads.filter(t => t.category === 'Новости').map(thread => (
                  <Card key={thread.id} className="p-4 hover:border-accent transition-all duration-300 cursor-pointer group">
                    <div className="flex items-start gap-4">
                      <Avatar className="border border-border">
                        <AvatarFallback className="bg-secondary text-secondary-foreground">
                          {thread.author.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {thread.pinned && <Icon name="Pin" size={14} className="text-accent" />}
                              <h3 className="text-lg font-semibold group-hover:text-accent transition-colors">
                                {thread.title}
                              </h3>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Icon name="User" size={14} />
                                {thread.author}
                              </span>
                              <span className="flex items-center gap-1">
                                <Icon name="MessageCircle" size={14} />
                                {thread.replies}
                              </span>
                              <span className="flex items-center gap-1">
                                <Icon name="Eye" size={14} />
                                {thread.views}
                              </span>
                            </div>
                          </div>
                          <Badge variant="outline" className="ml-4">
                            {thread.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="guides" className="space-y-4">
                {threads.filter(t => t.category === 'Гайды').map(thread => (
                  <Card key={thread.id} className="p-4 hover:border-accent transition-all duration-300 cursor-pointer group">
                    <div className="flex items-start gap-4">
                      <Avatar className="border border-border">
                        <AvatarFallback className="bg-secondary text-secondary-foreground">
                          {thread.author.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {thread.pinned && <Icon name="Pin" size={14} className="text-accent" />}
                              <h3 className="text-lg font-semibold group-hover:text-accent transition-colors">
                                {thread.title}
                              </h3>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Icon name="User" size={14} />
                                {thread.author}
                              </span>
                              <span className="flex items-center gap-1">
                                <Icon name="MessageCircle" size={14} />
                                {thread.replies}
                              </span>
                              <span className="flex items-center gap-1">
                                <Icon name="Eye" size={14} />
                                {thread.views}
                              </span>
                            </div>
                          </div>
                          <Badge variant="outline" className="ml-4">
                            {thread.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="videos" className="space-y-4">
                {threads.filter(t => t.category === 'Видео').map(thread => (
                  <Card key={thread.id} className="p-4 hover:border-accent transition-all duration-300 cursor-pointer group">
                    <div className="flex items-start gap-4">
                      <Avatar className="border border-border">
                        <AvatarFallback className="bg-secondary text-secondary-foreground">
                          {thread.author.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {thread.pinned && <Icon name="Pin" size={14} className="text-accent" />}
                              <h3 className="text-lg font-semibold group-hover:text-accent transition-colors">
                                {thread.title}
                              </h3>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Icon name="User" size={14} />
                                {thread.author}
                              </span>
                              <span className="flex items-center gap-1">
                                <Icon name="MessageCircle" size={14} />
                                {thread.replies}
                              </span>
                              <span className="flex items-center gap-1">
                                <Icon name="Eye" size={14} />
                                {thread.views}
                              </span>
                            </div>
                          </div>
                          <Badge variant="outline" className="ml-4">
                            {thread.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="profiles" className="space-y-4">
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Топ участников</h2>
                  <div className="space-y-4">
                    {topUsers.map((user, index) => (
                      <div key={user.name} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                        <div className="text-3xl font-bold text-primary">#{index + 1}</div>
                        <Avatar className="border-2 border-primary">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {user.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{user.name}</h3>
                          <p className="text-sm text-muted-foreground">{user.posts} сообщений</p>
                        </div>
                        <div className="flex gap-1">
                          {user.badges.map((badge, i) => (
                            <span key={i} className="text-2xl">{badge}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="ratings" className="space-y-4">
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Рейтинговая таблица</h2>
                  <div className="space-y-4">
                    {topUsers.map((user, index) => (
                      <div key={user.name} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className={`text-3xl font-bold ${index === 0 ? 'text-amber-500' : index === 1 ? 'text-gray-400' : 'text-amber-700'}`}>
                          #{index + 1}
                        </div>
                        <Avatar className="border-2 border-primary">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {user.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{user.name}</h3>
                          <p className="text-sm text-muted-foreground">{user.posts} очков репутации</p>
                        </div>
                        {index === 0 && <Icon name="Trophy" size={32} className="text-amber-500" />}
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="p-6 fungus-bg border-secondary">
              <h2 className="text-xl font-bold mb-4 horror-text">🍄 Система достижений</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Зарабатывай бейджи за активность на форуме
              </p>
              <div className="space-y-3">
                {badges.map(badge => (
                  <div
                    key={badge.id}
                    className="flex items-start gap-3 p-3 bg-card/80 rounded-lg hover:bg-card transition-all duration-300 cursor-pointer pulse-red"
                  >
                    <span className="text-3xl">{badge.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{badge.name}</h3>
                        <Badge className={`text-xs ${getRarityColor(badge.rarity)}`}>
                          {badge.rarity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 border-primary">
              <h2 className="text-xl font-bold mb-4">📊 Статистика форума</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Тем:</span>
                  <span className="font-semibold">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Сообщений:</span>
                  <span className="font-semibold">8,934</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Участников:</span>
                  <span className="font-semibold">342</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Онлайн:</span>
                  <span className="font-semibold text-accent">47</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-primary/20 to-destructive/20 border-accent">
              <h2 className="text-xl font-bold mb-2 horror-text">⚠️ Карантинная зона</h2>
              <p className="text-sm text-muted-foreground">
                Обсуждение спойлеров и теорий. Осторожно!
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
