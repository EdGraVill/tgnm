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
  client: {
    index: {
      welcomeTo: 'Welcome to',
      getStarted: 'Get started by editing',
      documentation: {
        title: 'Documentation',
        description: 'Find in-depth information about Next.js features and API.',
      },
      learn: {
        title: 'Learn',
        description: 'Learn about Next.js in an interactive course with quizzes!',
      },
      examples: {
        title: 'Examples',
        description: 'Discover and deploy boilerplate example Next.js projects.',
      },
      deploy: {
        title: 'Deploy',
        description: 'Instantly deploy your Next.js site to a public URL with Vercel.',
      },
      otherLangage: 'Para ver este sitio en español, visita',
      poweredBy: 'Powered by',
    },
  },
  common: {
    unexpectedError: 'Unexpected error',
  },
};

export type LangType = typeof lang;

export default lang;
