import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Input, Button } from 'vtex.styleguide'
import { injectIntl, intlShape } from 'react-intl'
import { graphql } from 'react-apollo'

import { translate } from '../utils/translate'
import { isValidEmail, isValidPassword } from '../utils/format-check'
import classicSignIn from '../mutations/classicSignIn.gql'
import { steps } from '../utils/steps'

/** EmailAndPasswordLogin component. */
class EmailAndPassword extends Component {
  static propTypes = {
    /** Next step */
    next: PropTypes.number.isRequired,
    /** Previous step */
    previous: PropTypes.number.isRequired,
    /** Email set on state */
    email: PropTypes.string.isRequired,
    /** Title to be displayed */
    title: PropTypes.string,
    /** Password set on state */
    password: PropTypes.string.isRequired,
    /** Function to change de active tab */
    onStateChange: PropTypes.func.isRequired,
    /** Graphql property to call a mutation */
    classicSignIn: PropTypes.func.isRequired,
    /** Intl object*/
    intl: intlShape,
    /** Whether to display the back button */
    showBackButton: PropTypes.bool,
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
    this.props.onStateChange({ step: steps.EMAIL_VERIFICATION, isCreatePassword: true })
    event.preventDefault()
  }

  handleSuccess = status => {
    const { onStateChange, next } = this.props
    status === 'Success' && onStateChange({ step: next })
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
    } = this.props

    const {
      isLoading,
      isInvalidEmail,
      isInvalidPassword,
      isWrongCredentials,
      isUserBlocked,
    } = this.state

    return (
      <div className="vtex-login__email-verification">
        <h3 className="vtex-login__form-title">
          {title || translate('loginOptions.emailAndPassword', intl)}
        </h3>
        <form onSubmit={e => this.handleOnSubmit(e)}>
          <div className="vtex-login__input-container">
            <Input
              value={email}
              onChange={this.handleInputChange}
              placeholder={'Ex: example@mail.com'}
            />
          </div>
          {isInvalidEmail &&
            <div className="vtex-login__form-error">
              {translate('login.invalidEmail', intl)}
            </div>
          }
          <div className="vtex-login__input-container">
            <Input
              type="password"
              value={password}
              onChange={this.handlePasswordChange}
              placeholder={translate('login.password', intl)}
            />
          </div>
          {isInvalidPassword &&
            <div className="vtex-login__form-error">
              {translate('login.invalidPassword', intl)}
            </div>
          }
          {isWrongCredentials &&
            <div className="vtex-login__form-error">
              {translate('login.wrongCredentials', intl)}
            </div>
          }
          {isUserBlocked &&
            <div className="vtex-login__form-error">
              {translate('login.userBlocked', intl)}
            </div>
          }
          <div className="vtex-login__form-link-container">
            <a href="" className="link" onClick={this.handleCreatePassword}>
              <span className="f7">{translate('login.forgotPassword', intl)}</span>
            </a>
          </div>
          <div className="vtex-login__form-footer">
            {showBackButton && <div className="vtex-login__back-button">
              <Button variation="secondary" size="small"
                onClick={() => onStateChange({ step: previous, password: '' })}>
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
                <span className="f7">{translate('login.signIn', intl)}</span>
              </Button>
            </div>
          </div>
          <div className="vtex-login__form-link-container">
            <a href="" className="link" onClick={e => this.handleCreatePassword(e)}>
              <span className="f7">{translate('login.notHaveAccount', intl)}</span>
            </a>
          </div>
        </form>
      </div>
    )
  }
}

export default injectIntl(
  graphql(classicSignIn, { name: 'classicSignIn' })(EmailAndPassword)
)
