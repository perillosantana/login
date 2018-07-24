import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Input, Button } from 'vtex.styleguide'
import { injectIntl, intlShape } from 'react-intl'
import { graphql } from 'react-apollo'

import Form from './Form'
import FormError from './FormError'
import { translate } from '../utils/translate'
import { isValidEmail } from '../utils/format-check'
import sendEmailVerification from '../mutations/sendEmailVerification.gql'
import { steps } from '../utils/steps'

/**
 * EmailVerification tab component.
 * Receive a email from an input and call the sendEmailVerification mutation
 */
class EmailVerification extends Component {
  static propTypes = {
    /** Next step */
    next: PropTypes.number.isRequired,
    /** Previous step */
    previous: PropTypes.number.isRequired,
    /** State that will send user to CreatePassword tab */
    isCreatePassword: PropTypes.bool.isRequired,
    /** Title to be displayed */
    title: PropTypes.string,
    /** Email set on state */
    email: PropTypes.string.isRequired,
    /** Function to change de active tab */
    onStateChange: PropTypes.func.isRequired,
    /** Graphql property to call a mutation */
    sendEmailVerification: PropTypes.func.isRequired,
    /** Intl object*/
    intl: intlShape,
    /** Whether to display the back button */
    showBackButton: PropTypes.bool,
  }

  state = {
    isLoading: false,
    isInvalidEmail: false,
    isUserBlocked: false,
  }

  handleInputChange = event => {
    this.setState({ isInvalidEmail: false, isUserBlocked: false })
    this.props.onStateChange({ email: event.target.value })
  }

  componentWillUnmount() {
    this.setState({ isLoading: false })
  }

  handleOnSubmit = event => {
    event.preventDefault()
    const { isCreatePassword, sendEmailVerification, email, onStateChange, next } = this.props
    if (!isValidEmail(email)) {
      this.setState({ isInvalidEmail: true })
    } else {
      this.setState({ isLoading: true })
      sendEmailVerification({ variables: { email } })
        .then(({ data }) => {
          if (data && data.sendEmailVerification) {
            this.setState({ isLoading: false })
            isCreatePassword
              ? onStateChange({ step: steps.CREATE_PASSWORD, isCreatePassword: false })
              : onStateChange({ step: next })
          }
        }, err => {
          err && this.setState({ isLoading: false, isUserBlocked: true })
        })
    }
  }

  render() {
    const {
      title,
      intl,
      onStateChange,
      previous,
      email,
      isCreatePassword,
      showBackButton,
    } = this.props
    const { isLoading, isInvalidEmail, isUserBlocked } = this.state

    return (
      <Form
        className="vtex-login__email-verification"
        title={title || translate('loginOptions.emailVerification', intl)}
        onSubmit={e => this.handleOnSubmit(e)}
        content={(
          <React.Fragment>
            <div className="vtex-login__input-container vtex-login__input-container--email">
              <Input
                value={email}
                onChange={this.handleInputChange}
                placeholder={'Ex: example@mail.com'}
              />
            </div>
            <FormError show={isInvalidEmail}>
              {translate('login.invalidEmail', intl)}
            </FormError>
            <FormError show={isUserBlocked}>
              {translate('login.userBlocked', intl)}
            </FormError>
          </React.Fragment>
        )}
        footer={(
          <React.Fragment>
            {(showBackButton || isCreatePassword) && <div className="vtex-login__back-button">
              <Button
                variation="secondary"
                size="small"
                onClick={() => isCreatePassword
                  ? onStateChange({ step: steps.EMAIL_PASSWORD, isCreatePassword: false })
                  : onStateChange({ step: previous })
                }
              >
                <span className="f7">{translate('login.goBack', intl)}</span>
              </Button>
            </div>}
            <div className="vtex-login__send-button">
              <Button
                variation="primary"
                size="small"
                type="submit"
                onClick={e => this.handleOnSubmit(e)}
                isLoading={isLoading}
              >
                <span className="f7">{translate('login.send', intl)}</span>
              </Button>
            </div>
          </React.Fragment>
        )}
      />
    )
  }
}

export default injectIntl(
  graphql(sendEmailVerification, { name: 'sendEmailVerification' })(
    EmailVerification
  )
)
