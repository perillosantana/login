
import React, { Component } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import { Button } from 'vtex.styleguide'

// Component that shows account options to the user.
class AccountOptions extends Component {
    static propTypes = {
        /** Intl object*/
        intl: intlShape
    }

    handleClickButton = () => location.assign('/account')

    render() {
        const { intl: { formatMessage } } = this.props
        return (
            <div className="vtex-login__account-options w-100">
                <div className="ma4 min-h-2 b--light-gray">
                    <Button variation="tertiary" size="small"
                        onClick={() => this.handleClickButton}
                    >
                        <div className="f7">{formatMessage({ id: 'login.my-account' })}</div>
                    </Button>
                </div>
            </div>
        )
    }
}

export default injectIntl(AccountOptions)