import { RequestHandler } from 'express';
import { getPlaiceholder } from 'plaiceholder';

export const generateBlurData: RequestHandler = async (req, res) => {
  const imageURL: string | undefined = req.query.imageURL || req.body.imageURL;

  if (imageURL) {
    const blurData = await getPlaiceholder(imageURL);
    res.status(200).json(blurData);
  } else {
    res.status(400).send('missing image url paramete');
  }
};
