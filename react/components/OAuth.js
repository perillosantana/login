import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { graphql } from 'react-apollo'
import { Button } from 'vtex.styleguide'

import { translate } from '../utils/translate'

import oAuth from '../mutations/oAuth.gql'

// Component that shows account options to the user.
class OAuth extends Component {
  static propTypes = {
    /** Intl object*/
    intl: intlShape,
    /** Graphql property to call a mutation */
    oAuth: PropTypes.func,
    /** Name of the Provider to proceed with the Authentication */
    provider: PropTypes.string,
    /** Actual button */
    children: PropTypes.node,
  };

  handleLoginClick = event => {
    event.preventDefault()
    this.props.oAuth({
      variables: {
        provider: this.props.provider,
        redirectUrl: location.origin,
      },
    }).then(({ data: { oAuth } }) => {
      location.assign(oAuth)
    })
  }

  render() {
    const { intl, children, provider } = this.props
    return (
      <div className="vtex-login__button vtex-login__button--social">
        <Button
          variation="tertiary"
          onClick={event => this.handleLoginClick(event)}
        >
          {children}
          <span className="f6 vtex-login__oauth-label relative normal">
            {translate('loginOptions.oAuth', intl)}
            <span className="vtex-login__oauth-provider b">{provider}</span>
          </span>
        </Button>
      </div>
    )
  }
}

export default injectIntl(
  graphql(oAuth, { name: 'oAuth' })(OAuth)
)
