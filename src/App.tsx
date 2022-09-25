import React, { useEffect, useState } from 'react';
import { FieldExtensionSDK, Link } from '@contentful/app-sdk';
import './index.css';

interface AppProps {
  sdk: FieldExtensionSDK;
}

const App: React.FC<AppProps> = ({ sdk }) => {
  const apiBase = sdk.parameters?.instance?.apiEndpoint || process.env.API_ENDPOINT;
  const imageFieldID = sdk.parameters.instance?.imageFieldID || 'image';

  const [state, setState] = useState({
    value: sdk.field.getValue() || {},
  });

  const getBlurData = async (imageURL: string) => {
    const endpoint = `${apiBase}?imageURL=${imageURL}`;
    const res = await fetch(endpoint);
    return await res.json();
  };

  const getImageURL = (asset: any): string => {
    const file = asset.fields.file;
    const firstLocale = Object.keys(file)[0];

    return 'https:' + file[firstLocale].url;
  };

  const onImageChanged = async (value: Link) => {
    const imageId: string | undefined = value?.sys?.id;
    if (!imageId) {
      return await sdk.field.setValue({});
    }
    const asset = await sdk.space.getAsset(imageId);
    const imageURL = getImageURL(asset);

    if (state?.value?.img?.src === imageURL) return;

    const blurData = await getBlurData(imageURL);

    if (blurData) {
      setState({ value });
      if (value) {
        await sdk.field.setValue(blurData);
      } else {
        await sdk.field.removeValue();
      }
    }
  };

  const onExternalChange = (value: string) => {
    setState({ value });
  };

  useEffect(() => {
    sdk.window.startAutoResizer();
    const detachImageChangeHandler = sdk.entry.fields[imageFieldID].onValueChanged(onImageChanged);
    const detachExternalChangeHandler = sdk.field.onValueChanged(onExternalChange);
    return () => {
      detachExternalChangeHandler();
      detachImageChangeHandler();
    };
  }, []);

  return <div>{JSON.stringify(state.value, null, 2)}</div>;
};

export default App;
