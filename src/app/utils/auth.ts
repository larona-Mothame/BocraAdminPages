

export const isAuthenticated = (): boolean => {
  return localStorage.getItem("bocra_auth_token") !== null;
};

export const getLoggedInUser = () => {
  const user = localStorage.getItem("bocra_user");
  return user ? JSON.parse(user) : null;
};

// Add this function to store user info and token
export const setAuthUser = (user: Record<string, any>, token: string) => {
  localStorage.setItem("bocra_user", JSON.stringify(user));
  localStorage.setItem("bocra_auth_token", token);
};

// Optional: clear user data
export const logoutUser = () => {
  localStorage.removeItem("bocra_user");
  localStorage.removeItem("bocra_auth_token");
};


// Get only the currently logged-in user's info (alias for getLoggedInUser)
export const getAuthUser = (): Record<string, any> | null => {
  return getLoggedInUser();
};