export const loginSchema = {
  optionsTitle: {
    title: 'editor.login.optionsTitle',
    type: 'string',
    widget: {
      'ui:widget': 'textarea',
    },
  },
  emailAndPasswordTitle: {
    title: 'editor.login.emailAndPasswordTitle',
    type: 'string',
    widget: {
      'ui:widget': 'textarea',
    },
  },
  accessCodeTitle: {
    title: 'editor.login.accessCodeTitle',
    type: 'string',
    widget: {
      'ui:widget': 'textarea',
    },
  },
  emailPlaceholder: {
    title: 'editor.login.emailPlaceholder',
    type: 'string',
  },
  passwordPlaceholder: {
    title: 'editor.login.passwordPlaceholder',
    type: 'string',
  },
  passwordVerificationType: {
    title: 'editor.login.passwordVerificationType.title',
    type: 'string',
    default: 'tooltip',
    enum: ['tooltip', 'box'],
    enumNames: [
      'editor.login.passwordVerificationType.tooltip',
      'editor.login.passwordVerificationType.box',
    ],
    widget: {
      'ui:widget': 'radio',
      'ui:options': {
        'inline': true,
      },
    },
    isLayout: true,
  },
  accessCodePlaceholder: {
    title: 'editor.login.accessCodePlaceholder',
    type: 'string',
  },
}
