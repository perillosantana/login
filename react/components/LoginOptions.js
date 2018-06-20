import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { translate } from '../utils'
import { Button } from 'vtex.styleguide'

/** LoginOptions tab component. Displays a list of login options */
class LoginOptions extends Component {
  render() {
    const { onStateChange, titleLabel, options, intl } = this.props

    return (
      <div>
        <h3 className="fw5 ttu br2 tc fw4 v-mid relative pv3 ph5 f6 light-marine">
          {translate(titleLabel, intl)}
        </h3>
        <ul className="vtex-login-options__list">
          {options.map((el, index) => {
            return (
              <li className="mb5" key={`login-option-array-${index}`}>
                <Button
                  variation="secondary"
                  size="small"
                  onClick={() => onStateChange({ step: index + 1 })}
                  block
                >
                  <div className="f7">{translate(el, intl)}</div>
                </Button>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

LoginOptions.propTypes = {
  /** Intl object*/
  intl: intlShape,
  /** Function to change de active tab */
  onStateChange: PropTypes.func.isRequired,
  /** Title that will be shown on top */
  titleLabel: PropTypes.string.isRequired,
  /** List of options to be displayed */
  options: PropTypes.arrayOf(PropTypes.string),
}

export default injectIntl(LoginOptions)
