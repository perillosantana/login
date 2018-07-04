import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { Button } from 'vtex.styleguide'
import { injectIntl, intlShape } from 'react-intl'

import LoginOptions from './components/LoginOptions'
import EmailVerification from './components/EmailVerification'
import EmailAndPassword from './components/EmailAndPassword'
import CodeConfirmation from './components/CodeConfirmation'
import AccountOptions from './components/AccountOptions'
import RecoveryPassword from './components/RecoveryPassword'

import { truncateString } from './utils/truncate-string'
import ProfileIcon from './images/ProfileIcon'
import GET_USER_PROFILE from './queries/profile.gql'
import { translate } from './utils/translate'
import { steps } from './utils/steps'
import './global.css'

const STEPS = [
  // eslint-disable-next-line
  (state, func) => {
    return (
      <LoginOptions
        page="login-options"
        titleLabel="loginOptions.title"
        options={['loginOptions.emailVerification', 'loginOptions.emailAndPassword']}
        onStateChange={func}
      />
    )
  },
  // eslint-disable-next-line
  (state, func) => {
    return (
      <EmailVerification
        next={steps.CODE_CONFIRMATION}
        previous={steps.LOGIN_OPTIONS}
        isCreatePassword={state.isCreatePassword}
        email={state.email}
        onStateChange={func}
      />
    )
  },
  // eslint-disable-next-line
  (state, func) => {
    return (
      <EmailAndPassword
        next={steps.ACCOUNT_OPTIONS}
        previous={steps.LOGIN_OPTIONS}
        email={state.email}
        password={state.password}
        onStateChange={func}
      />
    )
  },
  // eslint-disable-next-line
  (state, func) => {
    return (
      <CodeConfirmation
        next={steps.ACCOUNT_OPTIONS}
        previous={steps.EMAIL_VERIFICATION}
        email={state.email}
        code={state.code}
        onStateChange={func}
      />
    )
  },

  // eslint-disable-next-line
  (state, func) => {
    return (
      <AccountOptions />
    )
  },
  // eslint-disable-next-line
  (state, func) => {
    return (
      <RecoveryPassword
        next={steps.ACCOUNT_OPTIONS}
        previous={steps.EMAIL_PASSWORD}
        email={state.email}
        onStateChange={func}
      />
    )
  },
]

/** Canonical login that calls a mutation to retrieve the authentication token */
class Login extends Component {
  static propTypes = {
    /** Intl object*/
    intl: intlShape,
  }

  state = {
    isMouseOnButton: false,
    isMouseOnContent: false,
    isCreatePassword: false,
    step: 0,
    email: '',
    password: '',
    code: '',
  }

  handleUpdateState = state => {
    this.setState(state)
  }

  render() {
    const { data: { profile }, intl } = this.props

    const { isMouseOnButton, isMouseOnContent } = this.state

    const step = profile ? steps.ACCOUNT_OPTIONS : this.state.step
    const render = STEPS[step](this.state, this.handleUpdateState)

    return (
      <div className="vtex-login__container flex items-center relative f6 fr">
        {profile &&
          (<div>
            {translate('login.hello', intl)} {profile.firstName || truncateString(profile.email)}
          </div>)
        }
        <Button
          variation="tertiary"
          size="small"
          icon
          onMouseEnter={() => this.handleUpdateState({ isMouseOnButton: true })}
          onMouseLeave={() => this.handleUpdateState({ isMouseOnButton: false })}
        >
          <ProfileIcon />
        </Button>
        {(isMouseOnContent || isMouseOnButton) && (
          <div
            className="vtex-login__box absolute right-0 z-max flex flex-colunm"
            onMouseEnter={() => this.handleUpdateState({ isMouseOnContent: true })}
            onMouseLeave={() => this.handleUpdateState({ isMouseOnContent: false })}
          >
            <div className="vtex-login__arrow-up absolute top-0 right-0 shadow-3" />
            <div className="shadow-3 mt3">
              <div className="vtex-login__content pa4 flex items-center justify-center relative bg-white">
                {render}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}

const options = {
  options: () => ({
    ssr: false,
  }),
}
export default injectIntl(
  graphql(GET_USER_PROFILE, options)(Login)
)
