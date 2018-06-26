import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Input, Button } from 'vtex.styleguide'
import { injectIntl, intlShape } from 'react-intl'
import { translate } from '../utils'
import { Link } from 'render'

import classicSignIn from '../mutations/classicSignIn.gql'

/** EmailAndPasswordVerification tab component. */
class EmailAndPassword extends Component {
  constructor(props) {
    super(props)
    this.state = { isLoading: false }
  }

  handleInputChange = event => {
    this.props.onStateChange({ email: event.target.value })
  }

  handlePasswordChange = event => {
    this.props.onStateChange({ password: event.target.value })
  }

  componentWillUnmount() {
    this.setState({ isLoading: false })
  }

  handleOnSubmit = event => {
    const { email, password } = this.props

    console.log('Email:', email)
    console.log('password:', password)

    event.preventDefault()
  }

  render() {
    const { goBack, send, intl, onStateChange, previous, email, password, titleLabel } = this.props
    const { isLoading } = this.state

    return (
      <div className="vtex-login__email-verification w-100">
        <h3 className="fw5 ttu br2 tc fw4 v-mid pv3 ph5 f6 light-marine">
          Coming soon! {/* {translate(titleLabel, intl)} */}
        </h3>
        {/* <form onSubmit={e => this.handleOnSubmit(e)}>
          <Input
            value={email}
            onChange={this.handleInputChange}
            placeholder={'Ex: example@mail.com'}
          />
          <div className="flex justify-end pv3">
            <Link className="link">
              <span className="f7">{translate('login.forgot-password', intl)}</span>
            </Link>
          </div>
          <Input
            type="password"
            value={password}
            onChange={this.handlePasswordChange}
            placeholder={translate('login.password', intl)}
          />
          <div className="flex justify-end pt3">
            <Link className="link">
              <span className="f7">{translate('login.not-have-account', intl)}</span>
            </Link>
          </div>
          <div className="bt mt5 min-h-2 b--light-gray">
            <div className="fl mt4">
              <Button variation="secondary" size="small"
                onClick={() => onStateChange({ step: previous, password: '' })}>
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
        </form> */}
      </div>
    )
  }
}

EmailAndPassword.propTypes = {
  /** Next step */
  next: PropTypes.number.isRequired,
  /** Previous step */
  previous: PropTypes.number.isRequired,
  /** Email set on state */
  email: PropTypes.string.isRequired,
  /** Password set on state */
  password: PropTypes.string.isRequired,
  /** Title that will be shown on top */
  titleLabel: PropTypes.string.isRequired,
  /** Locales go back string id */
  goBack: PropTypes.string.isRequired,
  /** Locales send string id */
  send: PropTypes.string.isRequired,
  /** Function to change de active tab */
  onStateChange: PropTypes.func.isRequired,
  /** Intl object*/
  intl: intlShape,
}

export default injectIntl(EmailAndPassword)
