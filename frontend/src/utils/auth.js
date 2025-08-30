// Simple authentication utilities for demo app

// Token management
export const getToken = () => localStorage.getItem('token');
export const setToken = (token) => localStorage.setItem('token', token);
export const removeToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// User data management
export const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const setUser = (user) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
};

// Authentication check
export const isAuthenticated = () => !!getToken();

// Login and logout
export const login = (token, user) => {
  setToken(token);
  setUser(user);
};

export const logout = () => {
  removeToken();
  setUser(null);
};

// Initialize auth state on app start
export const initializeAuth = () => {
  return isAuthenticated();
};