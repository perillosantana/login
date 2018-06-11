import React, { Component } from 'react'
import { graphql } from 'react-apollo'

import { Button } from 'vtex.styleguide'
import LoginOptions from './components/LoginOptions'
import EmailVerification from './components/EmailVerification'
import CodeConfirmation from './components/CodeConfirmation'
import AccountOptions from './components/AccountOptions'
import ProfileIcon from './images/ProfileIcon'
import GET_USER_PROFILE from './queries/getProfile.gql'
import { injectIntl, intlShape } from 'react-intl'

import './global.css'

const GO_BACK = 'login.go-back'
const STEPS = [
  // eslint-disable-next-line
  (state, func) => {
    return (
      <LoginOptions
        page="login-options"
        titleLabel="login-options.title"
        options={['login-options.email-verification']}
        onStateChange={func}
      />
    )
  },
  // eslint-disable-next-line
  (state, func) => {
    return (
      <EmailVerification
        goBack={GO_BACK}
        send="login.send"
        next={2}
        previous={0}
        email={state.email}
        onStateChange={func}
      />
    )
  },
  // eslint-disable-next-line
  (state, func) => {
    return (
      <CodeConfirmation
        goBack={GO_BACK}
        confirm="login.confirm"
        titleLabel="login-email-code.title"
        next={3}
        previous={1}
        email={state.email}
        code={state.code}
        onStateChange={func}
      />
    )
  },
  (state, func) => {
    return (
      <AccountOptions welcome="login.welcome" />
    )
  },
]

/** Canonical login that calls a mutation to retrieve the authentication token */
class Login extends Component {
  static propTypes = {
    /** Intl object*/
    intl: intlShape
  }

  state = {
    isMouseOnButton: false,
    isMouseOnContent: false,
    step: 0,
    email: '',
    code: '',
  }

  handleUpdateState = state => {
    this.setState(state)
  }

  handleAccountContent = () => {
    this.setState({ step: 3 })
  }

  render() {
    const { isMouseOnButton, isMouseOnContent, step } = this.state
    const render = STEPS[step](this.state, this.handleUpdateState)
    const {
      data: { profile },
      intl: { formatMessage }
    } = this.props
    return (
      <div className="relative w-100 fr">
        <Button
          variation="tertiary"
          size="small"
          icon
          onMouseEnter={() => this.handleUpdateState({ isMouseOnButton: true })}
          onMouseLeave={() => this.handleUpdateState({ isMouseOnButton: false })}
        >
          {profile &&
            (<div className="f7"
              onMouseEnter={() => this.handleAccountContent()}>
              {formatMessage({ id: 'login.hello' })} {profile.firstName}
            </div>)
          }
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