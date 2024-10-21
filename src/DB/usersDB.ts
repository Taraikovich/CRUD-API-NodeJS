export type User = {
  id?: string;
  username: string;
  age: number;
  hobbies: string[] | [];
};

export const usersDB: User[] = [
  {
    id: 'b3f71f90-2921-42fe-941b-7484b2aa7b07',
    username: 'Igor',
    age: 38,
    hobbies: ['soccer', 'tennis', 'programing'],
  },
  {
    id: 'b3f71f90-2921-42fe-941b-7484b2aa7b05',
    username: 'Avtandil',
    age: 32,
    hobbies: ['soccer', 'haircut'],
  },
];
