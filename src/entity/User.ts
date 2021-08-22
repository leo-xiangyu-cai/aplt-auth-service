import { model, Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { getConfig } from '../Configs';

const collectionName = 'User';

export interface User {
  userId: string;
  username: string;
  email: string;
  password: string;
  createDate: Date;
  permissions: string[];
}

const userSchema = new Schema<User>({
  userId: { type: String, default: () => uuid() },
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  createDate: { type: Date, default: Date.now },
  permissions: [{
    type: String,
  }],
});

export const UserEntity = model<User>(
  getConfig().env.includes('Unit Test')
    ? `${collectionName}-${uuid()}-test`
    : collectionName, userSchema,
);
