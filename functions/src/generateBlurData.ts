import * as functions from 'firebase-functions';
import { getPlaiceholder } from 'plaiceholder';

export const generateBlurData = functions.https.onRequest(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  switch (req.method) {
    case 'OPTIONS': {
      functions.logger.info('Preflight', { headers: req.headers });
      // Send response to OPTIONS requests
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
      );
      res.setHeader('Access-Control-Max-Age', '3600');
      res.status(204).send('');
      break;
    }
    case 'GET':
    case 'POST': {
      const imageURL = req.query.imageURL || req.body.imageURL;
      if (imageURL) {
        const blurData = await getPlaiceholder(imageURL);
        res.status(200).json(blurData);
      } else {
        res.status(400).json({ message: 'Missing imageURL parameter' });
      }
      break;
    }
    default: {
      res.status(400).json({ message: 'Allowed Methods: GET, OPTIONS, POST' });
      break;
    }
  }
});
