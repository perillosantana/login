import { Machine } from 'xstate'

const loginMachine = Machine({
  id: 'loginMachine',
  initial: 'unknown',
  states: {
    unknown: {
      on: {
        '': [
          { target: 'redirecting', cond: ctx => ctx && ctx.isUserLoggedIn },
          { target: 'identification.identified_user', cond: ctx => ctx && ctx.isUserIdentified },
          { target: 'identification' },
        ],
      },
    },
    identification: {
      id: 'identification',
      on: {
        TOKEN_PREFERENCE: 'token_login',
        PASSWORD_PREFERENCE: 'password_login',
        NEW_USER: {
          target: 'default_login',
          in: 'identification.unidentified_user',
        },
      },
      initial: 'unidentified_user',
      states: {
        'unidentified_user': {
          on: {},
        },
        'identified_user': {
          on: {
            NOT_ME: 'unidentified_user',
          },
        },
      },
    },
    'password_login': {
      on: {
        FORGOT_PASSWORD: 'default_login',
        LOGIN_SUCCESS: 'redirecting',
        BACK: 'identification',
      },
    },
    'token_login': {
      on: {
        SET_PASSWORD: 'default_login.set_password',
        LOGIN_SUCCESS: 'redirecting',
        BACK: 'identification',
      },
    },
    'default_login': {
      id: 'default_login',
      initial: 'token_confirmation',
      on: {
        CONTINUE: {
          target: 'redirecting',
        },
      },
      states: {
        'token_confirmation': {
          on: {
            TOKEN_CONFIRMED: 'set_password',
            CONTINUE: {
              actions: [],
            },
          },
        },
        'set_password': {
          on: {
            CHANGE_PASSWORD: 'password_changed',
          },
        },
        'password_changed': {},
      },
    },
    redirecting: {
      onEntry: ['redirect'],
    },
  },
})

export default loginMachine
