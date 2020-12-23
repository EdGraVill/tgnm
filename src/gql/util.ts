import { GraphQLResolveInfo } from 'graphql';

export const getSelectedFields = (
  info: GraphQLResolveInfo,
): {
  [fieldName: string]: 1;
} =>
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-explicit-any
  info.fieldNodes[0]!.selectionSet!.selections.map((selection) => (selection as any)?.name.value).reduce(
    (prev, curr) => ({ ...prev, [curr]: 1 }),
    {},
  );
