import React, { Component } from 'react'

import { compose } from 'ramda'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { graphql } from 'react-apollo'
import { injectIntl } from 'react-intl'
import { Transition } from 'react-spring'

import { withSession, withRuntimeContext } from 'vtex.render-runtime'
import StateMachine from './StateMachine'

import LoginOptions from './components/LoginOptions'
import AccountOptions from './components/AccountOptions'
import PasswordLogin from './components/PasswordLogin'
import CodeConfirmation from './components/CodeConfirmation'
import RecoveryPassword from './components/RecoveryPassword'
import EmailVerification from './components/EmailVerification'

import { steps } from './utils/steps'
import { setCookie } from './utils/set-cookie'

import { LoginSchema } from './schema'
import { LoginPropTypes } from './propTypes'
import { getProfile } from './utils/profile'
import { session } from 'vtex.store-resources/Queries'
import LOGIN_OPTIONS_QUERY from './queries/loginOptions.gql'
import { AuthState } from 'vtex.react-vtexid'

import './global.css'

const STEPS = [
  /* eslint-disable react/display-name, react/prop-types */
  (props, state, func, isOptionsMenuDisplayed) => {
    return style => (
      <div style={style}>
        <EmailVerification
          next={steps.CODE_CONFIRMATION}
          previous={steps.LOGIN_OPTIONS}
          isCreatePassword={state.isCreatePassword}
          title={props.accessCodeTitle}
          emailPlaceholder={props.emailPlaceholder}
          onStateChange={func}
          showBackButton={!isOptionsMenuDisplayed}
        />
      </div>
    )
  },
  (props, state, func, isOptionsMenuDisplayed) => {
    return style => (
      <div style={style}>
        <EmailAndPassword
          next={steps.ACCOUNT_OPTIONS}
          previous={steps.LOGIN_OPTIONS}
          title={props.emailAndPasswordTitle}
          emailPlaceholder={props.emailPlaceholder}
          passwordPlaceholder={props.passwordPlaceholder}
          showPasswordVerificationIntoTooltip={props.showPasswordVerificationIntoTooltip}
          onStateChange={func}
          showBackButton={!isOptionsMenuDisplayed}
          loginCallback={props.loginCallback}
        />
      </div>
    )
  },
  (props, state, func) => {
    return style => (
      <div style={style}>
        <CodeConfirmation
          next={steps.ACCOUNT_OPTIONS}
          previous={steps.EMAIL_VERIFICATION}
          accessCodePlaceholder={props.accessCodePlaceholder}
          onStateChange={func}
          loginCallback={props.loginCallback}
        />
      </div>
    )
  },
  () => {
    return style => (
      <div style={style}>
        <AccountOptions />
      </div>
    )
  },
  (props, state, func) => {
    return style => (
      <div style={style}>
        <RecoveryPassword
          next={steps.ACCOUNT_OPTIONS}
          previous={steps.EMAIL_PASSWORD}
          passwordPlaceholder={props.passwordPlaceholder}
          showPasswordVerificationIntoTooltip={props.showPasswordVerificationIntoTooltip}
          accessCodePlaceholder={props.accessCodePlaceholder}
          onStateChange={func}
          loginCallback={props.loginCallback}
        />
      </div>
    )
  },
  /* eslint-enable react/display-name react/prop-types */
]

class LoginContent extends Component {
  static propTypes = {
    /** User profile information */
    profile: PropTypes.shape({}),
    /** Which screen option will renderize  */
    isInitialScreenOptionOnly: PropTypes.bool,
    /** Step that will be render first */
    defaultOption: PropTypes.number,
    /** Function called after login success */
    loginCallback: PropTypes.func,
    /** Runtime context. */
    runtime: PropTypes.shape({
      navigate: PropTypes.func,
    }),
    /* Reused props */
    optionsTitle: LoginPropTypes.optionsTitle,
    emailAndPasswordTitle: LoginPropTypes.emailAndPasswordTitle,
    accessCodeTitle: LoginPropTypes.accessCodePlaceholder,
    emailPlaceholder: LoginPropTypes.emailPlaceholder,
    passwordPlaceholder: LoginPropTypes.passwordPlaceholder,
    accessCodePlaceholder: LoginPropTypes.accessCodePlaceholder,
    showPasswordVerificationIntoTooltip: LoginPropTypes.showPasswordVerificationIntoTooltip,
  }

  constructor(props) {
    super(props)
    this.state = {
      returnUrl: '/',
    }
  }

  static contextTypes = {
    patchSession: PropTypes.func,
  }

  componentDidMount() {
    if (location.href.indexOf('accountAuthCookieName') > 0) {
      setCookie(location.href)
    }
    if (location.search) {
      this.setState({ returnUrl: location.search.substring(11) })
    }
  }

  handleOptionsClick = option => {
    let nextStep

    if (option === 'loginOptions.emailVerification') {
      nextStep = 0
    } else if (option === 'loginOptions.emailAndPassword') {
      nextStep = 1
    }

    this.setState({
      step: nextStep,
      isOnInitialScreen: false,
      isCreatePassword: false,
    })
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

  renderChildren = style => {
    const {
      profile,
      isInitialScreenOptionOnly,
      optionsTitle,
      defaultOption,
      data: { loginOptions },
    } = this.props
    const { isOnInitialScreen } = this.state

    let step = this.state.step
    if (profile) {
      step = steps.ACCOUNT_OPTIONS
    } else if (isOnInitialScreen) {
      step = defaultOption
    }

    return (
      <div style={style}>
        <LoginOptions
          page="login-options"
          fallbackTitle="loginOptions.title"
          title={optionsTitle}
          options={loginOptions}
          currentStep={step === 0 ? 'loginOptions.emailVerification' : 'loginOptions.emailAndPassword'}
          isAlwaysShown={!isInitialScreenOptionOnly}
          onOptionsClick={this.handleOptionsClick}
          refetchOptions={this.refetchOptions}
        />
      </div>
    )
  }

  render = () => {
    const {
      profile,
      isInitialScreenOptionOnly,
      defaultOption,
      data: { loading },
      session,
    } = this.props
    const { isOnInitialScreen } = this.state

    // Check if the user is already logged and redirect to the return URL if it didn't receive
    // the profile by the props and current endpoint are /login, if receive it, should render the account options.
    if (getProfile(session) && !profile) {
      if (location.pathname.includes('/login')) {
        this.redirect()
      }
    }

    let step = this.state.step
    if (profile) {
      step = steps.ACCOUNT_OPTIONS
    } else if (isOnInitialScreen) {
      step = defaultOption
    }

    const className = classNames('vtex-login-content flex relative bg-base justify-around overflow-hidden', {
      'vtex-login-content--initial-screen': this.state.isOnInitialScreen,
      'vtex-login-content--always-with-options flex-column-reverse items-center flex-row-ns items-baseline-ns':
        !isInitialScreenOptionOnly,
      'items-baseline': isInitialScreenOptionOnly,
    })
    return (
      <AuthState scope="store">
      {() => (
        <div className={className}>
          <div className="vtex-login-content__form--step-0">
            <StateMachine>
              {
                ({ sendEvent, state }) => {
                  if (state.matches('identification.unidentified_user')) {
                    return (
                      <EmailVerification
                        title={this.props.accessCodeTitle}
                        emailPlaceholder={this.props.emailPlaceholder}
                        onPasswordPreference={() => sendEvent('PASSWORD_PREFERENCE')}
                        onTokenPreference={() => sendEvent('TOKEN_PREFERENCE')}
                      />
                    )
                  }
                  if (state.matches('password_login')) {
                    return (
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
                    )
                  }
                  if (state.matches('default_login.token_confirmation')) {
                    return (
                      <CodeConfirmation
                        accessCodePlaceholder={this.props.accessCodePlaceholder}
                        loginCallback={this.onLoginSuccess}
                        onSuccess={() => sendEvent('TOKEN_CONFIRMED')}
                      />
                    )
                  }
                  if (state.matches('default_login.set_password')) {
                    return (
                      <RecoveryPassword
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
                      <div>
                        Congrats password changed
                        <br />
                        <button onClick={this.onLoginSuccess}>continue</button>
                      </div>
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

