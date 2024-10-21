import { ServerResponse, IncomingMessage } from 'node:http';
import { UrlWithParsedQuery } from 'node:url';

import { usersDB } from '../DB/usersDB';
import isValidUUID from '../utils/isValidUUID';
import { CONTENT_TYPE_HTML, CONTENT_TYPE_JSON } from '../constants/constants';
import sendResponse from '../utils/sendResponse';

const handleGetRequest = (
  req: IncomingMessage,
  res: ServerResponse,
  parsedUrl: UrlWithParsedQuery
) => {
  const { path } = parsedUrl;

  if (path === '/') {
    sendResponse(
      res,
      200,
      CONTENT_TYPE_HTML,
      `<b>Users <a href = '/api/users'>list</a> page</b>`
    );
    return;
  }

  if (path === '/api/users') {
    sendResponse(res, 200, CONTENT_TYPE_JSON, usersDB);
    return;
  }

  if (path?.startsWith('/api/users/')) {
    const userId = path.split('/').pop();

    if (!userId || !isValidUUID(userId)) {
      sendResponse(res, 400, CONTENT_TYPE_JSON, { error: 'Invalid user ID' });
      return;
    }

    const user = usersDB.find((user) => user.id === userId);
    if (user) {
      sendResponse(res, 200, CONTENT_TYPE_JSON, user);
    } else {
      sendResponse(res, 404, CONTENT_TYPE_JSON, { error: 'User not found' });
    }
    return;
  }

  sendResponse(res, 404, CONTENT_TYPE_JSON, { error: 'User not found' });
};

export default handleGetRequest;
