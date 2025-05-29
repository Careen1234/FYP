import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, Dialog, DialogContent, DialogTitle, TextField, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface CmsPage {
  id: number;
  title: string;
  slug: string;
  content: string;
  seo_title?: string;
  seo_description?: string;
}

const CmsPagesManager: React.FC = () => {
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [open, setOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<CmsPage | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    seo_title: '',
    seo_description: ''
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      // Uncomment when backend ready
      // const res = await axios.get('/api/cms-pages');
      // setPages(res.data);
      setPages([]); // Placeholder
    } catch (error) {
      console.error('Failed to fetch CMS pages:', error);
    }
  };

  const handleOpen = (page?: CmsPage) => {
    if (page) {
      setEditingPage(page);
      setFormData({
        title: page.title,
        content: page.content || '',
        seo_title: page.seo_title || '',
        seo_description: page.seo_description || '',
      });
    } else {
      setEditingPage(null);
      setFormData({
        title: '',
        content: '',
        seo_title: '',
        seo_description: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      if (editingPage) {
        // await axios.put(`/api/cms-pages/${editingPage.id}`, formData);
      } else {
        // await axios.post('/api/cms-pages', formData);
      }
      handleClose();
      fetchPages();
    } catch (error) {
      console.error('Failed to save CMS page:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this page?')) return;
    try {
      // await axios.delete(`/api/cms-pages/${id}`);
      fetchPages();
    } catch (error) {
      console.error('Failed to delete CMS page:', error);
    }
  };

  return (
    <Box p={7}>
      <Typography variant="h4" sx={{ color: '#147c3c', mb: 2 }} gutterBottom>CMS Pages</Typography>
      <Button variant="contained"  onClick={() => handleOpen()}>Add New Page</Button>

      <List>
        {pages.map(page => (
          <ListItem key={page.id} secondaryAction={
            <>
              <IconButton edge="end" onClick={() => handleOpen(page)}><EditIcon /></IconButton>
              <IconButton edge="end" onClick={() => handleDelete(page.id)}><DeleteIcon /></IconButton>
            </>
          }>
            <ListItemText primary={page.title} secondary={page.slug} />
          </ListItem>
        ))}
      </List>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editingPage ? 'Edit Page' : 'Add New Page'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            fullWidth
            multiline
            rows={6}
            margin="normal"
          />
          <TextField
            label="SEO Title"
            name="seo_title"
            value={formData.seo_title}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="SEO Description"
            name="seo_description"
            value={formData.seo_description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={2}
            margin="normal"
          />
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button variant="contained" onClick={handleSubmit}>
              {editingPage ? 'Update' : 'Create'}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CmsPagesManager;
