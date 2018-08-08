import classNames from 'classnames'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import { ExtensionContainer } from 'render'
import { Button } from 'vtex.styleguide'

import FacebookIcon from '../images/FacebookIcon'
import GoogleIcon from '../images/GoogleIcon'
import { translate } from '../utils/translate'
import { slugify } from '../utils/format-string'
import FormTitle from './FormTitle'
import OAuth from './OAuth'

const PROVIDERS_ICONS = {
  'Google': GoogleIcon,
  'Facebook': FacebookIcon,
}

/** LoginOptions tab component. Displays a list of login options */
class LoginOptions extends Component {
  handleOptionClick = el => () => {
    this.props.onOptionsClick(el)
  }

  showOption = (option, optionName) => {
    const { isAlwaysShown, currentStep, options } = this.props
    return options[option] && !isAlwaysShown ? true : currentStep !== optionName
  }

  render() {
    const {
      className,
      title,
      fallbackTitle,
      options,
      intl,
      isAlwaysShown,
    } = this.props

    const classes = classNames('vtex-login-options', className, {
      'vtex-login-options--sticky': isAlwaysShown,
    })

    return (
      <div className={classes}>
        <FormTitle>{title || translate(fallbackTitle, intl)}</FormTitle>
        <ul className="vtex-login-options__list list pa0">
          {this.showOption('accessKeyAuthentication', 'loginOptions.emailVerification') &&
            <li className="vtex-login-options__list-item mb3">
              <div className="vtex-login__button">
                <Button
                  variation="secondary"
                  onClick={this.handleOptionClick('loginOptions.emailVerification')}
                >
                  <span className="f6">{translate('loginOptions.emailVerification', intl)}</span>
                </Button>
              </div>
            </li>
          }
          {this.showOption('classicAuthentication', 'loginOptions.emailAndPassword') &&
            <li className="vtex-login-options__list-item mb3">
              <div className="vtex-login__button">
                <Button
                  variation="secondary"
                  onClick={this.handleOptionClick('loginOptions.emailAndPassword')}
                >
                  <span className="f6">{translate('loginOptions.emailAndPassword', intl)}</span>
                </Button>
              </div>
            </li>
          }
          {options.providers && options.providers.map(({ providerName }, index) => {
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
          <li className="vtex-login-options__list-item vtex-login-options__list-item--container mb3">
            <ExtensionContainer id="container" />
          </li>
        </ul>
      </div>
    )
  }
}

LoginOptions.propTypes = {
  /** Intl object*/
  intl: intlShape,
  /** Function to change de active tab */
  onOptionsClick: PropTypes.func.isRequired,
  /** Title that will be shown on top */
  title: PropTypes.string.isRequired,
  /** Fallback title that will be shown if there's no title */
  fallbackTitle: PropTypes.string.isRequired,
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
  /** Whether this component is always rendered */
  isAlwaysShown: PropTypes.bool,
  /** Current option being displayed */
  currentStep: PropTypes.string,
}

export default injectIntl(LoginOptions)
