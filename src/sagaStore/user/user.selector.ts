export const INITIAL_STATE = {
  currentUser: null,
  success: false,
  isLoading: false,
  error: null,
};

export const getCurrentUser = (profile: {
  user: { currentUser: string };
}): string => profile?.user.currentUser;

export const getCurrentError = (profile: { user: { error: string } }): string =>
  profile?.user.error;
