import React, { Component, Fragment } from 'react'
import { Link } from 'vtex.render-runtime'
import OutsideClickHandler from 'react-outside-click-handler'
import classNames from 'classnames'

import { ButtonWithIcon } from 'vtex.styleguide'
import { IconProfile } from 'vtex.store-icons'

import LoginContent from '../LoginContent'
import { truncateString } from '../utils/format-string'
import { translate } from '../utils/translate'
import { LoginPropTypes } from '../propTypes'
import { getProfile } from '../utils/profile'

import styles from '../styles.css'

const profileIcon = (iconSize, labelClasses, classes) => (
  <div className={classNames(labelClasses, classes)}>
    <IconProfile size={iconSize} />
  </div>
)
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
      labelClasses,
      intl,
      renderIconAsLink,
      onProfileIconClick,
      data,
    } = this.props
    const profile = getProfile(data)
    const iconClasses = 'flex items-center'

    const iconContent = (
      <Fragment>
        {renderIconAsLink &&
          profileIcon(iconSize, labelClasses, iconClasses)
        }
        {
          profile ? (
            <span className={`${styles.profile} t-action--small order-1 pl4 ${labelClasses} dn db-l`}>
              {translate('login.hello', intl)}{' '}
              {profile.firstName || truncateString(profile.email)}
            </span>
          ) : (
              iconLabel && <span className={`${styles.label} t-action--small pl4 ${labelClasses} dn db-l`}>{iconLabel}</span>
            )
        }
      </Fragment >
    )

    if (renderIconAsLink) {
      const linkTo = profile ? 'store.account' : 'store.login'
      return (
        <Link
          page={linkTo}
          className={`${styles.buttonLink} h1 w2 tc flex items-center w-100-s h-100-s pa4-s`}
        >
          {iconContent}
        </Link>
      )
    }

    return (
      <ButtonWithIcon variation="tertiary" icon={profileIcon(iconSize, labelClasses)} iconPosition="left" onClick={onProfileIconClick}>
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
      <div className={`${styles.container} flex items-center fr`}>
        <div className="relative">
          {this.renderIcon()}
          <OutsideClickHandler onOutsideClick={onOutSideBoxClick}>
            <div
              className={classNames(`${styles.box} absolute z-max`, {
                'flex': isBoxOpen,
                'dn': !isBoxOpen,
              })}
              style={boxPositionStyle}
            >
              <div className={`${styles.arrowUp} absolute top-0 right-0 shadow-3 bg-base mr3 rotate-45 h2 w2`} />
              <div className={`${styles.contentContainer} shadow-3 mt3`}>
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
