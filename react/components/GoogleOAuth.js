import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { Button } from 'vtex.styleguide'
import { graphql } from 'react-apollo'

import { translate } from '../utils/translate'
import oAuth from '../mutations/oAuth.gql'

// Component that shows account options to the user.
class GoogleOAuth extends Component {
  static propTypes = {
    /** Intl object*/
    intl: intlShape,
    /** Graphql property to call a mutation */
    oAuth: PropTypes.func,
  };

  handleLoginClick = event => {
    event.preventDefault()
    this.props.oAuth({
      variables: {
        provider: 'Google', 
        redirectUrl: location.origin
      }
    }).then(({ data: { oAuth } }) => {
      location.assign(oAuth)
    })
  }

  render() {
    const { intl } = this.props
    return (
        <Button
          variation="danger"
          size="small"
          onClick={event => this.handleLoginClick(event)}
          block
        >
          <span className="f7">{translate('loginOptions.googleOAuth', intl)}</span>
        </Button>
    )
  }
}

export default injectIntl(
  graphql(oAuth, { name: 'oAuth' })(GoogleOAuth)
)