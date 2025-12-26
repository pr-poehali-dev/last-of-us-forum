import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { api, getCurrentUserId } from '@/lib/api';
import Icon from '@/components/ui/icon';

interface MessagesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  friend: any;
}

export function MessagesDialog({ open, onOpenChange, friend }: MessagesDialogProps) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    if (open && friend) {
      loadMessages();
    }
  }, [open, friend]);

  const loadMessages = async () => {
    try {
      const data = await api.messages.getByFriend(friend.id);
      setMessages(data.messages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      await api.messages.send(friend.id, newMessage);
      setNewMessage('');
      await loadMessages();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить сообщение',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card max-w-2xl h-[600px] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={friend?.avatar} />
              <AvatarFallback>{friend?.name?.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle>{friend?.name}</DialogTitle>
              <p className="text-sm text-muted-foreground">
                {friend?.online ? '🟢 Онлайн' : '⚫ Не в сети'}
              </p>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4 py-4">
            {messages.map((msg) => {
              const isOwn = msg.senderId === parseInt(currentUserId);
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={msg.senderAvatar} />
                    <AvatarFallback className="text-xs">
                      {msg.senderName?.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`flex-1 ${isOwn ? 'text-right' : ''}`}>
                    <div
                      className={`inline-block px-4 py-2 rounded-lg max-w-[70%] ${
                        isOwn
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString('ru', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="flex gap-2 pt-4 border-t">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Написать сообщение..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={loading}
          />
          <Button
            onClick={handleSend}
            disabled={loading || !newMessage.trim()}
            className="bg-primary hover:bg-primary/90"
          >
            <Icon name="Send" size={16} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
