export const removeDuplicatedString = (arr: string[]) => {
  const uniqueMap = arr.reduce(
    (prev, curr) => ({
      ...prev,
      [curr]: true,
    }),
    {},
  );

  return Object.keys(uniqueMap);
};
