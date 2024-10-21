export type User = {
  id?: string;
  username: string;
  age: number;
  hobbies: string[] | [];
};

export const usersDB: User[] = [];
