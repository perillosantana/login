import PropTypes from 'prop-types'

import PasswordLogin from './PasswordLogin'
import CodeConfirmation from './CodeConfirmation'
import TokenLogin from './TokenLogin'
import PasswordRecovery from './PasswordRecovery'
import EmailVerification from './EmailVerification'
import IdentifiedUser from './IdentifiedUser'
import ExternalProvidersMenu from './ExternalProvidersMenu'
import StateMachine from '../StateMachine.js'

import transitionsMapping from '../utils/transitionsMapping'
import {AuthState, AuthService} from 'vtex.react-vtexid'
import { withRuntimeContext } from 'vtex.render-runtime'

// TODO: REMOVE MOCK DATA
const USERSTORED = true
const USEREMAIL = 'anita@mailinator.com'
// const USEREMAIL = undefined
const USERPREFERSPASSWORD = true

const SignIn = ({profile, loginCallback}, {patchSession: ensureSessionExists}) => {
  const onLoginSuccess = (redirectCallback) => {
    return ensureSessionExists().then(loginCallback ? loginCallback : redirectCallback)
  }

  const allData = {
    userName: USEREMAIL,
    hasPasswordPreference: USERPREFERSPASSWORD,
  }

  //TODO: change this pls
  const queryStringReturnUrl = location.search.match(/[\\?&]returnUrl=([^&#]*)/)
  const returnUrl = queryStringReturnUrl ? queryStringReturnUrl[1] : '/'
  const isUserLoggedIn = !!profile

  const componentByState = {
    'identification.identified_user': (data, handlers) => <IdentifiedUser {...data} {...handlers} />,
    'identification.unidentified_user': (data, handlers) => <EmailVerification {...data} {...handlers} />,
    'password_login': (data, handlers) => <PasswordLogin {...data} {...handlers} />,
    'token_login': (data, handlers) => <TokenLogin {...data} {...handlers} />,
    'default_login.token_confirmation': (data, handlers) => <CodeConfirmation {...data} {...handlers} />,
    'default_login.set_password': (data, handlers) => <PasswordRecovery {...data} {...handlers} />,
    'default_login.password_changed': (data, handlers) => <PasswordChangeSuccess {...data} {...handlers} />,
    'redirecting': () => <p>Redirecting</p>,
  }

  return (
    <AuthState scope="store" email={USEREMAIL} returnUrl={returnUrl}>
      {() => (
        <AuthService.RedirectAfterLogin>
        {
          ({action: redirect}) => {
            return (
              <div className="vtex-login-content flex relative bg-base justify-around overflow-hidden">
                <div className="vtex-login-content__form--step-0">
                  <StateMachine
                    isUserIdentified={USERSTORED}
                    isUserLoggedIn={isUserLoggedIn}
                    transitionsMapping={transitionsMapping}
                    actions={{redirect: () => onLoginSuccess(redirect)}}
                  >
                    {
                      ({ state, transitionHandlers }) => {
                        const showExternalProviders = ['identification.identified_user', 'identification.unidentified_user', 'token_login', 'password_login'].includes(state)

                        return (
                          <React.Fragment>
                            {componentByState[state]({ ...allData, ...transitionHandlers })}
                            {showExternalProviders &&
                              <ExternalProvidersMenu/>
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

SignIn.propTypes = {
  profile: PropTypes.object,
  loginCallback: PropTypes.func,
}

SignIn.contextTypes = {
  patchSession: PropTypes.func,
}

export default withRuntimeContext(SignIn)