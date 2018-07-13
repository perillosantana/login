import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { injectIntl } from 'react-intl'

import LoginOptions from './components/LoginOptions'
import EmailVerification from './components/EmailVerification'
import EmailAndPassword from './components/EmailAndPassword'
import CodeConfirmation from './components/CodeConfirmation'
import AccountOptions from './components/AccountOptions'
import RecoveryPassword from './components/RecoveryPassword'
import { steps } from './utils/steps'
import { setCookie } from './utils/set-cookie'
import './global.css'

const STEPS = [
  /* eslint-disable react/display-name, react/prop-types */
  (props, state, func, isOptionsMenuDisplayed) => (
    <EmailVerification
      next={steps.CODE_CONFIRMATION}
      previous={steps.LOGIN_OPTIONS}
      isCreatePassword={state.isCreatePassword}
      title={props.accessCodeTitle}
      email={state.email}
      onStateChange={func}
      showBackButton={!isOptionsMenuDisplayed}
    />
  ),
  (props, state, func, isOptionsMenuDisplayed) => {
    return <EmailAndPassword
      next={steps.ACCOUNT_OPTIONS}
      previous={steps.LOGIN_OPTIONS}
      title={props.emailAndPasswordTitle}
      email={state.email}
      password={state.password}
      onStateChange={func}
      showBackButton={!isOptionsMenuDisplayed}
      loginCallback={props.loginCallback}
    />
  },
  (props, state, func) => (
    <CodeConfirmation
      next={steps.ACCOUNT_OPTIONS}
      previous={steps.EMAIL_VERIFICATION}
      email={state.email}
      code={state.code}
      onStateChange={func}
      loginCallback={props.loginCallback}
    />
  ),
  () => (
    <AccountOptions />
  ),
  (props, state, func) => (
    <RecoveryPassword
      next={steps.ACCOUNT_OPTIONS}
      previous={steps.EMAIL_PASSWORD}
      email={state.email}
      onStateChange={func}
      loginCallback={props.loginCallback}
    />
  ),
  /* eslint-enable react/display-name react/prop-types */
]

class LoginContent extends Component {
  static propTypes = {
    profile: PropTypes.shape({}),
    isInitialScreenOptionOnly: PropTypes.bool,
    initialStep: PropTypes.number,
    optionsTitle: PropTypes.string,
    emailAndPasswordTitle: PropTypes.string,
    accessCodeTitle: PropTypes.string,
    /** Function called after login success */
    loginCallback: PropTypes.func,
  }

  static defaultProps = {
    isInitialScreenOptionOnly: true,
  }

  componentDidMount() {
    if (location.href.indexOf('accountAuthCookieName') > 0) {
      setCookie(location.href)
    }
  }

  get shouldRenderLoginOptions() {
    const { isInitialScreenOptionOnly } = this.props
    const { isOnInitialScreen } = this.state

    return isInitialScreenOptionOnly
      ? isOnInitialScreen : true
  }

  get shouldRenderForm() {
    const { isInitialScreenOptionOnly } = this.props
    const { isOnInitialScreen } = this.state

    return !isInitialScreenOptionOnly || !isOnInitialScreen
  }

  state = {
    isOnInitialScreen: !this.props.profile,
    isCreatePassword: false,
    step: this.props.initialStep || 0,
    email: '',
    password: '',
    code: '',
  }

  handleUpdateState = state => {
    if (state.hasOwnProperty('step') && state.step === -1) {
      state.step = 0
      state.isOnInitialScreen = true
    }

    this.setState({
      ...state,
    })
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

  /**
   * Action after login success. If loginCallback isn't 
   * a prop, it will call a root page redirect as default.
  */
  onLoginSuccess = () => {
    const { loginCallback } = this.props
    return loginCallback ? loginCallback : location.replace("/")    
  }

  render() {
    const { profile, isInitialScreenOptionOnly, optionsTitle } = this.props
    const { isOnInitialScreen } = this.state

    const step = profile ? steps.ACCOUNT_OPTIONS : this.state.step

    const render = STEPS[step](
      { 
        loginCallback: this.onLoginSuccess, 
        ...this.props
      },
      this.state,
      this.handleUpdateState,
      this.shouldRenderLoginOptions
    )

    const className = classNames('vtex-login-content', {
      'vtex-login-content--initial-screen': isOnInitialScreen,
      'vtex-login-content--always-with-options': !isInitialScreenOptionOnly,
    })

    const formClassName = classNames('vtex-login-content__form', {
      [`vtex-login-content__form--step-${step}`]: step >= 0,
      'vtex-login-content__form--visible': this.shouldRenderForm,
    })

    return (
      <div className={className}>
        {!profile && this.shouldRenderLoginOptions && (
          <LoginOptions
            page="login-options"
            fallbackTitle="loginOptions.title"
            title={optionsTitle}
            options={['loginOptions.emailVerification', 'loginOptions.emailAndPassword']}
            currentStep={step === 0 ? 'loginOptions.emailVerification' : 'loginOptions.emailAndPassword'}
            isAlwaysShown={!isInitialScreenOptionOnly}
            onOptionsClick={this.handleOptionsClick}
          />
        )}
        <div className={formClassName}>
          {this.shouldRenderForm && render}
        </div>
      </div>
    )
  }
}

const LoginWithIntl = injectIntl(LoginContent)

LoginWithIntl.schema = {
  title: 'editor.login.title',
  type: 'object',
  properties: {
    isInitialScreenOptionOnly: {
      title: 'editor.login.isInitialScreenOptionOnly.title',
      type: 'boolean',
      default: true,
      isLayout: true,
    },
    initialStep: {
      title: 'editor.login.initialStep.title',
      type: 'number',
      default: 0,
      enum: [0, 1],
      enumNames: [
        'editor.login.initialStep.token',
        'editor.login.initialStep.emailAndPassword',
      ],
      widget: {
        'ui:widget': 'radio',
        'ui:options': {
          inline: true,
        },
      },
    },
    optionsTitle: {
      title: 'editor.login.optionsTitle.title',
      type: 'string',
    },
    emailAndPasswordTitle: {
      title: 'editor.login.emailAndPasswordTitle.title',
      type: 'string',
    },
    accessCodeTitle: {
      title: 'editor.login.accessCodeTitle.title',
      type: 'string',
    },
  },
}

export default LoginWithIntl

