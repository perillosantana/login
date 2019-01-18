import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'

import CodeConfirmation from './CodeConfirmation'
import GoBackButton from './GoBackButton'
// import { translate } from '../utils/translate'

/** CodeConfirmation tab component. Receive the code from an input and call the signIn API */
class TokenLogin extends Component {
  handleBackClick = () => this.props.onBack()

  render() {
    return (
      <Fragment>
        <GoBackButton
          onClick={this.handleBackClick}
        />
        <CodeConfirmation
          accessCodePlaceholder={this.props.accessCodePlaceholder}
          onLoginSuccess={() => {
            this.props.onLoginSuccess()
            this.props.loginCallback()
          }}
          onChangePassword={this.props.onChangePassword}
          showAddPassword
        />
      </Fragment>
    )
  }
}

TokenLogin.propTypes = {
  /** Intl object*/
  intl: intlShape,
  /** Placeholder to access code input */
  accessCodePlaceholder: PropTypes.string,
  onLoginSuccess: PropTypes.func,
  loginCallback: PropTypes.func,
  onBack: PropTypes.func,
  onChangePassword: PropTypes.func,
}

export default injectIntl(TokenLogin)
