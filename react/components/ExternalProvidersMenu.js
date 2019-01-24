import classNames from 'classnames'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import { ExtensionContainer } from 'vtex.render-runtime'

import { Button } from 'vtex.styleguide'

import FacebookIcon from '../images/FacebookIcon'
import GoogleIcon from '../images/GoogleIcon'
import { translate } from '../utils/translate'
import { slugify } from '../utils/format-string'
import OAuth from './OAuth'

const PROVIDERS_ICONS = {
  'Google': GoogleIcon,
  'Facebook': FacebookIcon,
}

class ExternalProvidersMenu extends Component {
  state = {
    loadingOptions: false,
  }

  //TODO: remove mock and use bezerras api
  mockLoginOptions = {
    providers: [
      {
        providerName: 'Facebook'
      },
      {
        providerName: 'Google'
      }
    ]
  }

  handleRefetchOptions = () => {
    return null
    if (!this.state.loadingOptions) {
      this.setState({ loadingOptions: true })
      this.props.refetchOptions()
        .then(() => this.setState({ loadingOptions: false }))
    }
  }

  render() {
    const {
      className,
      intl,
    } = this.props

    const { loadingOptions } = this.state

    const classes = classNames('vtex-login-options', className)

    return (
      <div className={classes}>
        <ul className="vtex-login-options__list list pa0">
          {this.mockLoginOptions && this.mockLoginOptions.providers && this.mockLoginOptions.providers.map(({ providerName }, index) => {
            const hasIcon = PROVIDERS_ICONS.hasOwnProperty(providerName)
            return (
              <li
                className={`vtex-login-options__list-item vtex-login-options__list-item--${slugify(providerName)} mb3`}
                key={`${providerName}-${index}`}
              >
                <OAuth provider={providerName}>
                  {hasIcon ? React.createElement(PROVIDERS_ICONS[providerName], null) : null}
                </OAuth>
              </li>
            )
          })}
          {!this.mockLoginOptions && (
            <li className="vtex-login-options__list-item mb3">
              <div className="vtex-login__button vtex-login__button--danger">
                <Button
                  type="danger"
                  variation="secondary"
                  isLoading={loadingOptions}
                  onClick={this.handleRefetchOptions}
                >
                  <div className={`${loadingOptions ? 'dn' : 'db'}`}>{translate('loginOptions.error.title', intl)}</div>
                  <span className="t-small pt1">{translate('loginOptions.error.subhead', intl)}</span>
                </Button>
              </div>
            </li>
          )}
          <li className="vtex-login-options__list-item vtex-login-options__list-item--container mb3">
            <ExtensionContainer id="container" />
          </li>
        </ul>
      </div>
    )
  }
}

ExternalProvidersMenu.propTypes = {
  /** Intl object*/
  intl: intlShape,
  /** List of options to be displayed */
  options: PropTypes.shape({
    accessKeyAuthentication: PropTypes.bool,
    classicAuthentication: PropTypes.bool,
    providers: PropTypes.arrayOf(PropTypes.shape({
      className: PropTypes.string,
      providerName: PropTypes.string,
    })),
  }),
  /** Class of the root element */
  className: PropTypes.string,
}

export default injectIntl(ExternalProvidersMenu)
