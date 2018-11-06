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
  }

  handleLogoutClick = async () => {
    await this.props.logout()
    location.assign('/') // Needed to refetch all the data from GraphQL.
  }

  render() {
    const { intl } = this.props
    return (
      <div className="vtex-login__account-options items-center w-100">
        <div className="ma4 min-h-2 b--muted-4">
          <Link page={'store/account'}>
            <button
              className="vtex-button bw1 ba fw5 ttu br2 fw4 v-mid relative pv3 ph5 f6 bg-base b--transparent c-action-primary hover-b--transparent hover-c-action-primary pointer"
              closeonclick=""
            >
              <span className="f7">{translate('login.myAccount', intl)}</span>
            </button>
          </Link>
        </div>
        <hr className="mv2 o-30" />
        <div className="ma4 min-h-2 b--muted-4">
          <Button
            variation="tertiary"
            size="small"
            onClick={() => this.handleLogoutClick()}
          >
            <span className="f7">{translate('login.logoutLabel', intl)}</span>
          </Button>
        </div>
      </div>
    )
  }
}

export default injectIntl(graphql(logout, { name: 'logout' })(AccountOptions))
