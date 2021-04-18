import React, { ComponentType, ReactElement } from 'react';
import '../styles/global.css';

interface Props {
  Component: ComponentType;
  pageProps: any;
}

export default function App({ Component, pageProps }: Props): ReactElement {
  return <Component {...pageProps} />;
}
