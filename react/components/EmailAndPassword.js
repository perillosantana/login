import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Input, Button } from 'vtex.styleguide'
import { injectIntl, intlShape } from 'react-intl'
import { translate } from '../utils'
import { Link } from 'render'
import { graphql } from 'react-apollo'

import classicSignIn from '../mutations/classicSignIn.gql'

const checkPasswordFormat = password => {
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/
  return regex.test(password)
}

/** EmailAndPasswordLogin component. */
class EmailAndPassword extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      isInvalidPassword: false,
      isWrongCredentials: false,
      isUserBlocked: false,
    }
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
    this.setState({ isLoading: true })
    const { email, password, classicSignIn } = this.props
    event.preventDefault()
    if (!checkPasswordFormat(password)) {
      this.setState({ isInvalidPassword: true })
      this.setState({ isLoading: false })
    } else if (email !== '') {
      classicSignIn({
        variables: { email, password },
      }).then(
        ({ data }) => {
          if (data && data.classicSignIn) {
            this.setState({ isLoading: false })
            this.handleSuccess(data.classicSignIn)
            this.handleWrongCredentials(data.classicSignIn)
            this.handleUserIsBlocked(data.classicSignIn)
          }
        }, err => {
          console.log(err)
        })
    }
  }

  render() {
    const {
      goBack,
      send,
      intl,
      onStateChange,
      previous,
      email,
      password,
      titleLabel,
    } = this.props

    const {
      isLoading,
      isInvalidPassword,
      isWrongCredentials,
      isUserBlocked,
    } = this.state

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
          {isInvalidPassword &&
            <div className="f6 tc bg-washed-red pa2 ma1">
              {translate('login.invalid-password', intl)}
            </div>
          }
          {isWrongCredentials &&
            <div className="f6 tc bg-washed-red pa2 ma1">
              {translate('login.wrong-credentials', intl)}
            </div>
          }
          {isUserBlocked &&
            <div className="f6 tc bg-washed-red pa2 ma1">
              {translate('login.user-blocked', intl)}
            </div>
          }
          <div className="bt ma3 min-h-2 b--light-gray">
            <div className="fl mt3">
              <Button variation="secondary" size="small"
                onClick={() => onStateChange({ step: previous, password: '' })}>
                <span className="f7">{translate(goBack, intl)}</span>
              </Button>
            </div>
            <div className="fr mt3">
              <Button
                variation="primary"
                size="small"
                type="submit"
                onClick={e => this.handleOnSubmit(e)}
                isLoading={isLoading}
              >
                <span className="f7">{translate(send, intl)}</span>
              </Button>
            </div>
          </div>
        </form>
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
  /** Graphql property to call a mutation */
  classicSignIn: PropTypes.func.isRequired,
  /** Intl object*/
  intl: intlShape,
}

export default injectIntl(
  graphql(classicSignIn, { name: 'classicSignIn' })(EmailAndPassword)
)
