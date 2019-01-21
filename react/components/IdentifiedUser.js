import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'

import { AuthService } from 'vtex.react-vtexid'
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
    onTokenPreference: PropTypes.func.isRequired,
    onPasswordPreference: PropTypes.func.isRequired,
    userName: PropTypes.string,
    onNotMe: PropTypes.func.isRequired,
    hasPasswordPreference: PropTypes.bool,
  }

  handleOnSubmit = (event, sendToken) => {
    event.preventDefault()
    if (this.props.hasPasswordPreference) {
      this.props.onPasswordPreference()
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
                onSuccess={this.props.onTokenPreference}
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
                onClick={this.props.onNotMe}
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
