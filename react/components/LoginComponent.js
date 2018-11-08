import React, { Component, Fragment } from 'react'
import { Link } from 'render'
import { Button } from 'vtex.styleguide'
import OutsideClickHandler from 'react-outside-click-handler'

import LoginContent from '../LoginContent'
import ProfileIcon from '../images/ProfileIcon'
import { truncateString } from '../utils/format-string'
import { translate } from '../utils/translate'
import { LoginPropTypes } from '../propTypes'
import { getProfile } from '../utils/profile'

export default class LoginComponent extends Component {
  static propTypes = LoginPropTypes

  /** Function called after login success */
  onClickLoginButton = () => {
    const { data: { refetch }, onOutSideBoxClick } = this.props
    refetch().then(() => {
      onOutSideBoxClick()
    })
  }

  renderIcon = () => {
    const {
      iconSize,
      iconLabel,
      iconClasses,
      labelClasses,
      intl,
      renderIconAsLink,
      onProfileIconClick,
      data,
    } = this.props

    const profile = getProfile(data)

    const iconContent = (
      <Fragment>
        <div className={`${iconClasses}`}>
          <ProfileIcon size={iconSize} />
        </div>
        {profile ? (
          <span className={`vtex-login__profile order-1 f6 pl4 ${labelClasses} dn-m db-l`}>
            {translate('login.hello', intl)}{' '}
            {profile.firstName || truncateString(profile.email)}
          </span>
        ) : (
          iconLabel && <span className={`vtex-login__label f6 pl4 ${labelClasses} dn-m db-l`}>{iconLabel}</span>
        )}
      </Fragment>
    )

    if (renderIconAsLink) {
      const linkTo = profile ? '/account' : '/login'
      return (
        <Link
          to={linkTo}
          className="vtex-login__button--link tc flex items-center"
        >
          {iconContent}
        </Link>
      )
    }

    return (
      <Button variation="tertiary" icon onClick={onProfileIconClick}>
        <div
          className="flex items-center"
          ref={e => {
            this.iconRef = e
          }}
        >
          {iconContent}
        </div>
      </Button>
    )
  }

  render() {
    const { isBoxOpen, onOutSideBoxClick, data } = this.props
    const boxPositionStyle = {
      right: this.iconRef && this.iconRef.offsetWidth - 21,
    }

    const profile = getProfile(data)

    return (
      <div className="vtex-login__container flex items-center f6 fr">
        <div className="relative">
          {this.renderIcon()}
          <OutsideClickHandler onOutsideClick={onOutSideBoxClick}>
            <div
              className={`vtex-login__box absolute z-max ${
                isBoxOpen ? 'flex' : 'dn'
              }`}
              style={boxPositionStyle}
            >
              <div className="vtex-login__arrow-up absolute top-0 right-0 shadow-3 bg-base" />
              <div className="vtex-login__content-container shadow-3 mt3">
                <LoginContent
                  profile={profile}
                  loginCallback={this.onClickLoginButton}
                  isInitialScreenOptionOnly
                  {...this.props}
                />
              </div>
            </div>
          </OutsideClickHandler>
        </div>
      </div>
    )
  }
}
