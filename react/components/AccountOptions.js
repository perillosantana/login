
import React, { Component } from 'react'
import { injectIntl, intlShape } from 'react-intl'

// Component that shows account options to the user.
class AccountOptions extends Component {
    static propTypes = {
        /** Intl object*/
        intl: intlShape
    }
    render() {
        const { intl: { formatMessage } } = this.props
        return (
            <h4>{formatMessage({ id: 'login.welcome' })}</h4>
        )
    }
}

export default injectIntl(AccountOptions)