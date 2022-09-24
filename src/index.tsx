import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { TextInput } from '@contentful/forma-36-react-components';
import { init, FieldExtensionSDK, Link } from 'contentful-ui-extensions-sdk';
import { encode } from 'blurhash';

import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';

interface AppProps {
  sdk: FieldExtensionSDK;
}

const loadImage = async (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => resolve(img);
    img.onerror = (...args) => reject(args);

    img.src = src;
  });

const getImageData = (image: HTMLImageElement) => {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext('2d');
  if (!context) return null;
  context.drawImage(image, 0, 0);

  return context.getImageData(0, 0, image.width, image.height);
};

const encodeImageToBlurhash = async (imageUrl: string) => {
  console.log('triggered');
  const image = await loadImage(imageUrl);
  const imageData = getImageData(image);
  if (!imageData) return null;
  return encode(imageData.data, imageData.width, imageData.height, 4, 4);
};

const getImageURL = (asset: any): string => {
  const file = asset.fields.file;
  const firstLocale = Object.keys(file)[0];

  return 'https:' + file[firstLocale].url;
};

export const App: React.FC<AppProps> = ({ sdk }) => {
  const [state, setState] = useState({
    value: sdk.field.getValue() || '',
  });

  const onImageChanged = async (value: Link) => {
    const imageId: string | undefined = value?.sys?.id;
    if (!imageId) {
      return await sdk.field.setValue('');
    }
    const asset = await sdk.space.getAsset(imageId);
    const imageURL = getImageURL(asset);

    const blurHash = await encodeImageToBlurhash(imageURL);

    if (blurHash) {
      setState({ value: blurHash });
      await sdk.field.setValue(blurHash);
    }
  };

  const onExternalChange = (value: string) => {
    setState({ value });
  };

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setState({ value });
    if (value) {
      await sdk.field.setValue(value);
    } else {
      await sdk.field.removeValue();
    }
  };

  useEffect(() => {
    sdk.window.startAutoResizer();
    sdk.entry.fields['image'].onValueChanged(onImageChanged);
    const detachExternalChangeHandler = sdk.field.onValueChanged(onExternalChange);
    return () => {
      detachExternalChangeHandler();
    };
  }, []);

  return (
    <TextInput
      width="large"
      type="text"
      id="my-field"
      testId="my-field"
      value={state.value}
      onChange={onChange}
      disabled
    />
  );
};

init((sdk) => {
  render(<App sdk={sdk as FieldExtensionSDK} />, document.getElementById('root'));
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
