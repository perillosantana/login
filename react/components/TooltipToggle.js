import React, { Fragment } from 'react'
import { injectIntl } from 'react-intl'

import { ButtonWithIcon } from 'vtex.styleguide'
import Icon from 'vtex.use-svg/Icon'

import { truncateString } from '../utils/format-string'
import { translate } from '../utils/translate'

const profileIcon = iconSize => (<Icon id="hpa-profile" size={iconSize} />)
const TooltipToggle = (props) => {
  const {
    iconSize,
    iconLabel,
    labelClasses,
    intl,
    onProfileIconClick,
    profileData,
  } = props

  return (
    <ButtonWithIcon variation="tertiary" icon={profileIcon(iconSize)} iconPosition="left" onClick={onProfileIconClick}>
      <div
        className="flex pv2 items-center"
      >
        <Fragment>
          {profileData ? (
            <span className={`vtex-login__profile t-action--small order-1 pl4 ${labelClasses} dn-m db-l`}>
              {translate('login.hello', intl)}{' '}
              {profileData.firstName || truncateString(profileData.email)}
            </span>
          ) : (
            iconLabel && <span className={`vtex-login__label t-action--small pl4 ${labelClasses} dn-m db-l`}>{iconLabel}</span>
          )}
        </Fragment>
      </div>
    </ButtonWithIcon>
  )
}

export default injectIntl(TooltipToggle)