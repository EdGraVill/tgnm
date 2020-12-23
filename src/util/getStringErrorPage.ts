import * as React from 'react';
import { renderToString } from 'react-dom/server';
import ErrorComponent, { ErrorProps } from 'next/error';

export default function getStringErrorPage(statusCode: number, title?: string) {
  return renderToString(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    React.createElement((ErrorComponent as unknown) as React.ComponentClass<ErrorProps, any>, {
      statusCode,
      title,
    }),
  );
}
