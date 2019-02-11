# VTEX Login app 

## Description

The VTEX Login app 
This is a VTEX app that is used by Dreamstore product.

:loudspeaker: **Disclaimer:** Don't fork this project, use, contribute, or open issue with your feature request.

## Release schedule
| Release  | Status              | Initial Release | Maintenance LTS Start | End-of-life | Dreamstore Compatibility
| :--:     | :---:               |  :---:          | :---:                 | :---:       | :---: 
| [1.x]    | **Maintenance LTS** |  2018-07-26     | 2018-11-08            | March 2019  | 1.x
| [2.x]    | **Current Release** |  2018-11-08     |                       |             | 2.x

See our [LTS policy](https://github.com/vtex-apps/awesome-io#lts-policy) for more information.

## Table of Contents
- [Usage](#usage)
  - [Blocks API](#blocks-api)
    - [Configuration](#configuration)
  - [Styles API](#styles-api)
- [Troubleshooting](#troubleshooting)
- [Tests](#tests)

## Usage

This app uses our store builder with the blocks architecture. To know more about Store Builder [click here.](https://help.vtex.com/en/tutorial/understanding-storebuilder-and-stylesbuilder#structuring-and-configuring-our-store-with-object-object)

To use this app, you need to import in your dependencies on `manifest.json`.

```json
  "dependencies": {
    "vtex.login": "2.x"
  }
```

Then, add `login` block into our app theme, as we do in our [Store Header app](https://github.com/vtex-apps/store-header/blob/master/store/blocks.json).

### Blocks API
This app has an interface that describes which rules must be implemented by a block when you want to use the minicart.

<!-- TODO find good example -->
```json
{
  "login": {
    "component": "Login"
  },
  "login-content": {
    "component": "LoginContent"
  }
}
```

#### Configuration 
Through the Storefront, you can change the minicart's behavior and interface. However, you also can make in your theme app, as Dreamstore does.

| Prop name          | Type       | Description                                                                 |
| ------------------ | ---------- | --------------------------------------------------------------------------- |
| `optionsTitle` | `String` | Set title of login options |
| `emailAndPasswordTitle` | `String` | Set title of login with email and password |
| `accessCodeTitle` | `String` | Set title of login by access code |
| `emailPlaceholder` | `String` | Set placeholder to email input |
| `passwordPlaceholder` | `String` | Set placeholder to password input |
| `showPasswordVerificationIntoTooltip` | `String` | Set show password format verification as tooltip |
| `acessCodePlaceholder` | `String` | Set placeholder to access code input |

### Styles API
:construction: :construction: :construction:

## Troubleshooting
You can check if others are passing through similar issues [here](https://github.com/vtex-apps/login/issues). Also feel free to [open issues](https://github.com/vtex-apps/login/issues/new) or contribute with pull requests.

## Tests
:construction: :construction: :construction: