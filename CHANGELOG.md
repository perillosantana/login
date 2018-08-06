# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Fixed
- `LoginOptions` throwing error on invalid element type

## [1.1.0] - 2018-08-02
### Added
- `Tooltip` component to show to the user if the password is attending the requisites.
- Schema into `Login` component.

### Fixed
- `LoginContent` form position.

## [1.0.1] - 2018-07-30
### Fixed
- Console warning of `loginTitle` being undefined.

## [1.0.2] - 2018-07-30
- Fix error of undefined LoginOption props.

## [1.0.1] - 2018-07-30
### Fixed
- Console warning of `loginTitle` being undefined.

## [1.0.0] - 2018-07-26
### Added
- Receive from the `VTEX-ID` all the login options available to authenticate users.
- Arrow icon to the back button.

### Changed
- Validation component tick color to red (error) and green (success).

## [0.10.0] - 2018-07-26
### Added
- `PasswordInput` to validate the password and show the validation to the user.
- Show password icon.

## [0.9.13] - 2018-07-25
### Fixed
- `LoginContent` position to be always under the `ProfileIcon`.

## [0.9.12] - 2018-07-24
### Fixed
- Fix onClick handle of recovery password.

## [0.9.11] - 2018-07-24
### Added
- Now, placeholders are customize by schema props.

### Changed
- Allow breakline on Login Titles.

## [0.9.10] - 2018-07-24
### Added
- Support for attribute `closeonclick` to close on click events inside modal.

### Changed
- Update CCS classes to improve customization.

## [0.9.9] - 2018-07-24
### Fixed 
- Set default option correctly in `LoginContent`.

## [0.9.8] - 2018-07-23
### Added
- Add `ExtensionContainer` to allow multiple `ExtensionPoints`.

### Fixed
- Set cookie properly when is a social login. 

## [0.9.7] - 2018-07-19
### Changed
- Move css back to tachyons classes.
- Refactor form structure to generic component.

## [0.9.6] - 2018-07-16
### Added
- Add `ExtensionPoint` as a custom login option.

## [0.9.5] - 2018-07-13
### Added
- Default callback after login success.

### Fixed
- Get profile after login.

## [0.9.4] - 2018-07-12
### Fixed
- Callback after login success.

## [0.9.3] - 2018-07-12
### Fixed
- Fix oAuth Set-Cookie in `LoginContent`. 

## [0.9.2] - 2018-07-11
### Fixed
- Add intl and css in `LoginContent`.

## [0.9.1] - 2018-7-9
### Fixed
- Icon not showing on mobile.

## [0.9.0] - 2018-7-9
### Changed
- Render login icon as a link when mobile.

## [0.8.0] - 2018-7-6
### Fixed
- The Login button padding.

### Added
- `LoginContent` component.

### Changed
- Moved from tachyons classes to custom classes with the tachyons properties.

## [0.7.2] - 2018-7-6
### Changed
- Change to HTML button instead of VTEX Style Guide.

## [0.7.1] - 2018-7-5
### Fixed
- Intl of the OAuth Component.

## [0.7.0] - 2018-7-5
### Added
- `OAuth` with Facebook account.

## [0.6.0] - 2018-7-5
### Added
- `OAuth` with Google account.

## [0.5.0] - 2018-7-4
### Added 
- Add recovery password in classic login.

## [0.4.0] - 2018-6-28
### Added 
- Add validation on email, password and code inputs. 

## [0.3.0] - 2018-6-28

### Added
- Login with email and password.

## [0.2.1] - 2018-6-26
### Changed
- Add email when user profile don't have firstName.

### Fixed 
- Fix `accessKeySignIn` and `sendEmailVerification` mutations to reflect the changes in resolvers. 

## [0.2.0] - 2018-6-14
### Added
- Add form in login inputs and my-orders route in account options.
- Remove My Profile from Account Options. 

## [0.1.0] - 2018-6-11

### Added
- Add Account content when user is logged.

## [0.0.2] - 2018-6-8
### Changed
- Rename `index` to `Login`

## [0.0.1] - 2018-6-8
### Added
- Add _Login_ app.
