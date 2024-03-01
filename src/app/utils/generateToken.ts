import jwt, { JwtPayload } from 'jsonwebtoken';

export const createToken = (
  data: JwtPayload,
  jwtSecret: string,
  expiresIn: string | number,
) => {
  const token = jwt.sign(data, jwtSecret, {
    expiresIn,
  });
  return token;
};
