import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'

import { Button } from 'vtex.styleguide'
import { AuthService } from 'vtex.auth'

import { translate } from '../utils/translate'

// Component that shows account options to the user.
class OAuth extends Component {
  static propTypes = {
    /** Intl object*/
    intl: intlShape,
    /** Name of the Provider to proceed with the Authentication */
    provider: PropTypes.string,
    /** Actual button */
    children: PropTypes.node,
  }

  render() {
    const { intl, children, provider } = this.props
    return (
      <div className="vtex-login__button vtex-login__button--social">
        <AuthService.OAuthRedirect useNewSession provider={provider} >
          {({ loading, action: redirectToOAuthPage }) => (
            <Button
              isLoading={loading}
              variation="tertiary"
              onClick={redirectToOAuthPage}
            >
              {children}
              <span className="t-action--small vtex-login__oauth-label relative normal">
                {translate('loginOptions.oAuth', intl)}
                <span className="vtex-login__oauth-provider b">{provider}</span>
              </span>
            </Button>
          )}
        </AuthService.OAuthRedirect>
      </div>
    )
  }
}

export default injectIntl(OAuth)
