import { createServer } from 'node:http';
import { parse } from 'node:url';
import dotenv from 'dotenv';

import handleGetRequest from './handlers/handleGetRequest';
import handlePostRequest from './handlers/handlePostRequest';
import handlePutRequest from './handlers/handlePutRequest';
import handleDeleteRequest from './handlers/handleDeleteRequest';
import sendResponse from './utils/sendResponse';
import { CONTENT_TYPE_JSON } from './constants/constants';

dotenv.config();

export const server = createServer((req, res) => {
  const parsedUrl = parse(req.url!, true);

  if (req.method === 'GET') {
    handleGetRequest(req, res, parsedUrl);
  } else if (req.method === 'POST' && parsedUrl.path === '/api/users') {
    handlePostRequest(req, res);
  } else if (
    req.method === 'PUT' &&
    parsedUrl.path?.startsWith('/api/users/')
  ) {
    handlePutRequest(req, res, parsedUrl);
  } else if (
    req.method === 'DELETE' &&
    parsedUrl.path?.startsWith('/api/users/')
  ) {
    handleDeleteRequest(req, res, parsedUrl);
  } else {
    sendResponse(res, 404, CONTENT_TYPE_JSON, { error: 'Method not allowed' });
  }
});

server.on('error', (error) => {
  console.error('Server error:', error);
});

server.listen(process.env.PORT, () => {
  console.log(
    `Users server listening on ${process.env.PORT} (In-memory database)`
  );
});
