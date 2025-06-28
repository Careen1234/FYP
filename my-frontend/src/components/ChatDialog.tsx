import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { listenToMessages } from './message/ListenMessage';
import { sendMessage } from './message/SendMessage';
import { useAuth } from './AuthContext';
import { Timestamp } from 'firebase/firestore';

interface ChatDialogProps {
  open: boolean;
  onClose: () => void;
  provider: {
    id: number;
    name: string;
  } | null;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: Timestamp;
}

const ChatDialog: React.FC<ChatDialogProps> = ({ open, onClose, provider }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getChatId = useCallback(() => {
    if (!user || !provider) return null;
    const ids = [user.id, provider.id].sort();
    return ids.join('_');
  }, [user, provider]);

  useEffect(() => {
    const chatId = getChatId();
    if (chatId && open) {
      const unsubscribe = listenToMessages(chatId, (msgs) => {
        setMessages(msgs as Message[]);
        scrollToBottom();
      });
      return () => unsubscribe();
    }
  }, [open, getChatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    const chatId = getChatId();
    if (newMessage.trim() && chatId && user) {
      await sendMessage(chatId, user.id, newMessage.trim());
      setNewMessage('');
    }
  };

  const formatTimestamp = (ts: Timestamp) => {
    if (!ts) return '';
    return new Date(ts.seconds * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        Chat with {provider?.name}
      </DialogTitle>
      <DialogContent sx={{ height: '50vh', display: 'flex', flexDirection: 'column', bgcolor: 'grey.100' }}>
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
          {messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                display: 'flex',
                justifyContent: msg.senderId === user?.id ? 'flex-end' : 'flex-start',
                mb: 1,
              }}
            >
              <Box>
                <Typography
                  variant="body1"
                  sx={{
                    display: 'inline-block',
                    px: 1.5,
                    py: 1,
                    borderRadius: '12px',
                    bgcolor: msg.senderId === user?.id ? 'primary.light' : '#fff',
                    color: 'text.primary',
                    boxShadow: 1,
                  }}
                >
                  {msg.content}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: 'block',
                    textAlign: msg.senderId === user?.id ? 'right' : 'left',
                    mt: 0.5,
                  }}
                >
                  {formatTimestamp(msg.createdAt)}
                </Typography>
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            sx={{ bgcolor: '#fff', borderRadius: '20px', '.MuiOutlinedInput-notchedOutline': {border: 'none'} }}
          />
          <IconButton color="primary" onClick={handleSendMessage} sx={{ ml: 1 }}>
            <SendIcon />
          </IconButton>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChatDialog; 