export const AuthService = {
  RedirectLogout: ({ children }) => children({ action: () => {} }),

  LoginWithAccessKey: ({ children }) =>
    children({ state: { token: 'token' }, loading: true, action: () => {} }),

  LoginWithPassword: ({ children }) =>
    children({
      state: { email: 'email@vtex.com', password: 'password' },
      loading: true,
      action: () => {},
      validation: { validateEmail: () => true },
    }),

  SendAccessKey: ({ children }) =>
    children({
      state: { email: 'email@vtex.com' },
      loading: true,
      action: () => {},
      validation: { validateEmail: () => true },
    }),

  OAuthRedirect: ({ children }) =>
    children({ loading: true, action: () => {} }),

  SetPassword: ({ children }) =>
    children({
      state: { password: 'password', token: 'token' },
      loading: true,
      action: () => {},
      validation: { validatePassword: () => true },
    }),
}

export const AuthState = {
  Token: ({ children }) => children({ value: 'value', setValue: () => {} }),
  Password: ({ children }) => children({ value: 'value', setValue: () => {} }),
  Email: ({ children }) => children({ value: 'value', setValue: () => {} }),
}
