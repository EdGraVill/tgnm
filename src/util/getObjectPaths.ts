// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getObjectPaths = (object: Record<string, any>, path = ''): string[] =>
  Object.keys(object)
    .map((key) => {
      if (object[key] instanceof Array || typeof object[key] !== 'object') {
        return `${path ? `${path}.` : ''}${key}`;
      }

      return getObjectPaths(object[key], `${path ? `${path}.` : ''}${key}`);
    })
    .flat(Infinity) as string[];

export default getObjectPaths;
