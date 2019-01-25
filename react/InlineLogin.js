import React, { Component } from 'react'

import { compose } from 'ramda'
import { withSession } from 'vtex.render-runtime'
import { graphql } from 'react-apollo'
import { injectIntl, intlShape } from 'react-intl'
import OutsideClickHandler from 'react-outside-click-handler'
import classNames from 'classnames'

import LoginContent from './LoginContent'
import AccountOptions from './components/AccountOptions'
import TooltipToggle from './components/TooltipToggle'
import { getProfile } from './utils/profile'

import { LoginSchema } from './schema'
import { session } from 'vtex.store-resources/Queries'

import './global.css'

class InlineLogin extends Component {

  state = {
    isBoxOpen: false,
  }

  handleProfileIconClick = () => {
    this.setState({ isBoxOpen: !this.state.isBoxOpen })
  }

  handleOutSideBoxClick = () => {
    this.setState({ isBoxOpen: false })
  }

  onClickLoginButton = () => {
    const { data: { refetch } } = this.props
    refetch().then(() => {
      handleOutSideBoxClick()
    })
  }

  render() {
    const { data } = this.props
    const { isBoxOpen } = this.state

    const profile = getProfile(data)

    return (
      <div className="vtex-login__container flex items-center fr">
        <div className="relative">
          <TooltipToggle
            iconSize={this.props.iconSize}
            iconLabel={this.props.iconLabel}
            labelClasses={this.props.labelClasses}
            onProfileIconClick={this.handleProfileIconClick}
            profileData={profile}
          />
          <OutsideClickHandler onOutsideClick={this.handleOutSideBoxClick}>
            <div
              className={classNames('vtex-login__box absolute z-max', {
                'flex': isBoxOpen,
                'dn': !isBoxOpen,
              })}
            >
              <div className="vtex-login__arrow-up absolute top-0 right-0 shadow-3 bg-base" />
              <div className="vtex-login__content-container shadow-3 mt3">
                {
                  profile ? 
                  <div className="vtex-login-content flex relative bg-base justify-around overflow-hidden">
                    <div className="vtex-login-content__form--step-0">
                      <AccountOptions />
                    </div>
                  </div> :
                  <LoginContent
                    session={data}
                    loginCallback={this.onClickLoginButton}
                    {...this.props}
                  />
                }
              </div>
            </div>
          </OutsideClickHandler>
        </div>
      </div>
    )
  }
}

InlineLogin.defaultProps = {
  labelClasses: 'white',
}

InlineLogin.propTypes = {
  /** Intl object*/
  intl: intlShape,
  /** Data object with user profile */
  data: PropTypes.shape({
    refetch: PropTypes.func.isRequired,
    profile: PropTypes.shape({}),
  }).isRequired,
  /** Title of login options */
  optionsTitle: PropTypes.string,
  /** Title of classic login */
  emailAndPasswordTitle: PropTypes.string,
  /** Title of access code login */
  accessCodeTitle: PropTypes.string,
  /** Placeholder to email input */
  emailPlaceholder: PropTypes.string,
  /** Placeholder to password input */
  passwordPlaceholder: PropTypes.string,
  /** Placeholder to access code input */
  accessCodePlaceholder: PropTypes.string,
  /** Set the type of password verification ui */
  showPasswordVerificationIntoTooltip: PropTypes.bool,
  /** Icon's size */
  iconSize: PropTypes.number,
  /** Icon's label */
  iconLabel: PropTypes.object,
  /** Label's classnames */
  labelClasses: PropTypes.string,
}

const options = {
  options: () => ({ ssr: false }),
}

export default withSession({
  loading: <div />,
})(compose(
  injectIntl,
  graphql(session, options),
)(InlineLogin))

InlineLogin.schema = {
  title: 'editor.login.title',
  type: 'object',
  properties: LoginSchema,
}