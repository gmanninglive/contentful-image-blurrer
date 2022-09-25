const { generateBlurData } = require('./generateBlurData');
const httpMocks = require('node-mocks-http');

describe('generateBlurData', () => {
  it('#GET, returns blur data object for image', async () => {
    var request = httpMocks.createRequest({
      method: 'GET',
      url: '/?imageURL=https://via.placeholder.com/150.jpg',
    });

    const response = httpMocks.createResponse();
    await generateBlurData(request, response);
    const data = await response._getJSONData();

    expect(response.statusCode).toEqual(200);
    expect('img' in data).toBe(true);
    expect('css' in data).toBe(true);
    expect('base64' in data).toBe(true);
    expect('blurhash' in data).toBe(true);
    expect('svg' in data).toBe(true);
  });
  it('#POST, returns blur data object for image', async () => {
    var request = httpMocks.createRequest({
      method: 'POST',
      url: '/',
      body: { imageURL: 'https://via.placeholder.com/150.jpg' },
    });

    const response = httpMocks.createResponse();
    await generateBlurData(request, response);
    const data = await response._getJSONData();

    expect(response.statusCode).toEqual(200);
    expect('img' in data).toBe(true);
    expect('css' in data).toBe(true);
    expect('base64' in data).toBe(true);
    expect('blurhash' in data).toBe(true);
    expect('svg' in data).toBe(true);
  });
  it('returns 400 error if image url missing', async () => {
    var request = httpMocks.createRequest({
      method: 'GET',
      url: '/',
    });

    const response = httpMocks.createResponse();
    await generateBlurData(request, response);
    expect(response.statusCode).toEqual(400);
  });
});
