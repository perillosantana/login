import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'

import { Button } from 'vtex.styleguide'
import { AuthState, AuthService } from 'vtex.react-vtexid'

import { translate } from '../utils/translate'
import { isValidEmail, isValidPassword } from '../utils/format-check'
import Form from './Form'
import FormError from './FormError'
import PasswordInput from './PasswordInput'
import GoBackButton from './GoBackButton'

/** EmailAndPasswordLogin component. */
class PasswordLogin extends Component {
  static propTypes = {
    /** Set the type of password verification ui */
    showPasswordVerificationIntoTooltip: PropTypes.bool,
    /** Title to be displayed */
    // TODO: make this customizable
    title: PropTypes.string,
    /** Placeholder to password input */
    passwordPlaceholder: PropTypes.string,
    /** Intl object*/
    intl: intlShape,
    /** Function called after login success */
    onLoginSuccess: PropTypes.func,
    onBack: PropTypes.func.isRequired,
    onForgotPassword: PropTypes.func.isRequired,
  }

  state = {
    isInvalidEmail: false,
    isInvalidPassword: false,
    isWrongCredentials: false,
    isUserBlocked: false,
  }

  handleForgotPassword = (event, sendToken) => {
    event.preventDefault()
    sendToken()
  }

  handleSuccess = () => {
    this.props.onLoginSuccess()
  }

  handleFailure = err => {
    err.authStatus === 'WrongCredentials'
      ? this.setState({ isWrongCredentials: true })
      : err.authStatus === 'BlockedUser'
        ? this.setState({ isUserBlocked: true })
        : console.error(err)
  }

  handleOnSubmit = (email, password, login) => {
    if (!isValidEmail(email)) {
      this.setState({ isInvalidEmail: true })
    } else if (!isValidPassword(password)) {
      this.setState({ isInvalidPassword: true })
    } else {
      login()
    }
  }

  render() {
    const {
      title,
      intl,
      passwordPlaceholder,
      showPasswordVerificationIntoTooltip,
    } = this.props

    const {
      isInvalidEmail,
      isInvalidPassword,
      isWrongCredentials,
      isUserBlocked,
    } = this.state

    return (
      <Form
        className="vtex-login__email-verification"
        title={title || translate('loginOptions.emailAndPassword', intl)}
        onSubmit={e => this.handleOnSubmit(e)}
        content={
          <Fragment>
            <div className="vtex-login__input-container vtex-login__input-container--email">
              <AuthState.Email>
                {({ value }) => (
                  <div>
                    Hello, {value}
                  </div>
                )}
              </AuthState.Email>
            </div>
            <FormError show={isInvalidEmail}>
              {translate('login.invalidEmail', intl)}
            </FormError>
            <div className="vtex-login__input-container vtex-login__input-container--password flex flex-column">
              <AuthState.Password>
                {({ value, setValue }) => (
                  <PasswordInput
                    password={value || ''}
                    onStateChange={({ password }) => {
                      setValue(password)
                    }}
                    placeholder={
                      passwordPlaceholder ||
                      translate('login.password.placeholder', intl)
                    }
                    showPasswordVerificationIntoTooltip={
                      showPasswordVerificationIntoTooltip
                    }
                  />
                )}
              </AuthState.Password>
            </div>
            <FormError show={isInvalidPassword}>
              {translate('login.invalidPassword', intl)}
            </FormError>
            <FormError show={isWrongCredentials}>
              {translate('login.wrongCredentials', intl)}
            </FormError>
            <FormError show={isUserBlocked}>
              {translate('login.userBlocked', intl)}
            </FormError>
            <div className="vtex-login__form-link-container flex justify-end ph0 pv2">
              <AuthService.SendAccessKey
                useNewSession
                onSuccess={this.props.onForgotPassword}
                onFailure={() => {
                  this.setState({ isUserBlocked: true })
                }}
              >
                {({
                  action: sendToken,
                }) => (
                  <a
                    href=""
                    className="link dim c-link"
                    onClick={(event) => this.handleForgotPassword(event, sendToken)}
                  >
                    <span className="t-small">
                      {translate('login.forgotPassword', intl)}
                    </span>
                  </a>
                )}
              </AuthService.SendAccessKey>
            </div>
          </Fragment>
        }
        footer={
          <Fragment>
            <GoBackButton
              onClick={this.props.onBack}
            />
            <div className="vtex-login__send-button">
              <AuthService.LoginWithPassword
                useNewSession
                onSuccess={this.handleSuccess}
                onFailure={this.handleFailure}
              >
                {({
                  state: { email, password },
                  loading,
                  action: loginWithPassword,
                  validation: { validateEmail },
                }) => (
                  <Button
                    variation="primary"
                    size="small"
                    type="submit"
                    onClick={e => {
                      e.preventDefault()
                      this.handleOnSubmit(email, password, loginWithPassword)
                    }}
                    isLoading={loading}
                    disabled={!validateEmail(email)}
                  >
                    <span className="t-small">
                      {translate('login.signIn', intl)}
                    </span>
                  </Button>
                )}
              </AuthService.LoginWithPassword>
            </div>
          </Fragment>
        }
      />
    )
  }
}

export default injectIntl(PasswordLogin)
