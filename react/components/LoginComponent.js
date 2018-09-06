import React, { Component, Fragment } from 'react'
import { Link } from 'render'
import { Button } from 'vtex.styleguide'
import OutsideClickHandler from 'react-outside-click-handler'

import LoginContent from '../LoginContent'
import ProfileIcon from '../images/ProfileIcon'
import { truncateString } from '../utils/format-string'
import { translate } from '../utils/translate'
import { LoginPropTypes } from '../propTypes'


export default class LoginComponent extends Component {
  static propTypes = LoginPropTypes

  /** Function called after login success */
  handleLogin = () => {
    const { data: { refetch } } = this.props

    this.context.patchSession().then(() => {
      refetch()
    })
  }

  getProfile = () => {
    const { data } = this.props

    let profile = null

    if (data && !data.loading && data.getSession && data.getSession.profile && data.getSession.profile.id)
      profile = data.getSession.profile

    return profile
  }

  renderIcon = () => {
    const {
      iconSize,
      iconLabel,
      iconColor,
      intl,
      renderIconAsLink,
      onProfileIconClick,
    } = this.props

    const profile = this.getProfile()

    const iconContent = (
      <Fragment>
        <ProfileIcon size={iconSize} fillColor={iconColor} />
        {profile ? (
          <span className="vtex-login__profile order-1 gray f6 pl4">
            {translate('login.hello', intl)}{' '}
            {profile.firstName || truncateString(profile.email)}
          </span>
        ) : (
            iconLabel && <span className="vtex-login__label gray f6 pl4">{iconLabel}</span>
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
    const { isBoxOpen, onOutSideBoxClick } = this.props
    const boxPositionStyle = {
      right: this.iconRef && this.iconRef.offsetWidth - 21,
    }

    const profile = this.getProfile()

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
              <div className="vtex-login__arrow-up absolute top-0 right-0 shadow-3 bg-white" />
              <div className="vtex-login__content-container shadow-3 mt3">
                <LoginContent
                  profile={profile}
                  loginCallback={this.handleLogin}
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


LoginComponent.contextTypes = {
  patchSession: PropTypes.func,
}