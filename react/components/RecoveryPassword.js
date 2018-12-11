import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Input, Button, IconArrowBack } from 'vtex.styleguide'
import { injectIntl, intlShape } from 'react-intl'

import { translate } from '../utils/translate'
import { isValidPassword, isValidAccessCode } from '../utils/format-check'
import Form from './Form'
import FormError from './FormError'
import PasswordInput from './PasswordInput'

import { AuthState, AuthService } from 'vtex.auth'

/** RecoveryPassword tab component. Receive a code and new password from an input
 * and call the recoveryPassword API.
 */
class RecoveryPassword extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isInvalidPassword: false,
      isPasswordsMatch: true,
      isInvalidCode: false,
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

  handleSuccess = () => {
    const { onStateChange, next } = this.props
    onStateChange({ step: next })
    this.props.loginCallback()
  }

  handleFailure = err => {
    err.authStatus === 'BlockedUser'
      ? this.setState({ isUserBlocked: true })
      : console.error(err)
  }

  handleOnSubmit = (event, newPassword, token, setPassword) => {
    event.preventDefault()
    const { confirmPassword } = this.state
    if (!isValidAccessCode(token)) {
      this.setState({ isInvalidCode: true })
    } else if (!isValidPassword(newPassword)) {
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
      previous,
      onStateChange,
      passwordPlaceholder,
      accessCodePlaceholder,
      showPasswordVerificationIntoTooltip,
    } = this.props

    const {
      isInvalidPassword,
      isUserBlocked,
      isInvalidCode,
      isPasswordsMatch,
    } = this.state

    return (
      <Form
        className="vtex-login__email-verification"
        title={translate('login.createPassword', intl)}
        onSubmit={e => this.handleOnSubmit(e)}
        content={
          <Fragment>
            <div className="vtex-login__input-container vtex-login__input-container--access-code">
              <AuthState.Token>
                {({ value, setValue }) => (
                  <Input
                    token
                    name="token"
                    onChange={e => {
                      setValue(e.target.value)
                      this.setState({ isInvalidCode: false })
                    }}
                    value={value || ''}
                    placeholder={
                      accessCodePlaceholder ||
                      translate('login.accessCode.placeholder', intl)
                    }
                  />
                )}
              </AuthState.Token>
            </div>
            <FormError show={isInvalidCode}>
              {translate('login.invalidCode', intl)}
            </FormError>
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
            <div className="vtex-login__back-button">
              <Button
                variation="tertiary"
                size="small"
                onClick={() => onStateChange({ step: previous })}
              >
                <span className="vtex-login__back-icon c-link">
                  <IconArrowBack size={10} color="currentColor" />
                </span>
                <span className="t-mini ml2">
                  {translate('login.goBack', intl)}
                </span>
              </Button>
            </div>
            <div className="vtex-login__send-button">
              <AuthService.SetPassword
                onSuccess={this.handleSuccess}
                onFailure={this.handleFailure}
              >
                {({
                  state: { password, token },
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
                    onClick={e => this.handleOnSubmit(e, password, token, setPassword)}
                    isLoading={loading}
                    disabled={!validatePassword(password)}
                  >
                    <span className="t-mini">
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
  /** Next step */
  next: PropTypes.number.isRequired,
  /** Previous step */
  previous: PropTypes.number.isRequired,
  /** Set the type of password verification ui */
  showPasswordVerificationIntoTooltip: PropTypes.bool,
  /** Function to change de active tab */
  onStateChange: PropTypes.func.isRequired,
  /** Intl object*/
  intl: intlShape,
  /** Placeholder to password input */
  passwordPlaceholder: PropTypes.string,
  /** Placeholder to access code input */
  accessCodePlaceholder: PropTypes.string,
  /** Function called after login success */
  loginCallback: PropTypes.func,
}

export default injectIntl(RecoveryPassword)
