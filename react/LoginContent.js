import React, { Component } from 'react'

import { compose } from 'ramda'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { graphql } from 'react-apollo'
import { injectIntl } from 'react-intl'
import { Transition } from 'react-spring'
import { withSession, withRuntimeContext } from 'render'

import LoginOptions from './components/LoginOptions'
import AccountOptions from './components/AccountOptions'
import EmailAndPassword from './components/EmailAndPassword'
import CodeConfirmation from './components/CodeConfirmation'
import RecoveryPassword from './components/RecoveryPassword'
import EmailVerification from './components/EmailVerification'

import { steps } from './utils/steps'
import { setCookie } from './utils/set-cookie'

import { LoginSchema } from './schema'
import { LoginPropTypes } from './propTypes'
import { getProfile } from './utils/profile'
import { Queries } from 'vtex.store'
import LOGIN_OPTIONS_QUERY from './queries/loginOptions.gql'

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
          email={state.email}
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
          email={state.email}
          password={state.password}
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
          email={state.email}
          accessCodePlaceholder={props.accessCodePlaceholder}
          code={state.code}
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
          email={state.email}
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

  static defaultProps = {
    isInitialScreenOptionOnly: true,
    defaultOption: 0,
    emailPlaceholder: '',
    passwordPlaceholder: '',
    accessCodePlaceholder: '',
    optionsTitle: '',
  }

  static contextTypes = {
    patchSession: PropTypes.func,
  }

  state = {
    isOnInitialScreen: !this.props.profile,
    isCreatePassword: false,
    step: this.props.defaultOption,
    email: '',
    password: '',
    code: '',
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

  get shouldRenderLoginOptions() {
    return this.props.isInitialScreenOptionOnly ? this.state.isOnInitialScreen : true
  }

  get shouldRenderForm() {
    if (this.props.profile) {
      return true
    }

    return !this.props.isInitialScreenOptionOnly || !this.state.isOnInitialScreen
  }

  handleUpdateState = state => {
    if (state.hasOwnProperty('step') && state.step === -1) {
      state.step = 0
      state.isOnInitialScreen = true
    }

    this.setState({ ...state })
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

  render() {
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

    const render = STEPS[step](
      {
        ...this.props,
        loginCallback: this.onLoginSuccess,
      },
      this.state,
      this.handleUpdateState,
      this.shouldRenderLoginOptions
    )

    const className = classNames('vtex-login-content flex relative bg-base justify-around overflow-hidden', {
      'vtex-login-content--initial-screen': this.state.isOnInitialScreen,
      'vtex-login-content--always-with-options flex-column-reverse items-center flex-row-ns items-baseline-ns':
        !isInitialScreenOptionOnly,
      'items-baseline': isInitialScreenOptionOnly,
    })

    const formClassName = classNames('vtex-login-content__form dn ph4', {
      [`vtex-login-content__form--step-${step}`]: step >= 0,
      'vtex-login-content__form--visible db': this.shouldRenderForm,
    })

    return (
      <div className={className}>
        <Transition
          keys={(!profile && this.shouldRenderLoginOptions && !loading) ? ['children'] : []}
          from={{ opacity: 0, transform: 'translateX(-50%)' }}
          enter={{ opacity: 1, transform: 'translateX(0%)' }}
          leave={{ display: 'none' }}
        >
          {(!profile && this.shouldRenderLoginOptions && !loading) ? [this.renderChildren] : []}
        </Transition>
        <div className={formClassName}>
          <Transition
            keys={this.shouldRenderForm && render ? ['children'] : []}
            from={{ opacity: 0, transform: 'translateX(50%)' }}
            enter={{ opacity: 1, transform: 'translateX(0%)' }}
            leave={{ display: 'none' }}
          >
            {this.shouldRenderForm && render ? [render] : []}
          </Transition>
        </div>
      </div>
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
  graphql(Queries.session, options),
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

