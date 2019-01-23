import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { Button } from 'vtex.styleguide'

// import { translate } from '../utils/translate'

class PasswordChangeSuccess extends Component {
  handleContinue = () => {
    this.props.onContinue()
  }

  render() {
    return (
      <div className="relative">
        Senha alterada com sucesso
        <Button
          variation="primary"
          size="small"
          onClick={this.props.onContinue}
        >
          <span className="t-small">Continuar</span>
        </Button>
      </div>
    )
  }
}

PasswordChangeSuccess.propTypes = {
  /** Function to change de active tab */
  onContinue: PropTypes.func.isRequired,
  /** Intl object*/
  intl: intlShape,
}

export default injectIntl(PasswordChangeSuccess)
