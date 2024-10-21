import { ServerResponse, IncomingMessage } from 'node:http';
import { randomUUID } from 'node:crypto';

import { usersDB } from '../DB/usersDB';
import isValidUser from '../utils/isValidUser';
import { CONTENT_TYPE_JSON } from '../constants/constants';
import sendResponse from '../utils/sendResponse';

const handlePostRequest = (req: IncomingMessage, res: ServerResponse) => {
  let requstBody = '';

  req.on('data', (chunk) => {
    requstBody += chunk;
  });

  req.on('end', () => {
    try {
      const user = JSON.parse(requstBody);
      if (isValidUser(user)) {
        user.id = randomUUID();
        usersDB.push(user);
        sendResponse(res, 201, CONTENT_TYPE_JSON, user);
      } else {
        sendResponse(res, 400, CONTENT_TYPE_JSON, {
          error: 'Invalid user data',
        });
      }
    } catch (error) {
      sendResponse(res, 500, CONTENT_TYPE_JSON, {
        error: 'Internal Server Error. Failed to process request.',
      });
    }
  });

  req.on('error', (error) => {
    console.error('Error receiving POST request data:', error);
    sendResponse(res, 500, CONTENT_TYPE_JSON, {
      error: 'Error receiving data',
    });
  });
};

export default handlePostRequest;
