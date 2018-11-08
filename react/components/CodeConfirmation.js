import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Input, Button, IconArrowBack } from 'vtex.styleguide'
import { injectIntl, intlShape } from 'react-intl'
import { graphql } from 'react-apollo'

import { translate } from '../utils/translate'
import { isValidAccessCode } from '../utils/format-check'
import accessKeySignIn from '../mutations/accessKeySignIn.gql'
import Form from './Form'
import FormError from './FormError'

/** CodeConfirmation tab component. Receive the code from an input and call the signIn mutation */
class CodeConfirmation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      isInvalidCode: false,
      isWrongCredentials: false,
    }
  }

  handleInputChange = event => {
    this.setState({ isInvalidCode: false })
    this.props.onStateChange({ code: event.target.value })
  }

  handleSuccess = status => {
    const { onStateChange, next } = this.props
    status === 'Success' && this.props.loginCallback()
  }

  handleWrongCredentials = status => {
    status === 'WrongCredentials' && this.setState({ isWrongCredentials: true })
  }

  handleOnSubmit = event => {
    event.preventDefault()
    const { accessKeySignIn, email, code } = this.props
    if (!isValidAccessCode(code)) {
      this.setState({ isInvalidCode: true })
    } else {
      this.setState({ isLoading: true })
      accessKeySignIn({
        variables: { email, code },
      }).then(
        ({ data }) => {
          if (data && data.accessKeySignIn) {
            this.setState({ isLoading: false })
            this.handleSuccess(data.accessKeySignIn)
            this.handleWrongCredentials(data.accessKeySignIn)
          }
        }, err => { console.error(err) })
    }
  }

  render() {
    const {
      intl,
      onStateChange,
      previous,
      code,
      accessCodePlaceholder,
    } = this.props
    const {
      isLoading,
      isInvalidCode,
      isWrongCredentials,
    } = this.state

    return (
      <Form
        className="vtex-login__code-confirmation"
        title={translate('login.accessCodeTitle', intl)}
        onSubmit={e => this.handleOnSubmit(e)}
        content={(
          <Fragment>
            <div className="vtex-login__input-container vtex-login__input-container--access-code">
              <Input value={code} onChange={this.handleInputChange} placeholder={accessCodePlaceholder} />
            </div>
            <FormError show={isInvalidCode}>
              {translate('login.invalidCode', intl)}
            </FormError>
            <FormError show={isWrongCredentials}>
              {translate('login.wrongCredentials', intl)}
            </FormError>
          </Fragment>
        )}
        footer={(
          <Fragment>
            <div className="vtex-login__back-button">
              <Button
                variation="tertiary"
                size="small"
                onClick={() => onStateChange({ step: previous })}
              >
                <span className="vtex-login__back-icon"><IconArrowBack size={10} color="#368DF7" /></span>
                <span className="f7 ml2">{translate('login.goBack', intl)}</span>
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
                <span className="f7">{translate('login.confirm', intl)}</span>
              </Button>
            </div>
          </Fragment>
        )}
      />
    )
  }
}

CodeConfirmation.propTypes = {
  /** Email set on state */
  email: PropTypes.string.isRequired,
  /** Code set on state */
  code: PropTypes.string.isRequired,
  /** Next step */
  next: PropTypes.number.isRequired,
  /** Previous step */
  previous: PropTypes.number.isRequired,
  /** Function to change de active tab */
  onStateChange: PropTypes.func.isRequired,
  /** Graphql property to call a mutation */
  accessKeySignIn: PropTypes.func.isRequired,
  /** Intl object*/
  intl: intlShape,
  /** Placeholder to access code input */
  accessCodePlaceholder: PropTypes.string,
  /** Function called after login success */
  loginCallback: PropTypes.func,
}

export default injectIntl(
  graphql(accessKeySignIn, { name: 'accessKeySignIn' })(CodeConfirmation)
)
