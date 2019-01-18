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
import transitionsMapping from './utils/transitionsMapping'

import { LoginSchema } from './schema'
import { LoginPropTypes } from './propTypes'
import { getProfile } from './utils/profile'
import { session } from 'vtex.store-resources/Queries'
import LOGIN_OPTIONS_QUERY from './queries/loginOptions.gql'
import { AuthState } from 'vtex.react-vtexid'

import './global.css'
import IdentifiedUser from './components/IdentifiedUser'
import PasswordChangeSuccess from './components/PasswordChangeSuccess'

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

  componentByState = {
    'identification.identified_user': (data, handlers) => <IdentifiedUser {...data} {...handlers} />,
    'identification.unidentified_user': (data, handlers) => <EmailVerification {...data} {...handlers} />,
    'password_login': (data, handlers) => <PasswordLogin {...data} {...handlers} />,
    'token_login': (data, handlers) => <TokenLogin {...data} {...handlers} />,
    'default_login.token_confirmation': (data, handlers) => <CodeConfirmation {...data} {...handlers} />,
    'default_login.set_password': (data, handlers) => <PasswordRecovery {...data} {...handlers} />,
    'default_login.password_changed': (data, handlers) => <PasswordChangeSuccess {...data} {...handlers} />,
    'redirecting': null,
  }

  render = () => {
    const {
      profile,
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

    const allData = {
      ...this.props,
      loginCallback: this.onLoginSuccess,
      userName: USEREMAIL,
      hasPasswordPreference: USERPREFERSPASSWORD,
    }

    return (

      <AuthState scope="store" email={USEREMAIL}>
      {() => (
        <div className="vtex-login-content flex relative bg-base justify-around overflow-hidden">
          <div className="vtex-login-content__form--step-0">
            <StateMachine isUserIdentified={USERSTORED} transitionsMapping={transitionsMapping}>
              {
                ({ state, transitionHandlers }) => {
                  const showExternalProviders = ['identification.identified_user', 'identification.unidentified_user', 'token_login', 'password_login'].includes(state)

                  return (
                    <React.Fragment>
                      {this.componentByState[state]({ ...allData, ...transitionHandlers })}
                      {showExternalProviders &&
                        <ExternalProvidersMenu
                          options={this.props.data.loginOptions}
                          refetchOptions={this.refetchOptions}
                        />
                      }
                    </React.Fragment>
                  )
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

