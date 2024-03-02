export const User_Role = {
  admin: 'admin',
  seller: 'seller',
  user: 'user',
} as const;

export type TUserType = keyof typeof User_Role;
