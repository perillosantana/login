import PropTypes from 'prop-types'
import { intlShape } from 'react-intl'

export const LoginContainerProptypes = {
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

export const LoginPropTypes = {
  /** Intl object*/
  intl: intlShape,
  /** Data object with user profile */
  data: PropTypes.shape({
    refetch: PropTypes.func.isRequired,
    profile: PropTypes.shape({}),
  }).isRequired,
  /** Is box with the login options should be opened or not */
  isBoxOpen: PropTypes.bool.isRequired,
  /** Should the Icon be rendered as link or not */
  renderIconAsLink: PropTypes.bool.isRequired,
  /** Function called when the user click outside of the box*/
  onOutSideBoxClick: PropTypes.func.isRequired,
  /** Function called when the user clicks on the icon*/
  onProfileIconClick: PropTypes.func.isRequired,
  /** Props received through the LoginContainer */
  ...LoginContainerProptypes,
}
