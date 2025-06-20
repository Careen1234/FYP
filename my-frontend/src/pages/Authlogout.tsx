import axios from 'axios';

export const logout = async () => {
  try {
    await axios.post('/api/logout', {}, { withCredentials: true });
    localStorage.removeItem('role'); // clear role if stored
    return true;
  } catch (error) {
    console.error('Logout failed', error);
    return false;
  }
};
