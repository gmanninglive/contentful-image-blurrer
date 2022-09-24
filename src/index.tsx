import React from 'react';
import { render } from 'react-dom';
import App from './App';
import { init, FieldExtensionSDK } from 'contentful-ui-extensions-sdk';

init((sdk) => {
  render(<App sdk={sdk as FieldExtensionSDK} />, document.getElementById('root'));
});
