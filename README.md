# VTEX Login

## Description
The VTEX Login app allows the user to register into the store and checkout. This is a VTEX app that is used by Dreamstore product.

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

## Usage

This app uses our store builder with the blocks architecture. To know more about Store Builder [click here.](https://help.vtex.com/en/tutorial/understanding-storebuilder-and-stylesbuilder#structuring-and-configuring-our-store-with-object-object)

To use this app you need to add it in your `dependencies` in the `manifest.json` file.

```json
  dependencies: {
    "vtex.login: 2.x"
  }
```

Then, add `login` block into our app theme, like we do in our [Dreamstore app](https://github.com/vtex-apps/dreamstore/blob/master/store/blocks.json).

### Blocks API
:construction: :construction: :construction:

This app has an interface that describes what rules must be implemented by a block when you want to use the login. 

```json
"login": {
  "component": "Login"
},
"login-content": {
  "component": "LoginContent"
}
```