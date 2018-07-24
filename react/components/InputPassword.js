import React, { Component } from 'react'

import PropTypes from 'prop-types'
import { Input } from 'vtex.styleguide'
import { injectIntl, intlShape } from 'react-intl'
import PasswordValidationItem from './PasswordValidationItem'

class InputPassword extends Component {
  state = {
    showVerification: false,
  }

  handlePasswordChange = event => {
    const lowerCaseLetters = /[a-z]/g
    const upperCaseLetters = /[A-Z]/g
    const numbers = /[0-9]/g

    this.setState({
      containsLowerLetter: event.target.value.match(lowerCaseLetters),
      containsUpperLetter: event.target.value.match(upperCaseLetters),
      containsNumber: event.target.value.match(numbers),
      atLeastEightCharacteres: event.target.value.length >= 8,
    })

    this.props.onStateChange({ password: event.target.value })
  }

  render() {
    const {
      showVerification,
      containsLowerLetter,
      containsUpperLetter,
      containsNumber,
      atLeastEightCharacteres,
    } = this.state

    const { intl } = this.props

    return (
      <div>
        <Input
          type="password"
          value={this.props.password}
          onChange={this.handlePasswordChange}
<<<<<<< HEAD
          placeholder={this.props.placeholder}
=======
          placeholder={translate('login.password', intl)}
>>>>>>> Add locales to password validation item
          onBlur={() => this.setState({ showVerification: true })}
          onFocus={() => this.setState({ showVerification: true })}
        >
        </Input>
        {showVerification &&
          <div className="flex flex-row pt4">
            <div className="flex flex-column mr4">
              <PasswordValidationItem label={translate('login.password.uppercaseLetter', intl)} valid={containsUpperLetter} />
              <PasswordValidationItem label={translate('login.password.lowercaseLetter', intl)} valid={containsLowerLetter} />
            </div>
            <div className="flex flex-column">
              <PasswordValidationItem label={translate('login.password.number', intl)} valid={containsNumber} />
              <PasswordValidationItem label={translate('login.password.eightCharacteres', intl)} valid={atLeastEightCharacteres} />
            </div>
          </div>
        }
      </div>
    )
  }
}

InputPassword.propTypes = {
  /** Password set on state */
  password: PropTypes.string.isRequired,
  /** Placeholder to appear into the input */
  placeholder: PropTypes.string.isRequired,
  /** Function to change de active tab */
  onStateChange: PropTypes.func.isRequired,
  /** Intl object*/
  intl: intlShape,
}

export default injectIntl(InputPassword)
