import { Request } from 'express';

export default interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    role: string;
  };
}
