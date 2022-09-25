import React, { memo, useEffect, useMemo, useState } from 'react';
import { AppExtensionSDK, FieldExtensionSDK, KnownSDK, Link, locations } from '@contentful/app-sdk';
import './index.css';
import FieldView from './components/FieldView';
import AppView from './components/AppView';

interface AppProps {
  sdk: KnownSDK;
}

const App: React.FC<AppProps> = ({ sdk }) => {
  if (sdk.location.is(locations.LOCATION_APP_CONFIG)) {
    return <AppView sdk={sdk as AppExtensionSDK} />;
  }

  if (sdk.location.is(locations.LOCATION_ENTRY_FIELD)) {
    return <FieldView sdk={sdk as FieldExtensionSDK} />;
  }

  return null;
};

export default App;
