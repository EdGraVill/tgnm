import { LangType } from './en-US';

const lang: LangType = {
  db: {
    Account: {
      errors: {
        emailDuplicated: 'La dirección de correo electrónico "{{email}}" ya está en uso',
        emailRequired: 'Correo electrónico requerido',
        emailInvalid: 'Correo electrónico inválido',
        passwrodRequired: 'Contraseña requerida',
        passwordRequireANumber: 'La contraseña requiere al menos un número',
        passwordRequireAnUpper: 'La contraseña requiere al menos una letra mayúscula',
        passwordRequire8Chars: 'La contraseña requiere al menos 8 caracteres',
        wrongPassword: 'Contraseña incorrecta',
      },
    },
    Session: {
      errors: {
        wrongCredentials: 'Credenciales incorrectas',
      },
    },
  },
  client: {
    index: {
      welcomeTo: 'Bienvenido a',
      getStarted: 'Inicia editando',
      documentation: {
        title: 'Documentación',
        description: 'Encuentra información detallada sobre la API y características de Next.js.',
      },
      learn: {
        title: 'Aprende',
        description: '¡Aprende sobre Next.js en un curso interactivo con pruebas!',
      },
      examples: {
        title: 'Ejemplos',
        description: 'Descubre y despliega proyectos Next.js de ejemplo.',
      },
      deploy: {
        title: 'Despliega',
        description: 'Despliega instantaneamente tu sitio de Next.js a una URL pública con Vercel.',
      },
      otherLangage: 'To see this site in english, go to',
      poweredBy: 'Desarrollado por',
    },
  },
  common: {
    unexpectedError: 'Error inesperado',
  },
};

export default lang;
