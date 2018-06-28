import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { Button } from 'vtex.styleguide'
import { Link } from 'render'
import { graphql } from 'react-apollo'

import { translate } from '../utils/translate'
import logout from '../mutations/logout.gql'

// Component that shows account options to the user.
class AccountOptions extends Component {
  static propTypes = {
    /** Intl object*/
    intl: intlShape,
    /** Graphql property to call a mutation */
    logout: PropTypes.func,
  };

  handleLogoutClick = () => {
    this.props.logout()
    location.assign('/') // Needed to refetch all the data from GraphQL.
  }

  render() {
    const { intl } = this.props
    return (
      <div className="vtex-login__account-options items-center w-100">
        <div className="ma4 min-h-2 b--light-gray">
          <Link page={'store/account/orders'}>
            <Button
              variation="tertiary"
              size="small"
            >
              <span className="f7">{translate('login.my-orders', intl)}</span>
            </Button>
          </Link>
        </div>
        <hr className="mv2 o-30" />
        <div className="ma4 min-h-2 b--light-gray">
          <Button
            variation="tertiary"
            size="small"
            onClick={() => this.handleLogoutClick()}
          >
            <span className="f7">{translate('login.logout-label', intl)}</span>
          </Button>
        </div>
      </div>
    )
  }
}

export default injectIntl(
  graphql(logout, { name: 'logout' })(AccountOptions)
)
