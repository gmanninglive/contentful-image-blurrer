import React, { useEffect, useState } from 'react';
import { FieldExtensionSDK, Link } from '@contentful/app-sdk';
import { Textarea } from '@contentful/f36-components';

interface FieldViewProps {
  sdk: FieldExtensionSDK;
}

const FieldView: React.FC<FieldViewProps> = ({ sdk }) => {
  const apiBase: string = sdk.parameters?.installation?.apiEndpoint || process.env.API_ENDPOINT;
  const imageFieldID: string = sdk.parameters?.instance?.imageFieldID || 'image';

  const [state, setState] = useState({
    value: sdk.field.getValue(),
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
      return await sdk.field.removeValue();
    }
    const asset = await sdk.space.getAsset(imageId);
    const imageURL = getImageURL(asset);

    // This function is triggered on mount we check if the image url
    // is different to the image url stored in the blur data
    // To avoid unnecessary api calls
    if (state?.value?.img?.src.includes(imageURL)) return;

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

  return (
    <>
      {state.value && (
        <div data-test-id="blurDataField">
          <Textarea value={JSON.stringify(state.value, null, 2)} rows={20} isDisabled={true} />
        </div>
      )}
    </>
  );
};

export default FieldView;
