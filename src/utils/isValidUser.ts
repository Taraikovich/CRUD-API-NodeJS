import { User } from '../DB/usersDB';

const isValidUser = (user: any): user is User => {
  return (
    typeof user === 'object' &&
    Object.keys(user).length === 3 &&
    'username' in user &&
    'age' in user &&
    'hobbies' in user &&
    typeof user.username === 'string' &&
    typeof user.age === 'number' &&
    Array.isArray(user.hobbies)
  );
};

export default isValidUser;
