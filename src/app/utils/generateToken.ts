import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../configs/config';
export const createToken = (data: JwtPayload, expiresIn: string | number) => {
  const token = jwt.sign(data, config.jwt_activate_token as string, {
    expiresIn,
  });
  return token;
};
