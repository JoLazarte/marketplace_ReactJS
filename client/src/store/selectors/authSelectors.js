// Selectores para el estado de autenticación
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectError = (state) => state.auth.error;
export const selectMessage = (state) => state.auth.message;

// Selectores para el formulario de registro
export const selectFormData = (state) => state.auth.formData;
export const selectErrors = (state) => state.auth.errors;
export const selectTouched = (state) => state.auth.touched; 