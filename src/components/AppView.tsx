import React, { Component } from 'react';
import {
  Heading,
  Typography,
  Paragraph,
  TextInput,
  Form,
  FormLabel,
} from '@contentful/f36-components';
import { styles } from '../styles/application';
//@ts-ignore
import appLogo from '../logo.jpg';
import { AppExtensionSDK } from '@contentful/app-sdk';

export interface AppInstallationParameters {}

interface AppViewProps {
  sdk: AppExtensionSDK;
}

interface AppViewState {
  isInstalled: boolean;
  allContentTypes: any;
  apiBase: string;
}

export default class AppView extends Component<AppViewProps, AppViewState> {
  constructor(props: AppViewProps) {
    super(props);
    this.state = { isInstalled: false, allContentTypes: [], apiBase: '' };

    props.sdk.app.onConfigure(() => this.onConfigure());
  }

  async componentDidMount() {
    const { app, space } = this.props.sdk;

    const [isInstalled, allContentTypes, parameters] = await Promise.all([
      app.isInstalled(),
      space.getContentTypes(),
      app.getParameters(),
    ]);

    this.setState(
      parameters
        ? { isInstalled, allContentTypes, apiBase: parameters?.apiBase || '' }
        : this.state,
      () => {
        this.props.sdk.app.setReady();
      }
    );
  }

  async onConfigure() {
    const sdk = this.props.sdk;
    const { isInstalled, apiBase } = this.state;
    const currentState = await sdk.app.getCurrentState();
    if (isInstalled) {
      sdk.notifier.success('The app is already fully configured.');
      return false;
    }

    if (!apiBase) {
      sdk.notifier.success('Please specify the api base endpoint parameter');
      return false;
    }
    return {
      parameters: { apiBase },
      targetState: {
        EditorInterface: {
          ...currentState?.EditorInterface,
        },
      },
    };
  }

  onApiBaseChange = (e: any) => {
    e.preventDefault();
    this.setState({ apiBase: e.target.value });
  };

  render() {
    const { apiBase } = this.state;
    return (
      <>
        <div className={styles.background} />
        <div className={styles.body}>
          <Typography>
            <Heading className={styles.heading}>Image Blurrer</Heading>
            <Paragraph>
              The Image Blurrer App generates a blur data automatically when an image field is
              updated on an entry. A firebase cloud function handles running the getPlaiceholder
              function on the image src.
            </Paragraph>
            <Form>
              <FormLabel htmlFor="apiBase">Blur Function Api Route</FormLabel>
              <TextInput
                className={styles.input}
                name="apiBase"
                value={apiBase}
                onChange={this.onApiBaseChange}
                id="api-base"
                testId="api-base"
              />
            </Form>
          </Typography>
        </div>
        <div className={styles.logo}>
          <img src={appLogo} alt="logo" />
        </div>
      </>
    );
  }
}
