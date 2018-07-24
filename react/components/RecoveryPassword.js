import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Input, Button } from 'vtex.styleguide'
import { injectIntl, intlShape } from 'react-intl'
import { graphql } from 'react-apollo'

import { translate } from '../utils/translate'
import { isValidPassword, isValidAccessCode } from '../utils/format-check'
import recoveryPassword from '../mutations/recoveryPassword.gql'
import Form from './Form'
import FormError from './FormError'

/** RecoveryPassword tab component. Receive a code and new password from an input
 * and call the recoveryPassword mutation.
 */

class RecoveryPassword extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      isInvalidPassword: false,
      isPasswordsMatch: true,
      isInvalidCode: false,
      isUserBlocked: false,
      code: '',
      newPassword: '',
      confirmPassword: '',
    }
  }

  handleCodeChange = event => {
    this.setState({ isInvalidCode: false, code: event.target.value })
  }

  handleNewPassword = event => {
    this.setState({ isInvalidPassword: false, newPassword: event.target.value })
  }

  handleConfirmPassword = event => {
    this.setState({ isPasswordsMatch: true, confirmPassword: event.target.value })
  }

  handleSuccess = status => {
    const { onStateChange, next } = this.props
    status === 'Success' && onStateChange({ step: next })
    this.props.loginCallback()
  }

  handleUserIsBlocked = status => {
    status === 'BlockedUser' && this.setState({ isUserBlocked: true })
  }

  handleOnSubmit = event => {
    event.preventDefault()
    const { email, recoveryPassword } = this.props
    const { newPassword, code, confirmPassword } = this.state
    if (!isValidAccessCode(code)) {
      this.setState({ isInvalidCode: true })
    } else if (!isValidPassword(newPassword)) {
      this.setState({ isInvalidPassword: true })
    } else if (newPassword !== confirmPassword) {
      this.setState({ isPasswordsMatch: false })
    } else {
      this.setState({ isLoading: true })
      recoveryPassword({
        variables: { email, newPassword, code },
      })
        .then(({ data }) => {
          if (data && data.recoveryPassword) {
            this.setState({ isLoading: false })
            this.handleSuccess(data.recoveryPassword)
            this.handleUserIsBlocked(data.recoveryPassword)
          }
        }, err => { console.error(err) })
    }
  }
  render() {
    const { intl, previous, onStateChange } = this.props

    const {
      isLoading,
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
        content={(
          <React.Fragment>
            <div className="vtex-login__input-container vtex-login__input-container--access-code">
              <Input
                onChange={this.handleCodeChange}
                placeholder={translate('login.code', intl)}
              />
            </div>
            <FormError show={isInvalidCode}>
              {translate('login.invalidCode', intl)}
            </FormError>
            <div className="vtex-login__input-container vtex-login__input-container--password">
              <Input
                type="password"
                onChange={this.handleNewPassword}
                placeholder={translate('login.newPassword', intl)}
              />
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
                onChange={this.handleConfirmPassword}
                placeholder={translate('login.confirmPassword', intl)}
              />
            </div>
            <FormError show={!isPasswordsMatch}>
              {translate('login.invalidMatch', intl)}
            </FormError>
          </React.Fragment>
        )}
        footer={(
          <React.Fragment>
            <div className="vtex-login__back-button">
              <Button variation="secondary" size="small"
                onClick={() => onStateChange({ step: previous })}>
                <span className="f7">{translate('login.goBack', intl)}</span>
              </Button>
            </div>
            <div className="vtex-login__send-button">
              <Button
                variation="primary"
                size="small"
                type="submit"
                onClick={e => this.handleOnSubmit(e)}
                isLoading={isLoading}
              >
                <span className="f7">{translate('login.create', intl)}</span>
              </Button>
            </div>
          </React.Fragment>
        )}
      />
    )
  }
}

RecoveryPassword.propTypes = {
  /** Next step */
  next: PropTypes.number.isRequired,
  /** Previous step */
  previous: PropTypes.number.isRequired,
  /** Email set on state */
  email: PropTypes.string.isRequired,
  /** Function to change de active tab */
  onStateChange: PropTypes.func.isRequired,
  /** Graphql property to call a mutation */
  recoveryPassword: PropTypes.func.isRequired,
  /** Intl object*/
  intl: intlShape,
  /** Function called after login success */
  loginCallback: PropTypes.func,
}

export default injectIntl(
  graphql(recoveryPassword, { name: 'recoveryPassword' })(RecoveryPassword)
)
