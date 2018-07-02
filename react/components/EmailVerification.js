import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Input, Button } from 'vtex.styleguide'
import { injectIntl, intlShape } from 'react-intl'
import { graphql } from 'react-apollo'

import { translate } from '../utils/translate'
import { isValidEmail } from '../utils/format-check'
import sendEmailVerification from '../mutations/sendEmailVerification.gql'

/** EmailVerification tab component. Receive a email from an input and call the sendEmailVerification mutation */
class EmailVerification extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      isInvalidEmail: false,
      isUserBlocked: false,
    }
  }

  handleInputChange = event => {
    this.setState({ isInvalidEmail: false, isUserBlocked: false })
    this.props.onStateChange({ email: event.target.value })
  }

  componentWillUnmount() {
    this.setState({ isLoading: false })
  }

  handleOnSubmit = event => {
    const { sendEmailVerification, email, onStateChange, next } = this.props
    if (!isValidEmail(email)) {
      this.setState({ isInvalidEmail: true })
    } else {
      this.setState({ isLoading: true })
      sendEmailVerification({ variables: { email } })
        .then(({ data }) => {
          if (data && data.sendEmailVerification) {
            this.setState({ isLoading: false })
            onStateChange({ step: next })
          }
        }, err => {
          err && this.setState({ isLoading: false, isUserBlocked: true })
        })
    }
    event.preventDefault()
  }

  render() {
    const { intl, onStateChange, previous, email } = this.props
    const { isLoading, isInvalidEmail, isUserBlocked } = this.state

    return (
      <div className="vtex-login__email-verification w-100">
        <h3 className="fw5 ttu br2 tc fw4 v-mid pv3 ph5 f6 light-marine">
          {translate('loginOptions.emailVerification', intl)}
        </h3>
        <form onSubmit={e => this.handleOnSubmit(e)}>
          <Input
            value={email}
            onChange={this.handleInputChange}
            placeholder={'Ex: example@mail.com'}
          />
          {isInvalidEmail &&
            <div className="f7 tc bg-washed-red pa2 ma1">
              {translate('login.invalidEmail', intl)}
            </div>
          }
          {isUserBlocked &&
            <div className="f7 tc bg-washed-red pa2 ma1">
              {translate('login.userBlocked', intl)}
            </div>
          }
          <div className="bt mt5 min-h-2 b--light-gray">
            <div className="fl mt4">
              <Button variation="secondary" size="small"
                onClick={() => onStateChange({ step: previous })}>
                <span className="f7">{translate('login.goBack', intl)}</span>
              </Button>
            </div>
            <div className="fr mt4">
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
          </div>
        </form>
      </div>
    )
  }
}

EmailVerification.propTypes = {
  /** Next step */
  next: PropTypes.number.isRequired,
  /** Previous step */
  previous: PropTypes.number.isRequired,
  /** Email set on state */
  email: PropTypes.string.isRequired,
  /** Function to change de active tab */
  onStateChange: PropTypes.func.isRequired,
  /** Graphql property to call a mutation */
  sendEmailVerification: PropTypes.func.isRequired,
  /** Intl object*/
  intl: intlShape,
}

export default injectIntl(
  graphql(sendEmailVerification, { name: 'sendEmailVerification' })(
    EmailVerification
  )
)
