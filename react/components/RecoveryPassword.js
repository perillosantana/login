import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'

import { Input, Button } from 'vtex.styleguide'
import { AuthState, AuthService } from 'vtex.react-vtexid'

import { translate } from '../utils/translate'
import { isValidPassword, isValidAccessCode } from '../utils/format-check'
import Form from './Form'
import FormError from './FormError'
import PasswordInput from './PasswordInput'
import GoBackButton from './GoBackButton'

import styles from '../styles.css'

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
    err.code === 'BlockedUser'
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
        className={`${styles.emailVerification} w-100`}
        title={translate('store/login.createPassword', intl)}
        onSubmit={e => this.handleOnSubmit(e)}
        content={
          <Fragment>
            <div
              className={`${styles.inputContainer} ${
                styles.inputContainerAccessCode
              } pv3`}
            >
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
                      translate('store/login.accessCode.placeholder', intl)
                    }
                  />
                )}
              </AuthState.Token>
            </div>
            <FormError show={isInvalidCode}>
              {translate('store/login.invalidCode', intl)}
            </FormError>
            <div
              className={`${styles.inputContainer} ${
                styles.inputContainerPassword
              } pv3`}
            >
              <AuthState.Password>
                {({ value, setValue }) => (
                  <PasswordInput
                    onStateChange={({ password }) => {
                      setValue(password)
                      this.setState({ isInvalidPassword: false })
                    }}
                    placeholder={
                      passwordPlaceholder ||
                      translate('store/login.password.placeholder', intl)
                    }
                    password={value || ''}
                    showPasswordVerificationIntoTooltip={
                      showPasswordVerificationIntoTooltip
                    }
                  />
                )}
              </AuthState.Password>
            </div>
            <FormError show={isInvalidPassword}>
              {translate('store/login.invalidPassword', intl)}
            </FormError>
            <FormError show={isUserBlocked}>
              {translate('store/login.userBlocked', intl)}
            </FormError>
            <div
              className={`${styles.inputContainer} ${
                styles.inputContainerPassword
              } pv3`}
            >
              <Input
                type="password"
                onChange={this.handleConfirmPasswordChange}
                placeholder={translate('store/login.confirmPassword', intl)}
              />
            </div>
            <FormError show={!isPasswordsMatch}>
              {translate('store/login.invalidMatch', intl)}
            </FormError>
          </Fragment>
        }
        footer={
          <Fragment>
            <GoBackButton
              onStateChange={onStateChange}
              changeTab={{ step: previous }}
            />
            <div className={`${styles.sendButton} ml-auto`}>
              <AuthService.SetPassword
                onSuccess={this.handleSuccess}
                onFailure={this.handleFailure}
              >
                {({
                  state: { password, token },
                  loading,
                  action: setPassword,
                  validation: { validatePassword },
                }) => (
                  <Button
                    variation="primary"
                    size="small"
                    type="submit"
                    onClick={e =>
                      this.handleOnSubmit(e, password, token, setPassword)
                    }
                    isLoading={loading}
                    disabled={!validatePassword(password)}
                  >
                    <span className="t-small">
                      {translate('store/login.create', intl)}
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
