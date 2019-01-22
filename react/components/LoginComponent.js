import React, { Component, Fragment } from 'react'
import { Link } from 'vtex.render-runtime'
import OutsideClickHandler from 'react-outside-click-handler'
import classNames from 'classnames'

import { ButtonWithIcon } from 'vtex.styleguide'
import Icon from 'vtex.use-svg/Icon'

import LoginContent from '../LoginContent'
import { truncateString } from '../utils/format-string'
import { translate } from '../utils/translate'
import { LoginPropTypes } from '../propTypes'
import { getProfile } from '../utils/profile'

const profileIcon = (iconSize, iconClasses) => (<Icon id="hpa-profile" className={iconClasses} size={iconSize} />)
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
        {renderIconAsLink &&
          <div className="flex items-center">
            <Icon id="hpa-profile" className={iconClasses} size={iconSize} />
          </div>
        }
        {profile ? (
          <span className={`vtex-login__profile t-action--small order-1 pl4 ${labelClasses} dn-m db-l`}>
            {translate('login.hello', intl)}{' '}
            {profile.firstName || truncateString(profile.email)}
          </span>
        ) : (
            iconLabel && <span className={`vtex-login__label t-action--small pl4 ${labelClasses} dn-m db-l`}>{iconLabel}</span>
          )}
      </Fragment>
    )

    if (renderIconAsLink) {
      const linkTo = profile ? 'store.account' : 'store.login'
      return (
        <Link
          page={linkTo}
          className="vtex-login__button--link tc flex items-center"
        >
          {iconContent}
        </Link>
      )
    }

    return (
      <ButtonWithIcon variation="tertiary" icon={profileIcon(iconSize, iconClasses)} iconPosition="left" onClick={onProfileIconClick}>
        <div
          className="flex pv2 items-center"
          ref={e => {
            this.iconRef = e
          }}
        >
          {iconContent}
        </div>
      </ButtonWithIcon>
    )
  }

  render() {
    const { isBoxOpen, onOutSideBoxClick, data } = this.props
    const boxPositionStyle = {
      right: this.iconRef && this.iconRef.offsetWidth - 21,
    }

    const profile = getProfile(data)

    return (
      <div className="vtex-login__container flex items-center fr">
        <div className="relative">
          {this.renderIcon()}
          <OutsideClickHandler onOutsideClick={onOutSideBoxClick}>
            <div
              className={classNames('vtex-login__box absolute z-max', {
                'flex': isBoxOpen,
                'dn': !isBoxOpen,
              })}
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
