/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from 'react';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import App from './App';
import {
  render,
  fireEvent,
  cleanup,
  configure,
  getByLabelText,
  screen,
} from '@testing-library/react';

configure({
  testIdAttribute: 'data-test-id',
});

function renderComponent(sdk: FieldExtensionSDK) {
  return render(<App sdk={sdk as FieldExtensionSDK} />);
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

describe('App', () => {
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

  // it('should call startAutoResizer', () => {
  //   renderComponent(sdk);
  //   expect(sdk.window.startAutoResizer).toHaveBeenCalled();
  // });

  // it('should call setValue on every change in input and removeValue when input gets empty', () => {
  //   const { getByTestId } = renderComponent(sdk);

  //   fireEvent.change(getByTestId('my-field'), {
  //     target: { value: 'new-value' },
  //   });

  //   expect(sdk.field.setValue).toHaveBeenCalledWith('new-value');

  //   fireEvent.change(getByTestId('my-field'), {
  //     target: { value: '' },
  //   });

  //   expect(sdk.field.setValue).toHaveBeenCalledTimes(1);
  //   expect(sdk.field.removeValue).toHaveBeenCalledTimes(1);
  // });
});
