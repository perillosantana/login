import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'

import { AuthState, AuthService } from 'vtex.react-vtexid'
import { Input, Button } from 'vtex.styleguide'

import Form from './Form'
import FormError from './FormError'
import { translate } from '../utils/translate'
import { steps } from '../utils/steps'
import GoBackButton from './GoBackButton'

/**
 * EmailVerification tab component.
 * Receive a email from an input and call the sendEmailVerification API
 */
class EmailVerification extends Component {
  static propTypes = {
    /** Title to be displayed */
    title: PropTypes.string,
    /** Placeholder to email input */
    emailPlaceholder: PropTypes.string,
    /** Intl object*/
    intl: intlShape,
    /** Whether to display the back button */
    showBackButton: PropTypes.bool,
    onSuccess: PropTypes.func.isRequired,
  }

  state = {
    isInvalidEmail: false,
    isUserBlocked: false,
  }

  handleOnSubmit = (event, email, validate, sendToken) => {
    event.preventDefault()
    if (!validate(email)) {
      this.setState({ isInvalidEmail: true })
    } else {
      sendToken()
    }
  }

  render() {
    const {
      title,
      intl,
      emailPlaceholder,
    } = this.props
    const { isInvalidEmail, isUserBlocked } = this.state

    return (
      <Form
        className="vtex-login__email-verification"
        title={title || translate('loginOptions.emailVerification', intl)}
        onSubmit={e => this.handleOnSubmit(e)}
        content={
          <Fragment>
            <div className="vtex-login__input-container vtex-login__input-container--email">
              <AuthState.Email>
                {({ value, setValue }) => (
                  <Input
                    type="email"
                    name="email"
                    value={value || ''}
                    onChange={e => setValue(e.target.value)}
                    placeholder={
                      emailPlaceholder ||
                      translate('login.email.placeholder', intl)
                    }
                  />
                )}
              </AuthState.Email>
            </div>
            <FormError show={isInvalidEmail}>
              {translate('login.invalidEmail', intl)}
            </FormError>
            <FormError show={isUserBlocked}>
              {translate('login.userBlocked', intl)}
            </FormError>
          </Fragment>
        }
        footer={
          <Fragment>
            <div className="vtex-login__send-button">
              <AuthService.SendAccessKey
                useNewSession
                onSuccess={this.props.onSuccess}
                onFailure={() => {
                  this.setState({ isUserBlocked: true })
                }}
              >
                {({
                  state: { email },
                  loading,
                  action: sendToken,
                  validation: { validateEmail },
                }) => (
                  <Button
                    variation="primary"
                    size="small"
                    type="submit"
                    isLoading={loading}
                    onClick={e =>
                      this.handleOnSubmit(e, email, validateEmail, sendToken)
                    }
                  >
                    <span className="t-small">{translate('login.send', intl)}</span>
                  </Button>
                )}
              </AuthService.SendAccessKey>
            </div>
          </Fragment>
        }
      />
    )
  }
}

export default injectIntl(EmailVerification)
