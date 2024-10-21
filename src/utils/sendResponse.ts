import { ServerResponse } from 'node:http';

import { User } from '../DB/usersDB';

type ErrorMessage = { error: string };

const sendResponse = (
  res: ServerResponse,
  statusCode: number,
  contentType: { [key: string]: string },
  data: User | User[] | ErrorMessage | string
) => {
  res.writeHead(statusCode, contentType);
  res.end(JSON.stringify(data));
};

export default sendResponse;
