# VTEX Login app 

## Description

The VTEX Login app responsible to handle user login. 
This is a VTEX app that is used by store theme.

:loudspeaker: **Disclaimer:** Don't fork this project, use, contribute, or open issue with your feature request.

## Release schedule
| Release  | Status              | Initial Release | Maintenance LTS Start | End-of-life | Store Compatibility
| :--:     | :---:               |  :---:          | :---:                 | :---:       | :---:
| [2.x]    | **Current Release** |  2018-11-08     |                       |             | 2.x 
| [1.x]    | **Maintenance LTS** |  2018-07-26     | 2018-11-08            | March 2019  | 1.x

See our [LTS policy](https://github.com/vtex-apps/awesome-io#lts-policy) for more information.

## Table of Contents
- [Usage](#usage)
  - [Blocks API](#blocks-api)
    - [Configuration](#configuration)
  - [Styles API](#styles-api)
    - [CSS namespaces](#css-namespaces)
- [Troubleshooting](#troubleshooting)
- [Tests](#tests)

## Usage

This app uses our store builder with the blocks architecture. To know more about Store Builder [click here.](https://help.vtex.com/en/tutorial/understanding-storebuilder-and-stylesbuilder#structuring-and-configuring-our-store-with-object-object)

We add the login as a block in our [Store Header](https://github.com/vtex-apps/store-header/blob/master/store/interfaces.json).

To configure or customize this app, you need to import it in your dependencies in `manifest.json`.

```json
  "dependencies": {
    "vtex.login": "2.x"
  }
```

Then, add `login` or `login-content` block into your app theme as we do in our [Store theme app](https://github.com/vtex-apps/store-theme/blob/master/store/blocks.json). `login-content` is just the login form and `login` contains the login form and adds the possibility of other display modes such as pop-up.

Now, you can change the behavior of the `login` block that is in the store header. See an example of how to configure:

```json
"login": {
  "props": {
    "emailAndPasswordTitle": "LOG-IN",
    "accessCodeTitle": "Acess Code LOG-IN",
    "emailPraceholder": "e-mail",
    "passwordPlaceholder": "password",
    "showPasswordVerificationIntoTooltip": true,
  }
}
```

### Blocks API

When implementing this app as a block, various inner blocks may be available. The following interface lists the available blocks within `login` and `login-content` and describes if they are required or optional.

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

For now these blocks do not have any required or optional blocks.

#### Configuration 
Through the Storefront, you can change the `login`'s behavior and interface. However, you also can make in your theme app, as Store theme does.

Prop name | Type | Description | Default value
--------- | ---- | ----------- | -------------
`optionsTitle` | `String` | Set title of login options | 
`emailAndPasswordTitle` | `String` | Set title of login with email and password | 
`accessCodeTitle` | `String` | Set title of login by access code |
`emailPlaceholder` | `String` | Set placeholder to email input |
`passwordPlaceholder` | `String` | Set placeholder to password input |
`showPasswordVerificationIntoTooltip` | `Boolean` | Set show password format verification as tooltip |
`acessCodePlaceholder` | `String` | Set placeholder to access code input |

You can also change the `login-content`'s behaviour and interface through the Store front.

Prop name | Type | Description | Default value
--------- | ---- | ----------- | -------------
`isInitialScreenOptionOnly` | `Boolean` | Set to show only the login options on the initial screen |
`defaultOption` | `Enum` | Set the initial form to show. 0 for access code login, 1 for email and password login |
`optionsTitle` | `String` | Set title of login options | 
`emailAndPasswordTitle` | `String` | Set title of login with email and password | 
`accessCodeTitle` | `String` | Set title of login by access code |
`emailPlaceholder` | `String` | Set placeholder to email input |
`passwordPlaceholder` | `String` | Set placeholder to password input |
`showPasswordVerificationIntoTooltip` | `Boolean` | Set show password format verification as tooltip |
`acessCodePlaceholder` | `String` | Set placeholder to access code input |

### Styles API

This app provides some CSS classes as an API for style customization.

To use this CSS API, you must add the `styles` builder and create an app styling CSS file.

1. Add the `styles` builder to your `manifest.json`:

```json
  "builders": {
    "styles": "1.x"
  }
```

2. Create a file called `vtex.login.css` inside the `styles/css` folder. Add your custom styles:

```css
.container {
  margin-top: 10px;
}
```

#### CSS namespaces
:construction: :construction: :construction:

## Troubleshooting
You can check if others are passing through similar issues [here](https://github.com/vtex-apps/login/issues). Also feel free to [open issues](https://github.com/vtex-apps/login/issues/new) or contribute with pull requests.

## Tests
:construction: :construction: :construction: