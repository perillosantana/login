import PropTypes from 'prop-types'
import { intlShape } from 'react-intl'

export const LoginPropTypes = {
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
  /** Icon's color */
  iconColor: PropTypes.string,
  /** Icon's label */
  iconLabel: PropTypes.string,
}
