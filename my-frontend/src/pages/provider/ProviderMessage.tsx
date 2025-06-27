import React, { useEffect, useState } from 'react';
import { Button, Stack, Container, Paper, Typography, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItemButton, ListItemText, Box } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import ChatIcon from '@mui/icons-material/Chat';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../components/Firebase';
import { useAuth } from '../../components/AuthContext';
import ChatDialog from '../../components/ChatDialog';

const providerPhone = '+255123456789'; // Replace with dynamic value if available

const ProviderMessage: React.FC = () => {
  const { user } = useAuth();
  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [showInAppCall, setShowInAppCall] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [chatUsers, setChatUsers] = useState<any[]>([]);
  const [chatDialogOpen, setChatDialogOpen] = useState(false);
  const [selectUserDialogOpen, setSelectUserDialogOpen] = useState(false);

  // Fetch all chats where provider is a participant
  useEffect(() => {
    if (!user) return;
    const chatsRef = collection(db, 'chats');
    const unsubscribe = onSnapshot(chatsRef, (snapshot) => {
      const users: any[] = [];
      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        if (!docSnap.id.includes(String(user.id))) continue;
        const ids = docSnap.id.split('_');
        const otherId = ids.find((id: string) => id !== String(user.id));
        if (otherId) {
          users.push({ id: otherId, name: `User ${otherId}` });
        }
      }
      setChatUsers(users);
    });
    return () => unsubscribe();
  }, [user]);

  const handleInAppMessage = () => {
    if (chatUsers.length === 0) {
      setMessageDialogOpen(false);
      alert('No users to chat with.');
      return;
    }
    if (chatUsers.length === 1) {
      setSelectedUser(chatUsers[0]);
      setChatDialogOpen(true);
      setMessageDialogOpen(false);
      return;
    }
    setSelectUserDialogOpen(true);
    setMessageDialogOpen(false);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 4, p: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Communication Options
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2, mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<PhoneIcon />}
            onClick={() => setCallDialogOpen(true)}
          >
            Call
          </Button>
          <Button
            variant="contained"
            startIcon={<ChatIcon />}
            onClick={() => setMessageDialogOpen(true)}
          >
            Message
          </Button>
        </Stack>
      </Paper>

      {/* Call Option Dialog */}
      <Dialog open={callDialogOpen} onClose={() => setCallDialogOpen(false)}>
        <DialogTitle>How would you like to call?</DialogTitle>
        <DialogContent>
          <Button
            fullWidth
            variant="contained"
            sx={{ mb: 2 }}
            onClick={() => {
              setShowInAppCall(true);
              setCallDialogOpen(false);
            }}
          >
            Within the app
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => {
              setCallDialogOpen(false);
              // Implement phone call logic if you have user phone numbers
            }}
          >
            Via your phone
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCallDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* In-App Call Placeholder Dialog */}
      <Dialog open={showInAppCall} onClose={() => setShowInAppCall(false)}>
        <DialogTitle>In-App Call</DialogTitle>
        <DialogContent>
          <Typography>This is a placeholder for in-app calling functionality.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowInAppCall(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Message Option Dialog */}
      <Dialog open={messageDialogOpen} onClose={() => setMessageDialogOpen(false)}>
        <DialogTitle>How would you like to message?</DialogTitle>
        <DialogContent>
          <Button
            fullWidth
            variant="contained"
            sx={{ mb: 2 }}
            onClick={handleInAppMessage}
          >
            Within the app
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => {
              setMessageDialogOpen(false);
              // Implement SMS logic if you have user phone numbers
            }}
          >
            Via your phone
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMessageDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Select User Dialog */}
      <Dialog open={selectUserDialogOpen} onClose={() => setSelectUserDialogOpen(false)}>
        <DialogTitle>Select a user to chat with</DialogTitle>
        <DialogContent>
          <List>
            {chatUsers.map((u) => (
              <ListItemButton key={u.id} onClick={() => {
                setSelectedUser(u);
                setChatDialogOpen(true);
                setSelectUserDialogOpen(false);
              }}>
                <ListItemText primary={u.name} />
              </ListItemButton>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectUserDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Chat Dialog */}
      {selectedUser && (
        <ChatDialog
          open={chatDialogOpen}
          onClose={() => setChatDialogOpen(false)}
          provider={{ id: selectedUser.id, name: selectedUser.name }}
        />
      )}
    </Container>
  );
};

export default ProviderMessage;
