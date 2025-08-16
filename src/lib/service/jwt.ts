import jwt from "jsonwebtoken";

type payload = {
  id: string;
};
export const generateToken = (data: payload) => {
  const token = jwt.sign(data, process.env.TOKEN_KEY as string);
  return token;
};
export const verifyToken = (token: string) => {
  try {
    const data = jwt.verify(token, process.env.TOKEN_KEY as string) as payload;
    return data;
  } catch (error) {
    return null;
  }
};
