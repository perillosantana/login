import { Component } from 'react'

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

export class AuthState extends Component {
  static Token = ({ children }) =>
    children({ value: 'value', setValue: () => {} })
  static Password = ({ children }) =>
    children({ value: 'value', setValue: () => {} })
  static Email = ({ children }) =>
    children({ value: 'value', setValue: () => {} })

  render() {
    const { children } = this.props
    return children()
  }
}
