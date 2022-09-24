import { getPlaiceholder } from 'plaiceholder';

exports.generateBlurData = async (req, res) => {
  const imageURL = req.query.imageURL || req.body.imageURL;

  if (imageURL) {
    const blurData = await getPlaiceholder(imageURL);
    res.status(200).json(blurData);
  } else {
    res.status(400).send('missing image url paramete');
  }
};
