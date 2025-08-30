// Simple authentication utilities for demo app with cookie-based auth

// Token management (now handled by HTTP-only cookies)
// We can't access HTTP-only cookies from JavaScript, so we'll rely on the server
export const getToken = () => null; // No longer needed - cookies are handled automatically
export const setToken = () => null; // No longer needed - cookies are set by server
export const removeToken = () => {
  // Clear user data only - cookie will be cleared by server
  localStorage.removeItem('user');
};

// User data management (still using localStorage for user info)
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

// Authentication check - we'll need to verify with the server
export const isAuthenticated = () => {
  // We can't check the HTTP-only cookie directly
  // We'll rely on having user data and let API calls handle auth verification
  return !!getUser();
};

// Login and logout
export const login = (user) => {
  // Token is now set as HTTP-only cookie by the server
  setUser(user);
};

export const logout = () => {
  removeToken(); // This will clear user data
  setUser(null);
};

// Initialize auth state on app start
export const initializeAuth = () => {
  return isAuthenticated();
};

// Helper function to check if we should attempt to get user profile
export const shouldFetchProfile = () => {
  return !getUser(); // If we don't have user data, try to fetch it
};