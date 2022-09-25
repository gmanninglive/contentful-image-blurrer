/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from 'react';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import FieldView from './FieldView';
import { render, cleanup, configure, screen } from '@testing-library/react';

configure({
  testIdAttribute: 'data-test-id',
});

function renderComponent(sdk: FieldExtensionSDK) {
  return render(<FieldView sdk={sdk as FieldExtensionSDK} />);
}

const sdk: any = {
  field: {
    getValue: jest.fn(),
    onValueChanged: jest.fn(() => jest.fn),
    setValue: jest.fn(),
    removeValue: jest.fn(),
  },
  window: {
    startAutoResizer: jest.fn(),
  },
  entry: {
    fields: {
      image: {
        getValue: jest.fn(),
        onValueChanged: jest.fn(() => jest.fn),
        setValue: jest.fn(),
        removeValue: jest.fn(),
      },
    },
  },
};

describe('FieldView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(cleanup);

  it('should read a value from field.getValue() and subscribe for external changes', () => {
    sdk.field.getValue.mockImplementation(() => ({
      img: 'test',
    }));

    renderComponent(sdk);

    expect(sdk.field.getValue).toHaveBeenCalled();
    expect(screen.getByTestId('blurDataField')).toBeVisible();
  });

  it('should call startAutoResizer', () => {
    renderComponent(sdk);
    expect(sdk.window.startAutoResizer).toHaveBeenCalled();
  });
});
