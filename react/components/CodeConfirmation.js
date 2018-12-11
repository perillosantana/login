import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Input, Button, IconArrowBack } from 'vtex.styleguide'
import { injectIntl, intlShape } from 'react-intl'

import { translate } from '../utils/translate'
import { isValidAccessCode } from '../utils/format-check'
import { AuthState, AuthService } from 'vtex.auth'
import Form from './Form'
import FormError from './FormError'

/** CodeConfirmation tab component. Receive the code from an input and call the signIn API */
class CodeConfirmation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isInvalidCode: false,
      isWrongCredentials: false,
    }
  }

  handleSuccess = () => this.props.loginCallback()

  handleFailure = err => {
    err.authStatus === 'WrongCredentials'
      ? this.setState({ isWrongCredentials: true })
      : console.error(err)
  }

  handleOnSubmit = (event, confirmToken, token) => {
    event.preventDefault()
    if (!isValidAccessCode(token)) {
      this.setState({ isInvalidCode: true })
    } else {
      confirmToken()
    }
  }

  render() {
    const { intl, onStateChange, previous, accessCodePlaceholder } = this.props
    const { isInvalidCode, isWrongCredentials } = this.state

    return (
      <Form
        className="vtex-login__code-confirmation"
        title={translate('login.accessCodeTitle', intl)}
        onSubmit={e => this.handleOnSubmit(e)}
        content={
          <Fragment>
            <div className="vtex-login__input-container vtex-login__input-container--access-code">
              <AuthState.Token>
                {({ value, setValue }) => (
                  <Input
                    token
                    name="token"
                    value={value || ''}
                    onChange={e => {
                      setValue(e.target.value)
                      this.setState({ isInvalidCode: false })
                    }}
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
            <FormError show={isWrongCredentials}>
              {translate('login.wrongCredentials', intl)}
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
                <span className="f7 ml2">
                  {translate('login.goBack', intl)}
                </span>
              </Button>
            </div>
            <div className="vtex-login__send-button">
              <AuthService.LoginWithAccessKey
                onSuccess={this.handleSuccess}
                onFailure={this.handleFailure}
              >
                {({ state: { token }, loading, action: confirmToken }) => (
                  <Button
                    variation="primary"
                    size="small"
                    type="submit"
                    onClick={e => this.handleOnSubmit(e, confirmToken, token)}
                    isLoading={loading}
                  >
                    <span className="f7">
                      {translate('login.confirm', intl)}
                    </span>
                  </Button>
                )}
              </AuthService.LoginWithAccessKey>
            </div>
          </Fragment>
        }
      />
    )
  }
}

CodeConfirmation.propTypes = {
  /** Next step */
  next: PropTypes.number.isRequired,
  /** Previous step */
  previous: PropTypes.number.isRequired,
  /** Function to change de active tab */
  onStateChange: PropTypes.func.isRequired,
  /** Intl object*/
  intl: intlShape,
  /** Placeholder to access code input */
  accessCodePlaceholder: PropTypes.string,
  /** Function called after login success */
  loginCallback: PropTypes.func,
}

export default injectIntl(CodeConfirmation)
