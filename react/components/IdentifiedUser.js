import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'

import { AuthService } from 'vtex.auth'
import { Button } from 'vtex.styleguide'

import Form from './Form'
// import { translate } from '../utils/translate'

/**
 * Welcome screen for identified user
 */
class IdentifiedUser extends Component {
  static propTypes = {
    /** Intl object*/
    intl: intlShape,
    onSuccess: PropTypes.func.isRequired,
    userName: PropTypes.string,
    onSwitchUser: PropTypes.func.isRequired,
    hasPasswordPreference: PropTypes.bool,
  }

  handleOnSubmit = (event, sendToken) => {
    event.preventDefault()
    if (this.props.hasPasswordPreference) {
      this.props.onSuccess()
    } else {
      sendToken()
    }
  }

  render() {
    return (
      <Form
        className="vtex-login__email-verification"
        onSubmit={e => this.handleOnSubmit(e)}
        content={
          <Fragment>
            <div className="vtex-login__input-container vtex-login__input-container--email">
              Welcome back {this.props.userName}!
            </div>
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
                  loading,
                  action: sendToken,
                }) => (
                  <Button
                    variation="primary"
                    size="small"
                    type="submit"
                    isLoading={loading}
                    onClick={e =>
                      this.handleOnSubmit(e, sendToken)
                    }
                  >
                    <span className="t-small">continue</span>
                  </Button>
                )}
              </AuthService.SendAccessKey>
              <Button
                variation="primary"
                size="small"
                onClick={this.props.onSwitchUser}
              >
                <span className="t-small">That's not me</span>
              </Button>
            </div>
          </Fragment>
        }
      />
    )
  }
}

export default injectIntl(IdentifiedUser)
