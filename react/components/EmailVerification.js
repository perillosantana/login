import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Input, Button } from 'vtex.styleguide'
import { injectIntl, intlShape } from 'react-intl'
import { graphql } from 'react-apollo'

import sendEmailVerification from '../mutations/sendEmailVerification.gql'

import { translate } from '../utils'

/** EmailVerification tab component. Receive a email from an input and call the sendEmailVerification mutation */
class EmailVerification extends Component {
  constructor(props) {
    super(props)
    this.state = { isLoading: false }
  }

  handleInputChange = event => {
    this.props.onStateChange({ email: event.target.value })
  }

  componentWillUnmount() {
    this.setState({ isLoading: false })
  }

  handleOnSubmit = event => {
    const { sendEmailVerification, email, onStateChange, next } = this.props

    if (email !== '') {
      this.setState({ isLoading: true })
      sendEmailVerification({ variables: { email } }).then(
        ({ data }) => {
          if (data && data.sendEmailVerification) {
            onStateChange({ step: next })
          }
        },
        err => {
          console.log(err)
        })
    }
    event.preventDefault()
  }

  render() {
    const { goBack, send, intl, onStateChange, previous, email, titleLabel } = this.props
    const { isLoading } = this.state

    return (
      <div className="vtex-login__email-verification w-100">
        <h3 className="fw5 ttu br2 tc fw4 v-mid pv3 ph5 f6 light-marine">
          {translate(titleLabel, intl)}
        </h3>
        <form onSubmit={e => this.handleOnSubmit(e)}>
          <Input
            value={email}
            onChange={this.handleInputChange}
            placeholder={'Ex: example@mail.com'}
          />
          <div className="bt mt5 min-h-2 b--light-gray">
            <div className="fl mt4">
              <Button variation="secondary" size="small"
                onClick={() => onStateChange({ step: previous })}>
                <div className="f7">{translate(goBack, intl)}</div>
              </Button>
            </div>
            <div className="fr mt4">
              {isLoading ? (
                <Button size="small" disabled isLoading={isLoading}>
                  <div className="f7">{translate(send, intl)}</div>
                </Button>
              ) : (
                  <Button size="small"
                    type="submit"
                    onClick={e => this.handleOnSubmit(e)}
                  >
                    <div className="f7">{translate(send, intl)}</div>
                  </Button>
                )}
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
  /** Title that will be shown on top */
  titleLabel: PropTypes.string.isRequired,
  /** Locales go back string id */
  goBack: PropTypes.string.isRequired,
  /** Locales send string id */
  send: PropTypes.string.isRequired,
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
