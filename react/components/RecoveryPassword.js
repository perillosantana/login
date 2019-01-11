import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'

import { Input, Button } from 'vtex.styleguide'
import { AuthState, AuthService } from 'vtex.react-vtexid'

import { translate } from '../utils/translate'
import { isValidPassword } from '../utils/format-check'
import Form from './Form'
import FormError from './FormError'
import PasswordInput from './PasswordInput'

/** RecoveryPassword tab component. Receive a new password from an input
 * and call the recoveryPassword API.
 */
class RecoveryPassword extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isInvalidPassword: false,
      isPasswordsMatch: true,
      isUserBlocked: false,
      confirmPassword: '',
    }
  }

  handleConfirmPasswordChange = event => {
    this.setState({
      isPasswordsMatch: true,
      confirmPassword: event.target.value,
    })
  }

  handleFailure = err => {
    err.authStatus === 'BlockedUser'
      ? this.setState({ isUserBlocked: true })
      : console.error(err)
  }

  handleSkip = () => this.props.loginCallback()

  handleOnSubmit = (event, newPassword, setPassword) => {
    event.preventDefault()
    const { confirmPassword } = this.state
    if (!isValidPassword(newPassword)) {
      this.setState({ isInvalidPassword: true })
    } else if (newPassword !== confirmPassword) {
      this.setState({ isPasswordsMatch: false })
    } else {
      setPassword()
    }
  }

  render() {
    const {
      intl,
      passwordPlaceholder,
      showPasswordVerificationIntoTooltip,
    } = this.props

    const {
      isInvalidPassword,
      isUserBlocked,
      isPasswordsMatch,
    } = this.state

    return (
      <Form
        className="vtex-login__email-verification"
        title={translate('login.createPassword', intl)}
        onSubmit={e => this.handleOnSubmit(e)}
        content={
          <Fragment>
            <div className="vtex-login__input-container vtex-login__input-container--password">
              <AuthState.Password>
                {({ value, setValue }) => (
                  <PasswordInput
                    onStateChange={({ password }) => {
                      setValue(password)
                      this.setState({ isInvalidPassword: false })
                    }}
                    placeholder={passwordPlaceholder || translate('login.password.placeholder', intl)}
                    password={value || ''}
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
            <FormError show={isUserBlocked}>
              {translate('login.userBlocked', intl)}
            </FormError>
            <div className="vtex-login__input-container vtex-login__input-container--password">
              <Input
                type="password"
                onChange={this.handleConfirmPasswordChange}
                placeholder={translate('login.confirmPassword', intl)}
              />
            </div>
            <FormError show={!isPasswordsMatch}>
              {translate('login.invalidMatch', intl)}
            </FormError>
          </Fragment>
        }
        footer={
          <Fragment>
            <div className="vtex-login__send-button">
              <Button
                variation="primary"
                size="small"
                onClick={this.handleSkip}
              >
                <span className="t-small">
                  SKIP
                </span>
              </Button>
              <AuthService.SetPassword
                onSuccess={this.props.onPasswordSetSuccess}
                onFailure={this.handleFailure}
              >
                {({
                  state: { password },
                  loading,
                  action: setPassword,
                  validation: {
                    validatePassword,
                  },
                }) => (
                  <Button
                    variation="primary"
                    size="small"
                    type="submit"
                    onClick={e => this.handleOnSubmit(e, password, setPassword)}
                    isLoading={loading}
                    disabled={!validatePassword(password)}
                  >
                    <span className="t-small">
                      {translate('login.create', intl)}
                    </span>
                  </Button>
                )}
              </AuthService.SetPassword>
            </div>
          </Fragment>
        }
      />
    )
  }
}

RecoveryPassword.propTypes = {
  /** Set the type of password verification ui */
  showPasswordVerificationIntoTooltip: PropTypes.bool,
  /** Function to change de active tab */
  intl: intlShape,
  /** Placeholder to password input */
  passwordPlaceholder: PropTypes.string,
  /** Function called after login success */
  loginCallback: PropTypes.func,
  onPasswordSetSuccess: PropTypes.func,
}

export default injectIntl(RecoveryPassword)
