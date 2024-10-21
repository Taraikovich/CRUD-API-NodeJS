import { ServerResponse, IncomingMessage } from 'node:http';
import { UrlWithParsedQuery } from 'node:url';

import { usersDB } from '../DB/usersDB';
import isValidUser from '../utils/isValidUser';
import isValidUUID from '../utils/isValidUUID';
import { CONTENT_TYPE_JSON } from '../constants/constants';
import sendResponse from '../utils/sendResponse';

const handlePutRequest = (
  req: IncomingMessage,
  res: ServerResponse,
  parsedUrl: UrlWithParsedQuery
) => {
  let requstBody = '';

  req.on('data', (chunk) => {
    requstBody += chunk;
  });

  req.on('end', () => {
    try {
      const updatedUser = JSON.parse(requstBody);
      const userId = parsedUrl.path?.split('/').pop();

      if (!userId || !isValidUUID(userId)) {
        sendResponse(res, 400, CONTENT_TYPE_JSON, {
          error: 'Invalid user ID',
        });
        return;
      }

      const userIndex = usersDB.findIndex((user) => user.id === userId);

      if (userIndex !== -1) {
        if (isValidUser(updatedUser)) {
          const user = { ...usersDB[userIndex], ...updatedUser };
          usersDB[userIndex] = user;
          sendResponse(res, 200, CONTENT_TYPE_JSON, user);
        } else {
          sendResponse(res, 400, CONTENT_TYPE_JSON, {
            error: 'Invalid user data for update',
          });
        }
      } else {
        sendResponse(res, 404, CONTENT_TYPE_JSON, { error: 'User not found' });
      }
    } catch (error) {
      sendResponse(res, 500, CONTENT_TYPE_JSON, {
        error: 'Internal Server Error. Failed to process request.',
      });
    }
  });

  req.on('error', (error) => {
    console.error('Error receiving PUT request data:', error);
    sendResponse(res, 500, CONTENT_TYPE_JSON, {
      error: 'Error receiving data',
    });
  });
};

export default handlePutRequest;
