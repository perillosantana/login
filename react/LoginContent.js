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
import { AuthState, AuthService } from 'vtex.react-vtexid'

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

  onLoginSuccess = (redirectCallback) => {
    const { loginCallback } = this.props
    const ensureSessionExists = this.context.patchSession

    return ensureSessionExists().then(loginCallback ? loginCallback : redirectCallback)
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
    'redirecting': () => <p>Redirecting</p>,
  }

  render = () => {
    const {
      profile,
      session,
    } = this.props

    // Redirect the user to the returnURL if they are logged in and no "profile" props was passed and the user is at "/login"
    // Otherwise just render account options

    const isEmbeddedAndLogged = !!profile
    const isLoggedIn = getProfile(session)

    if (isEmbeddedAndLogged) {
      return (
        <div className="vtex-login-content flex relative bg-base justify-around overflow-hidden">
          <div className="vtex-login-content__form--step-0">
            <AccountOptions />
          </div>
        </div>
      )
    }

    const allData = {
      ...this.props,
      userName: USEREMAIL,
      hasPasswordPreference: USERPREFERSPASSWORD,
    }

    return (

      <AuthState scope="store" email={USEREMAIL} returnUrl={this.state.returnUrl}>
      {() => (
        <AuthService.RedirectAfterLogin>
        {
          ({action: redirect}) => {
            return (
              <div className="vtex-login-content flex relative bg-base justify-around overflow-hidden">
                <div className="vtex-login-content__form--step-0">
                  <StateMachine
                    isUserIdentified={USERSTORED}
                    isUserLoggedIn={isLoggedIn}
                    transitionsMapping={transitionsMapping}
                    actions={{redirect: () => this.onLoginSuccess(redirect)}}
                  >
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
            )
          }
        }
        </AuthService.RedirectAfterLogin>
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
  properties: LoginSchema,
}

export default withRuntimeContext(content)

