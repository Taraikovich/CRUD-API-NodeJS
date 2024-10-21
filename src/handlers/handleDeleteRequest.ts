import { ServerResponse, IncomingMessage } from 'node:http';
import { UrlWithParsedQuery } from 'node:url';

import { usersDB } from '../DB/usersDB';
import isValidUUID from '../utils/isValidUUID';
import { CONTENT_TYPE_JSON } from '../constants/constants';
import sendResponse from '../utils/sendResponse';

const handleDeleteRequest = (
  req: IncomingMessage,
  res: ServerResponse,
  parsedUrl: UrlWithParsedQuery
) => {
  const userId = parsedUrl.path?.split('/').pop();

  if (!userId || !isValidUUID(userId)) {
    sendResponse(res, 400, CONTENT_TYPE_JSON, {
      error: 'Invalid user ID',
    });
    return;
  }

  const userIndex = usersDB.findIndex((user) => user.id === userId);

  if (userIndex !== -1) {
    const deletedUser = usersDB.splice(userIndex, 1)[0];
    sendResponse(res, 200, CONTENT_TYPE_JSON, deletedUser);
  } else {
    sendResponse(res, 404, CONTENT_TYPE_JSON, { error: 'User not found' });
  }
};

export default handleDeleteRequest;
