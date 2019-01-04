import React, { Component, Fragment } from 'react'
import { ButtonWithIcon, IconArrowBack } from 'vtex.styleguide'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'

import { translate } from '../utils/translate'

const arrow = <IconArrowBack size={10} />

class GoBackButton extends Component {
  static propTypes = {
    /** Function to change the active tab */
    onStateChange: PropTypes.func,
    /** Data that change the active tab */
    changeTab: PropTypes.object,
    /** Intl object*/
    intl: intlShape,
  }

  render() {
    const { onStateChange, intl, changeTab } = this.props
    return (
      <Fragment>
        <div className="vtex-login__back-button">
          <ButtonWithIcon
            icon={arrow}
            iconPosition="left"
            variation="tertiary"
            size="small"
            onClick={() => onStateChange(changeTab)}
          >
            <span className="t-small ml2">
              {translate('login.goBack', intl)}
            </span>
          </ButtonWithIcon>
        </div>
      </Fragment>

    )

  }
}
export default injectIntl(GoBackButton)