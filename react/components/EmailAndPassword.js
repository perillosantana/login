import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Input, Button, IconArrowBack } from 'vtex.styleguide'
import { injectIntl, intlShape } from 'react-intl'
import { graphql } from 'react-apollo'

import { translate } from '../utils/translate'
import { isValidEmail, isValidPassword } from '../utils/format-check'
import classicSignIn from '../mutations/classicSignIn.gql'
import { steps } from '../utils/steps'
import Form from './Form'
import FormError from './FormError'
import PasswordInput from './PasswordInput'

/** EmailAndPasswordLogin component. */
class EmailAndPassword extends Component {
  static propTypes = {
    /** Next step */
    next: PropTypes.number.isRequired,
    /** Previous step */
    previous: PropTypes.number.isRequired,
    /** Email set on state */
    email: PropTypes.string.isRequired,
    /** Password set on state */
    password: PropTypes.string.isRequired,
    /** Set the type of password verification ui */
    passwordVerificationType: PropTypes.string,
    /** Title to be displayed */
    title: PropTypes.string,
    /** Placeholder to email input */
    emailPlaceholder: PropTypes.string,
    /** Placeholder to password input */
    passwordPlaceholder: PropTypes.string,
    /** Function to change de active tab */
    onStateChange: PropTypes.func.isRequired,
    /** Graphql property to call a mutation */
    classicSignIn: PropTypes.func.isRequired,
    /** Intl object*/
    intl: intlShape,
    /** Whether to display the back button */
    showBackButton: PropTypes.bool,
    /** Function called after login success */
    loginCallback: PropTypes.func,
  }

  state = {
    isLoading: false,
    isInvalidEmail: false,
    isInvalidPassword: false,
    isWrongCredentials: false,
    isUserBlocked: false,
  }

  handleInputChange = event => {
    this.setState({ isInvalidEmail: false })
    this.props.onStateChange({ email: event.target.value })
  }

  handlePasswordChange = event => {
    this.setState({ isInvalidPassword: false })
    this.props.onStateChange({ password: event.target.value })
  }

  componentWillUnmount() {
    this.setState({ isLoading: false })
  }

  handleCreatePassword = event => {
    this.props.onStateChange({
      step: steps.EMAIL_VERIFICATION,
      isCreatePassword: true,
      isOnInitialScreen: false,
    })
    event.preventDefault()
  }

  handleSuccess = status => {
    const { onStateChange, next } = this.props
    status === 'Success' && onStateChange({ step: next })
    this.props.loginCallback()
  }

  handleWrongCredentials = status => {
    status === 'WrongCredentials' && this.setState({ isWrongCredentials: true })
  }

  handleUserIsBlocked = status => {
    status === 'BlockedUser' && this.setState({ isUserBlocked: true })
  }

  handleOnSubmit = event => {
    event.preventDefault()
    const { email, password, classicSignIn } = this.props
    if (!isValidEmail(email)) {
      this.setState({ isInvalidEmail: true })
    } else if (!isValidPassword(password)) {
      this.setState({ isInvalidPassword: true })
    } else {
      this.setState({ isLoading: true })
      classicSignIn({
        variables: { email, password },
      })
        .then(({ data }) => {
          if (data && data.classicSignIn) {
            this.setState({ isLoading: false })
            this.handleSuccess(data.classicSignIn)
            this.handleWrongCredentials(data.classicSignIn)
            this.handleUserIsBlocked(data.classicSignIn)
          }
        }, err => { console.error(err) })
    }
  }

  render() {
    const {
      title,
      intl,
      onStateChange,
      previous,
      email,
      password,
      showBackButton,
      emailPlaceholder,
      passwordPlaceholder,
      passwordVerificationType,
    } = this.props

    const {
      isLoading,
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
        content={(
          <React.Fragment>
            <div className="vtex-login__input-container vtex-login__input-container--email">
              <Input
                value={email}
                onChange={this.handleInputChange}
                placeholder={emailPlaceholder}
              />
            </div>
            <FormError show={isInvalidEmail}>
              {translate('login.invalidEmail', intl)}
            </FormError>
            <div className="vtex-login__input-container vtex-login__input-container--password flex flex-column">
              <PasswordInput
                password={password}
                onStateChange={onStateChange}
                placeholder={passwordPlaceholder}
                passwordVerificationType={passwordVerificationType}
              />
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
              <a href="" className="link dim blue" onClick={this.handleCreatePassword}>
                <span className="f7">{translate('login.forgotPassword', intl)}</span>
              </a>
            </div>
          </React.Fragment>
        )}
        footer={(
          <React.Fragment>
            {showBackButton && <div className="vtex-login__back-button">
              <Button
                variation="tertiary"
                size="small"
                onClick={() => onStateChange({ step: previous, password: '' })}
              >
                <span className="vtex-login__back-icon"><IconArrowBack size={10} color="#368DF7" /></span>
                <span className="f7 ml2">{translate('login.goBack', intl)}</span>
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
                <span className="f7">{translate('login.signIn', intl)}</span>
              </Button>
            </div>
          </React.Fragment>
        )}
      >
        <div className="vtex-login__form-link-container flex justify-center ph0 mt4">
          <a href="" className="link dim blue" onClick={e => this.handleCreatePassword(e)}>
            <span className="f7">{translate('login.notHaveAccount', intl)}</span>
          </a>
        </div>
      </Form>
    )
  }
}

export default injectIntl(
  graphql(classicSignIn, { name: 'classicSignIn' })(EmailAndPassword)
)
