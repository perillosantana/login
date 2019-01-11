import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'

import { Input, Button } from 'vtex.styleguide'
import { AuthState, AuthService } from 'vtex.react-vtexid'

import { translate } from '../utils/translate'
import { isValidAccessCode } from '../utils/format-check'
import Form from './Form'
import FormError from './FormError'

/** CodeConfirmation tab component. Receive the code from an input and call the signIn API */
class CodeConfirmation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isInvalidCode: false,
      isWrongCredentials: false,
      handleSuccess: this.props.onSuccess,
    }
  }

  handleSuccess = () => this.props.onSuccess()

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

  handleAddPassword = (confirmToken, token) => {
    if (!isValidAccessCode(token)) {
      this.setState({ isInvalidCode: true })
    } else {
      this.setState({ handleSuccess: this.props.onAddPassword })
      confirmToken()
    }
  }

  render() {
    const { intl, accessCodePlaceholder } = this.props
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
            <div className="vtex-login__send-button">
              <AuthService.LoginWithAccessKey
                onSuccess={this.state.handleSuccess}
                onFailure={this.handleFailure}
              >
                {({ state: { token }, loading, action: confirmToken }) => (
                  <Fragment>
                    <Button
                      variation="primary"
                      size="small"
                      type="submit"
                      onClick={e => this.handleOnSubmit(e, confirmToken, token)}
                      isLoading={loading}
                    >
                      <span className="t-small">
                        {translate('login.confirm', intl)}
                      </span>
                    </Button>
                    { this.props.showAddPassword &&
                      <Button
                        variation="primary"
                        size="small"
                        onClick={() => this.handleAddPassword(confirmToken, token)}
                        isLoading={loading}
                      >
                        <span className="t-small">
                          Add New Password
                        </span>
                      </Button>
                    }
                  </Fragment>
                )}
              </AuthService.LoginWithAccessKey>
            </div>
          </Fragment>
        }
      />
    )
  }
}

CodeConfirmation.defaultProps = {
  showAddPassword: false,
}

CodeConfirmation.propTypes = {
  /** Intl object*/
  intl: intlShape,
  /** Placeholder to access code input */
  accessCodePlaceholder: PropTypes.string,
  onSuccess: PropTypes.func,
  showAddPassword: PropTypes.bool,
  onAddPassword: PropTypes.func,
}

export default injectIntl(CodeConfirmation)
