import classNames from 'classnames'
import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import { ExtensionContainer } from 'vtex.render-runtime'

import { Button } from 'vtex.styleguide'

import FacebookIcon from '../images/FacebookIcon'
import GoogleIcon from '../images/GoogleIcon'
import { translate } from '../utils/translate'
import FormTitle from './FormTitle'
import OAuth from './OAuth'

import styles from '../styles.css'

const PROVIDERS_ICONS = {
  Google: GoogleIcon,
  Facebook: FacebookIcon,
}

/** LoginOptions tab component. Displays a list of login options */
class LoginOptions extends Component {
  state = {
    loadingOptions: false,
  }

  handleRefetchOptions = () => {
    if (!this.state.loadingOptions) {
      this.setState({ loadingOptions: true })
      this.props
        .refetchOptions()
        .then(() => this.setState({ loadingOptions: false }))
    }
  }

  handleOptionClick = el => () => {
    this.props.onOptionsClick(el)
  }

  showOption = (option, optionName) => {
    const { isAlwaysShown, currentStep, options } = this.props
    return (
      options &&
      ((options[option] && !isAlwaysShown) || currentStep !== optionName)
    )
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

    const { loadingOptions } = this.state

    const classes = classNames(styles.options, className, {
      [styles.optionsSticky]: isAlwaysShown,
    })

    return (
      <div className={classes}>
        <FormTitle>{title || translate(fallbackTitle, intl)}</FormTitle>
        <ul className={`${styles.optionsList} list pa0`}>
          {options ? (
            <Fragment>
              {options.accessKeyAuthentication &&
                this.showOption(
                  'accessKeyAuthentication',
                  'store/loginOptions.emailVerification'
                ) && (
                <li className={`${styles.optionsListItem} mb3`}>
                  <div className={styles.button}>
                    <Button
                      variation="secondary"
                      onClick={this.handleOptionClick(
                        'store/loginOptions.emailVerification'
                      )}
                    >
                      <span>
                        {translate(
                          'store/loginOptions.emailVerification',
                          intl
                        )}
                      </span>
                    </Button>
                  </div>
                </li>
              )}
              {options.classicAuthentication &&
                this.showOption(
                  'classicAuthentication',
                  'store/loginOptions.emailAndPassword'
                ) && (
                <li className={`${styles.optionsListItem} mb3`}>
                  <div className={styles.button}>
                    <Button
                      variation="secondary"
                      onClick={this.handleOptionClick(
                        'store/loginOptions.emailAndPassword'
                      )}
                    >
                      <span>
                        {translate(
                          'store/loginOptions.emailAndPassword',
                          intl
                        )}
                      </span>
                    </Button>
                  </div>
                </li>
              )}
              {options.providers &&
                options.providers.map(({ providerName }, index) => {
                  const hasIcon = PROVIDERS_ICONS.hasOwnProperty(providerName)
                  return (
                    <li
                      className={`${styles.optionsListItem} mb3`}
                      key={`${providerName}-${index}`}
                    >
                      <OAuth provider={providerName}>
                        {hasIcon
                          ? React.createElement(
                            PROVIDERS_ICONS[providerName],
                            null
                          )
                          : null}
                      </OAuth>
                    </li>
                  )
                })}
            </Fragment>
          ) : (
            <li className={`${styles.optionsListItem} mb3`}>
              <div className={`${styles.button} ${styles.buttonDanger}`}>
                <Button
                  type="danger"
                  variation="secondary"
                  isLoading={loadingOptions}
                  onClick={this.handleRefetchOptions}
                >
                  <div className={`${loadingOptions ? 'dn' : 'db'}`}>
                    {translate('store/loginOptions.error.title', intl)}
                  </div>
                  <span className="t-small pt1">
                    {translate('store/loginOptions.error.subhead', intl)}
                  </span>
                </Button>
              </div>
            </li>
          )}
          <li
            className={`${styles.optionsListItem} ${
              styles.optionsListItemContainer
            } mb3`}
          >
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
  /** Function to refetch login options */
  refetchOptions: PropTypes.func.isRequired,
  /** Title that will be shown on top */
  title: PropTypes.string.isRequired,
  /** Fallback title that will be shown if there's no title */
  fallbackTitle: PropTypes.string.isRequired,
  /** List of options to be displayed */
  options: PropTypes.shape({
    accessKeyAuthentication: PropTypes.bool,
    classicAuthentication: PropTypes.bool,
    providers: PropTypes.arrayOf(
      PropTypes.shape({
        className: PropTypes.string,
        providerName: PropTypes.string,
      })
    ),
  }),
  /** Class of the root element */
  className: PropTypes.string,
  /** Whether this component is always rendered */
  isAlwaysShown: PropTypes.bool,
  /** Current option being displayed */
  currentStep: PropTypes.string,
}

export default injectIntl(LoginOptions)
