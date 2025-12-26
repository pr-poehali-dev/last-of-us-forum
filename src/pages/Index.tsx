import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface Thread {
  id: number;
  title: string;
  author: string;
  replies: number;
  views: number;
  likes: number;
  category: string;
  pinned?: boolean;
  timestamp: string;
  lastActivity: string;
}

interface UserBadge {
  id: number;
  name: string;
  icon: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress?: number;
  maxProgress?: number;
}

interface Comment {
  id: number;
  author: string;
  content: string;
  likes: number;
  timestamp: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('discussions');
  const [searchQuery, setSearchQuery] = useState('');
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadContent, setNewThreadContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Обсуждения');
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);

  const threads: Thread[] = [
    { id: 1, title: 'Тактика прохождения больницы без обнаружения', author: 'Joel_Miller', replies: 47, views: 1203, likes: 89, category: 'Гайды', pinned: true, timestamp: '2 часа назад', lastActivity: '15 мин назад' },
    { id: 2, title: 'Новый трейлер сезона 2 - разбор кадров', author: 'Ellie_Williams', replies: 89, views: 2456, likes: 156, category: 'Новости', pinned: true, timestamp: '5 часов назад', lastActivity: '3 мин назад' },
    { id: 3, title: 'Лучшие моменты из The Last of Us Part II', author: 'Abby_Anderson', replies: 34, views: 892, likes: 67, category: 'Видео', timestamp: '1 день назад', lastActivity: '2 часа назад' },
    { id: 4, title: 'Теория: связь кордицепса с реальными грибами', author: 'Dr_Infected', replies: 67, views: 1567, likes: 124, category: 'Обсуждения', timestamp: '3 дня назад', lastActivity: '1 час назад' },
    { id: 5, title: 'Как получить все достижения на 100%', author: 'Achievement_Hunter', replies: 23, views: 678, likes: 45, category: 'Гайды', timestamp: '1 неделю назад', lastActivity: '4 часа назад' },
    { id: 6, title: 'Сравнение игры и сериала - что лучше?', author: 'Media_Critic', replies: 102, views: 3421, likes: 198, category: 'Обсуждения', timestamp: '2 дня назад', lastActivity: '30 мин назад' },
    { id: 7, title: 'Секретные локации в Part I Remake', author: 'Explorer_Max', replies: 56, views: 1789, likes: 112, category: 'Гайды', timestamp: '4 дня назад', lastActivity: '5 часов назад' },
  ];

  const badges: UserBadge[] = [
    { id: 1, name: 'Выживший', icon: '🎯', description: '10+ сообщений', rarity: 'common', progress: 10, maxProgress: 10 },
    { id: 2, name: 'Охотник', icon: '🏹', description: '50+ сообщений', rarity: 'rare', progress: 35, maxProgress: 50 },
    { id: 3, name: 'Заражённый', icon: '🧟', description: 'Первая тема создана', rarity: 'common', progress: 1, maxProgress: 1 },
    { id: 4, name: 'Споры', icon: '🍄', description: '100+ лайков получено', rarity: 'epic', progress: 78, maxProgress: 100 },
    { id: 5, name: 'Светлячок', icon: '🔥', description: 'Модератор раздела', rarity: 'legendary', progress: 0, maxProgress: 1 },
    { id: 6, name: 'Легенда', icon: '👑', description: '500+ сообщений', rarity: 'legendary', progress: 247, maxProgress: 500 },
  ];

  const comments: Comment[] = [
    { id: 1, author: 'Tommy_Texas', content: 'Отличная тактика! Особенно момент с отвлечением кликеров камнями работает идеально.', likes: 12, timestamp: '10 мин назад' },
    { id: 2, author: 'Sarah_Survivor', content: 'Пробовал этот метод, но застрял на моменте с бегунами. Есть советы?', likes: 5, timestamp: '15 мин назад' },
    { id: 3, author: 'Joel_Miller', content: 'Для бегунов лучше использовать коктейли Молотова, они моментально их убивают.', likes: 18, timestamp: '5 мин назад' },
  ];

  const topUsers = [
    { name: 'Joel_Miller', posts: 1247, reputation: 4892, badges: ['👑', '🔥', '🏹'], level: 47, online: true },
    { name: 'Ellie_Williams', posts: 982, reputation: 3654, badges: ['🔥', '🏹', '🍄'], level: 42, online: true },
    { name: 'Tommy_Texas', posts: 756, reputation: 2891, badges: ['🏹', '🍄', '🎯'], level: 38, online: false },
    { name: 'Abby_Anderson', posts: 623, reputation: 2445, badges: ['🏹', '🎯'], level: 34, online: true },
    { name: 'Dr_Infected', posts: 534, reputation: 2103, badges: ['🍄', '🎯'], level: 31, online: false },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-amber-600 text-white border-amber-400';
      case 'epic': return 'bg-purple-600 text-white border-purple-400';
      case 'rare': return 'bg-blue-600 text-white border-blue-400';
      default: return 'bg-gray-600 text-white border-gray-400';
    }
  };

  const filteredThreads = threads.filter(thread => 
    thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getThreadsByCategory = (category: string) => {
    if (category === 'discussions') return filteredThreads;
    const categoryMap: { [key: string]: string } = {
      'news': 'Новости',
      'guides': 'Гайды',
      'videos': 'Видео'
    };
    return filteredThreads.filter(t => t.category === categoryMap[category]);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-900/10 via-transparent to-green-900/10 pointer-events-none"></div>
      
      <header className="border-b border-border bg-card/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl glow-effect">🍄</div>
              <div>
                <h1 className="text-3xl font-bold survival-text text-primary">THE LAST OF US</h1>
                <p className="text-xs text-muted-foreground">Сообщество выживших • 342 участника онлайн</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <Input
                  placeholder="Поиск по форуму..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 bg-muted/50"
                />
                <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </div>
              <Button variant="ghost" size="icon" className="relative">
                <Icon name="Bell" className="text-muted-foreground" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
              </Button>
              <Avatar className="border-2 border-primary cursor-pointer hover:scale-105 transition-transform">
                <AvatarFallback className="bg-primary text-primary-foreground font-bold">JM</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <Card className="p-4 infected-bg border-primary/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon name="Flame" className="text-primary" size={24} />
                  <div>
                    <h2 className="font-bold text-lg">Добро пожаловать на форум!</h2>
                    <p className="text-sm text-muted-foreground">Делись опытом, создавай темы и получай достижения</p>
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      <Icon name="Plus" size={18} className="mr-2" />
                      Создать тему
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card">
                    <DialogHeader>
                      <DialogTitle>Создание новой темы</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Категория</label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Обсуждения">Обсуждения</SelectItem>
                            <SelectItem value="Новости">Новости</SelectItem>
                            <SelectItem value="Гайды">Гайды</SelectItem>
                            <SelectItem value="Видео">Видео</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Заголовок</label>
                        <Input
                          placeholder="О чём хотите поговорить?"
                          value={newThreadTitle}
                          onChange={(e) => setNewThreadTitle(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Содержание</label>
                        <Textarea
                          placeholder="Расскажите подробнее..."
                          rows={6}
                          value={newThreadContent}
                          onChange={(e) => setNewThreadContent(e.target.value)}
                        />
                      </div>
                      <Button className="w-full bg-primary hover:bg-primary/90">
                        Опубликовать
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-6 mb-4 bg-card/50">
                <TabsTrigger value="discussions" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Icon name="MessageSquare" size={16} className="mr-1.5" />
                  Обсуждения
                </TabsTrigger>
                <TabsTrigger value="news" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Icon name="Newspaper" size={16} className="mr-1.5" />
                  Новости
                </TabsTrigger>
                <TabsTrigger value="guides" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Icon name="BookOpen" size={16} className="mr-1.5" />
                  Гайды
                </TabsTrigger>
                <TabsTrigger value="videos" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Icon name="Video" size={16} className="mr-1.5" />
                  Видео
                </TabsTrigger>
                <TabsTrigger value="profiles" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Icon name="Users" size={16} className="mr-1.5" />
                  Профили
                </TabsTrigger>
                <TabsTrigger value="ratings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Icon name="Trophy" size={16} className="mr-1.5" />
                  Рейтинг
                </TabsTrigger>
              </TabsList>

              {['discussions', 'news', 'guides', 'videos'].map(tab => (
                <TabsContent key={tab} value={tab} className="space-y-3">
                  {getThreadsByCategory(tab).map(thread => (
                    <Dialog key={thread.id}>
                      <DialogTrigger asChild>
                        <Card className="p-4 thread-hover cursor-pointer border-l-4 border-l-transparent hover:border-l-primary" onClick={() => setSelectedThread(thread)}>
                          <div className="flex items-start gap-4">
                            <Avatar className="border border-border">
                              <AvatarFallback className="bg-secondary text-secondary-foreground text-sm">
                                {thread.author.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    {thread.pinned && (
                                      <Badge className="bg-primary/20 text-primary border-primary">
                                        <Icon name="Pin" size={12} className="mr-1" />
                                        Закреплено
                                      </Badge>
                                    )}
                                    <h3 className="text-base font-semibold group-hover:text-primary transition-colors">
                                      {thread.title}
                                    </h3>
                                  </div>
                                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                                    <span className="flex items-center gap-1">
                                      <Icon name="User" size={12} />
                                      {thread.author}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Icon name="Clock" size={12} />
                                      {thread.timestamp}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Icon name="MessageCircle" size={12} />
                                      {thread.replies} ответов
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Icon name="Eye" size={12} />
                                      {thread.views}
                                    </span>
                                    <span className="flex items-center gap-1 text-primary">
                                      <Icon name="Heart" size={12} />
                                      {thread.likes}
                                    </span>
                                  </div>
                                </div>
                                <Badge variant="outline" className="shrink-0 text-xs">
                                  {thread.category}
                                </Badge>
                              </div>
                              <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                                <Icon name="Activity" size={12} />
                                Последняя активность: {thread.lastActivity}
                              </div>
                            </div>
                          </div>
                        </Card>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-card">
                        <DialogHeader>
                          <div className="flex items-start justify-between gap-3">
                            <DialogTitle className="text-xl">{selectedThread?.title}</DialogTitle>
                            <Badge variant="outline">{selectedThread?.category}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                            <span className="flex items-center gap-1">
                              <Icon name="User" size={14} />
                              {selectedThread?.author}
                            </span>
                            <span className="flex items-center gap-1">
                              <Icon name="Clock" size={14} />
                              {selectedThread?.timestamp}
                            </span>
                          </div>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="flex items-center gap-6 text-sm">
                            <Button variant="ghost" size="sm" className="gap-2">
                              <Icon name="Heart" size={16} />
                              {selectedThread?.likes}
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-2">
                              <Icon name="MessageCircle" size={16} />
                              {selectedThread?.replies}
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-2">
                              <Icon name="Share2" size={16} />
                              Поделиться
                            </Button>
                          </div>
                          <div className="border-t border-border pt-4">
                            <h3 className="font-semibold mb-3">Комментарии ({comments.length})</h3>
                            <div className="space-y-4">
                              {comments.map(comment => (
                                <div key={comment.id} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                                  <Avatar className="w-8 h-8">
                                    <AvatarFallback className="bg-secondary text-xs">
                                      {comment.author.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-semibold text-sm">{comment.author}</span>
                                      <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                                    </div>
                                    <p className="text-sm mb-2">{comment.content}</p>
                                    <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                                      <Icon name="ThumbsUp" size={12} />
                                      {comment.likes}
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-4 flex gap-2">
                              <Input placeholder="Написать комментарий..." className="flex-1" />
                              <Button className="bg-primary hover:bg-primary/90">
                                <Icon name="Send" size={16} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </TabsContent>
              ))}

              <TabsContent value="profiles" className="space-y-4">
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Icon name="Users" size={24} className="text-primary" />
                    Топ участников сообщества
                  </h2>
                  <div className="space-y-3">
                    {topUsers.map((user, index) => (
                      <div key={user.name} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-all cursor-pointer">
                        <div className={`text-2xl font-bold w-10 text-center ${index === 0 ? 'text-amber-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-amber-700' : 'text-muted-foreground'}`}>
                          #{index + 1}
                        </div>
                        <div className="relative">
                          <Avatar className="border-2 border-primary w-12 h-12">
                            <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                              {user.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {user.online && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-base flex items-center gap-2">
                            {user.name}
                            <Badge variant="outline" className="text-xs">Lvl {user.level}</Badge>
                          </h3>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{user.posts} сообщений</span>
                            <span>•</span>
                            <span className="text-primary">{user.reputation} репутации</span>
                          </div>
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
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Icon name="Trophy" size={24} className="text-primary" />
                    Рейтинговая таблица
                  </h2>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <Card className="p-4 text-center bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-amber-500/30">
                      <Icon name="Award" size={32} className="mx-auto mb-2 text-amber-500" />
                      <div className="text-2xl font-bold">24</div>
                      <div className="text-xs text-muted-foreground">Всего наград</div>
                    </Card>
                    <Card className="p-4 text-center bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30">
                      <Icon name="Zap" size={32} className="mx-auto mb-2 text-blue-500" />
                      <div className="text-2xl font-bold">1,247</div>
                      <div className="text-xs text-muted-foreground">Активность</div>
                    </Card>
                    <Card className="p-4 text-center bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/30">
                      <Icon name="TrendingUp" size={32} className="mx-auto mb-2 text-green-500" />
                      <div className="text-2xl font-bold">+125</div>
                      <div className="text-xs text-muted-foreground">За неделю</div>
                    </Card>
                  </div>
                  <div className="space-y-3">
                    {topUsers.map((user, index) => (
                      <div key={user.name} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                        <div className={`text-2xl font-bold ${index === 0 ? 'text-amber-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-amber-700' : 'text-muted-foreground'}`}>
                          #{index + 1}
                        </div>
                        <Avatar className="border-2 border-primary w-10 h-10">
                          <AvatarFallback className="bg-primary text-primary-foreground font-bold text-sm">
                            {user.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold">{user.name}</h3>
                          <div className="flex items-center gap-2 text-xs">
                            <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
                              <div className="bg-primary h-full rounded-full" style={{ width: `${(user.reputation / 5000) * 100}%` }}></div>
                            </div>
                            <span className="text-muted-foreground">{user.reputation} XP</span>
                          </div>
                        </div>
                        {index === 0 && <Icon name="Crown" size={28} className="text-amber-500" />}
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <Card className="p-6 infected-bg border-secondary/50">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="text-2xl">🍄</span>
                Система достижений
              </h2>
              <p className="text-xs text-muted-foreground mb-4">
                Зарабатывай бейджи за активность
              </p>
              <div className="space-y-3">
                {badges.map(badge => (
                  <div
                    key={badge.id}
                    className="flex items-start gap-3 p-3 bg-card/60 rounded-lg hover:bg-card transition-all duration-300 cursor-pointer border border-transparent hover:border-primary/30"
                  >
                    <span className="text-2xl">{badge.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm">{badge.name}</h3>
                        <Badge className={`text-xs px-1.5 py-0 ${getRarityColor(badge.rarity)}`}>
                          {badge.rarity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{badge.description}</p>
                      {badge.progress !== undefined && badge.maxProgress !== undefined && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Прогресс</span>
                            <span className="font-medium">{badge.progress}/{badge.maxProgress}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="bg-primary h-full rounded-full transition-all duration-500"
                              style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 border-primary/30">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Icon name="BarChart3" size={20} className="text-primary" />
                Статистика форума
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-2 rounded bg-muted/30">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Icon name="FileText" size={14} />
                    Тем:
                  </span>
                  <span className="font-semibold">1,247</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-muted/30">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Icon name="MessageSquare" size={14} />
                    Сообщений:
                  </span>
                  <span className="font-semibold">8,934</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-muted/30">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Icon name="Users" size={14} />
                    Участников:
                  </span>
                  <span className="font-semibold">342</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-primary/20 border border-primary/30">
                  <span className="text-foreground flex items-center gap-2">
                    <Icon name="Wifi" size={14} />
                    Онлайн:
                  </span>
                  <span className="font-semibold text-primary">47</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-destructive/20 to-orange-900/20 border-destructive/30">
              <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
                <Icon name="AlertTriangle" size={20} />
                Карантинная зона
              </h2>
              <p className="text-xs text-muted-foreground mb-3">
                Спойлеры и теории. Входить осторожно!
              </p>
              <Button variant="outline" size="sm" className="w-full border-destructive/50 hover:bg-destructive/20">
                Войти в зону
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
