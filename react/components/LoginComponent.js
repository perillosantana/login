import React, { Component } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
import classNames from 'classnames'

import LoginContent from '../LoginContent'
import TooltipToggle from '../components/TooltipToggle'
import { LoginPropTypes } from '../propTypes'
import { getProfile } from '../utils/profile'

export default class LoginComponent extends Component {
  static propTypes = LoginPropTypes

  onClickLoginButton = () => {
    const { data: { refetch }, onOutSideBoxClick } = this.props
    refetch().then(() => {
      onOutSideBoxClick()
    })
  }

  render() {
    const { isBoxOpen, onOutSideBoxClick, data } = this.props

    const profile = getProfile(data)

    return (
      <div className="vtex-login__container flex items-center fr">
        <div className="relative">
          <TooltipToggle
            iconSize={this.props.iconSize}
            iconLabel={this.props.iconLabel}
            labelClasses={this.props.labelClasses}
            renderIconAsLink={this.props.renderIconAsLink}
            onProfileIconClick={this.props.onProfileIconClick}
            profileData={profile}
          />
          <OutsideClickHandler onOutsideClick={onOutSideBoxClick}>
            <div
              className={classNames('vtex-login__box absolute z-max', {
                'flex': isBoxOpen,
                'dn': !isBoxOpen,
              })}
            >
              <div className="vtex-login__arrow-up absolute top-0 right-0 shadow-3 bg-base" />
              <div className="vtex-login__content-container shadow-3 mt3">
                <LoginContent
                  session={data}
                  loginCallback={this.onClickLoginButton}
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
