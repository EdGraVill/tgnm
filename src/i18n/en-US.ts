const lang = {
  db: {
    Account: {
      errors: {
        emailDuplicated: 'Email "{{email}}" alredy registered',
        emailRequired: 'Email required',
        emailInvalid: 'Invalid email',
        passwrodRequired: 'Password required',
        passwordRequireANumber: 'Password requires at least one number',
        passwordRequireAnUpper: 'Password requires at least one upper case letter',
        passwordRequire8Chars: 'Password requires at least 8 characters',
        wrongPassword: 'Wrong password',
      },
    },
    Session: {
      errors: {
        wrongCredentials: 'Wrong credentials',
      },
    },
  },
  common: {
    unexpectedError: 'Unexpected error',
  },
};

export type LangType = typeof lang;

export default lang;
