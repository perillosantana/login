import PropTypes from 'prop-types'
import { intlShape } from 'react-intl'

// TODO: kill this
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
  // more props here
}
