import jwt, { JwtPayload } from 'jsonwebtoken';

export const verifyToken = (
  token: string,
  secret: string,
): JwtPayload | null => {
  const data = jwt.verify(token, secret);
  return data as JwtPayload;
};
