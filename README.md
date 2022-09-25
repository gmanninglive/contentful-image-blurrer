<img src="https://github.com/gmanninglive/contentful-image-blurrer/blob/main/src/logo.jpg?raw=true" alt="contentful-image-blurrer" width="100" align="right" />

# Contentful Image Blurrer

![CI](https://github.com/gmanninglive/contentful-image-blurrer/actions/workflows/firebase-hosting-merge.yml/badge.svg)

## Overview

The Contentful Image Blurrer app auto generates image blur data when you update an image on an entry. It is possible to use within a custom Image content type, or directly on Component content types. You can customise the image field id that is referenced on each instance ( defaults to `image` ).

The app has two parts intended to be hosted by firebase. The **_frontend_** react app and the **_backend_** firebase cloud function.

The cloud function [generateBlurData](./functions/src/generateBlurData.ts) uses the [plaiceholder library](https://github.com/joe-bell/plaiceholder) to generate the blur data. This give's you the freedom to choose between `base64`, `blurhash`, `css`, and `svg` outputs.

## Requirements

To use this app, you will need:

- A Contentful space to install
- A Firebase account with access to functions

## Usage

### Step 1: Install and configure

**_TODO_**
