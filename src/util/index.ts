export { default as getStringErrorPage } from './getStringErrorPage';
export { default as getObjectPaths } from './getObjectPaths';
export * from './arrayUtils';

export const isProdEnv = process.env.NODE_ENV === 'production';
