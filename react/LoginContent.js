import React, { Component } from 'react'

import { compose } from 'ramda'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import { injectIntl } from 'react-intl'

// import { Transition } from 'react-spring'
import { withSession, withRuntimeContext } from 'vtex.render-runtime'
import StateMachine from './StateMachine'

import PasswordLogin from './components/PasswordLogin'
import CodeConfirmation from './components/CodeConfirmation'
import TokenLogin from './components/TokenLogin'
import PasswordRecovery from './components/PasswordRecovery'
import EmailVerification from './components/EmailVerification'
import AccountOptions from './components/AccountOptions'
import ExternalProvidersMenu from './components/ExternalProvidersMenu'

import { setCookie } from './utils/set-cookie'

import { LoginSchema } from './schema'
import { LoginPropTypes } from './propTypes'
import { getProfile } from './utils/profile'
import { session } from 'vtex.store-resources/Queries'
import LOGIN_OPTIONS_QUERY from './queries/loginOptions.gql'
import { AuthState } from 'vtex.react-vtexid'

import './global.css'
import IdentifiedUser from './components/IdentifiedUser'
import PasswordChangeSuccess from './components/PasswordChangeSuccess';

// TODO: REMOVE MOCK DATA
const USERSTORED = true
const USEREMAIL = 'anita@mailinator.com'
// const USEREMAIL = undefined
const USERPREFERSPASSWORD = true

class LoginContent extends Component {
  static propTypes = {
    /** User profile information */
    profile: PropTypes.shape({}),
    /** Function called after login success */
    loginCallback: PropTypes.func,
    /** Runtime context. */
    runtime: PropTypes.shape({
      navigate: PropTypes.func,
    }),
    /* Reused props */
    emailAndPasswordTitle: LoginPropTypes.emailAndPasswordTitle,
    accessCodeTitle: LoginPropTypes.accessCodePlaceholder,
    emailPlaceholder: LoginPropTypes.emailPlaceholder,
    passwordPlaceholder: LoginPropTypes.passwordPlaceholder,
    accessCodePlaceholder: LoginPropTypes.accessCodePlaceholder,
    showPasswordVerificationIntoTooltip: LoginPropTypes.showPasswordVerificationIntoTooltip,
  }

  static contextTypes = {
    patchSession: PropTypes.func,
  }

  state = {
    returnUrl: '/',
  }

  componentDidMount() {
    if (location.href.indexOf('accountAuthCookieName') > 0) {
      setCookie(location.href)
    }
    if (location.search) {
      this.setState({ returnUrl: location.search.substring(11) })
    }
  }

  redirect = () => {
    this.props.runtime.navigate({
      to: this.state.returnUrl,
      fallbackToWindowLocation: true,
    })
  }

  /**
   * Action after login success. If loginCallback isn't
   * a prop, it will call a root page redirect as default.
  */
  onLoginSuccess = () => {
    const { loginCallback } = this.props
    return this.context.patchSession().then(() => {
      if (loginCallback) {
        loginCallback()
      } else {
        location.assign(this.state.returnUrl)
      }
    })
  }

  refetchOptions = () => {
    const { data: query } = this.props
    if (!query.loading && !query.loginOptions) {
      return query.refetch()
    }
    if (query.loginOptions) {
      return Promise.resolve()
    }
  }

  render = () => {
    const {
      profile,
      data: { loading },
      session,
    } = this.props

    // Check if the user is already logged and redirect to the return URL if it didn't receive
    // the profile by the props and current endpoint are /login,
    // if receive it, should render the account options.
    if (getProfile(session) && !profile) {
      if (location.pathname.includes('/login')) {
        this.redirect()
      }
    }

    if (profile) {
      return (
        <div className="vtex-login-content flex relative bg-base justify-around overflow-hidden">
          <div className="vtex-login-content__form--step-0">
            <AccountOptions />
          </div>
        </div>
      )
    }

    // const className = classNames('vtex-login-content flex relative bg-base justify-around overflow-hidden', {
    //   'vtex-login-content--initial-screen': this.state.isOnInitialScreen,
    //   'vtex-login-content--always-with-options flex-column-reverse items-center flex-row-ns items-baseline-ns':
    //     !isInitialScreenOptionOnly,
    //   'items-baseline': isInitialScreenOptionOnly,
    // })
    return (

      <AuthState scope="store" email={USEREMAIL}>
      {() => (
        <div className="vtex-login-content flex relative bg-base justify-around overflow-hidden">
          <div className="vtex-login-content__form--step-0">
            <StateMachine userStored={USERSTORED}>
              {
                ({ sendEvent, state }) => {
                  if (state.matches('identification.unidentified_user')) {
                    return (
                      <React.Fragment>
                        <EmailVerification
                          title={this.props.accessCodeTitle}
                          emailPlaceholder={this.props.emailPlaceholder}
                          onPasswordPreference={() => sendEvent('PASSWORD_PREFERENCE')}
                          onTokenPreference={() => sendEvent('TOKEN_PREFERENCE')}
                        />
                        <ExternalProvidersMenu
                          options={this.props.data.loginOptions}
                          refetchOptions={this.refetchOptions}
                        />
                      </React.Fragment>
                    )
                  }
                  if (state.matches('identification.identified_user')) {
                    return (
                      <React.Fragment>
                        <IdentifiedUser
                          onSuccess={() => {
                            USERPREFERSPASSWORD ? sendEvent('PASSWORD_PREFERENCE') : sendEvent('TOKEN_PREFERENCE')
                          }}
                          onSwitchUser={() => sendEvent('NOT_ME')}
                          userName={USEREMAIL}
                        />
                        <ExternalProvidersMenu
                          options={this.props.data.loginOptions}
                          refetchOptions={this.refetchOptions}
                        />
                      </React.Fragment>
                    )
                  }
                  if (state.matches('password_login')) {
                    return (
                      <React.Fragment>
                        <PasswordLogin
                          title={this.props.emailAndPasswordTitle}
                          emailPlaceholder={this.props.emailPlaceholder}
                          passwordPlaceholder={this.props.passwordPlaceholder}
                          showPasswordVerificationIntoTooltip={this.props.showPasswordVerificationIntoTooltip}
                          loginCallback={this.onLoginSuccess}
                          onSuccess={() => sendEvent('LOGIN_SUCCESS')}
                          onForgotPassword={() => sendEvent('FORGOT_PASSWORD')}
                          onClickBack={() => sendEvent('BACK')}
                        />
                        <ExternalProvidersMenu
                          options={this.props.data.loginOptions}
                          refetchOptions={this.refetchOptions}
                        />
                      </React.Fragment>
                    )
                  }
                  if (state.matches('token_login')) {
                    return (
                      <React.Fragment>
                        <TokenLogin
                          accessCodePlaceholder={this.props.accessCodePlaceholder}
                          onSuccess={() => {
                            sendEvent('LOGIN_SUCESS')
                            this.onLoginSuccess()
                          }}
                          onClickBack={() => sendEvent('BACK')}
                          onAddPassword={() => sendEvent('SET_PASSWORD')}
                        />
                        <ExternalProvidersMenu
                          options={this.props.data.loginOptions}
                          refetchOptions={this.refetchOptions}
                        />
                      </React.Fragment>
                    )
                  }
                  if (state.matches('default_login.token_confirmation')) {
                    return (
                      <CodeConfirmation
                        accessCodePlaceholder={this.props.accessCodePlaceholder}
                        onSuccess={() => sendEvent('TOKEN_CONFIRMED')}
                      />
                    )
                  }
                  if (state.matches('default_login.set_password')) {
                    return (
                      <PasswordRecovery
                        passwordPlaceholder={this.props.passwordPlaceholder}
                        showPasswordVerificationIntoTooltip={this.props.showPasswordVerificationIntoTooltip}
                        accessCodePlaceholder={this.props.accessCodePlaceholder}
                        onPasswordSetSuccess={() => sendEvent('CHANGE_PASSWORD')}
                        loginCallback={this.onLoginSuccess}
                      />
                    )
                  }
                  if (state.matches('default_login.password_changed')) {
                    return (
                      <PasswordChangeSuccess
                        onContinue={() => {
                          sendEvent('CONTINUE')
                          this.onLoginSuccess()
                        }}
                      />
                    )
                  }
                }
              }
            </StateMachine>
          </div>
        </div>
      )}
      </AuthState>

    )
  }
}

const options = {
  name: 'session',
  options: () => ({ ssr: false }),
}

const content = withSession()(compose(
  injectIntl,
  graphql(LOGIN_OPTIONS_QUERY),
  graphql(session, options),
)(LoginContent))

content.schema = {
  title: 'editor.loginPage.title',
  type: 'object',
  properties: {
    isInitialScreenOptionOnly: {
      title: 'editor.login.isInitialScreenOptionOnly.title',
      type: 'boolean',
      default: true,
      isLayout: true,
    },
    defaultOption: {
      title: 'editor.login.defaultOption.title',
      type: 'number',
      default: 0,
      isLayout: true,
      enum: [0, 1],
      enumNames: [
        'editor.login.defaultOption.token',
        'editor.login.defaultOption.emailAndPassword',
      ],
      widget: {
        'ui:widget': 'radio',
        'ui:options': {
          inline: true,
        },
      },
    },
    ...LoginSchema,
  },
}

export default withRuntimeContext(content)

