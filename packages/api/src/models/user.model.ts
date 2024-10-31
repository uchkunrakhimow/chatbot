import { model, Schema } from 'mongoose';
import { IUser } from '../types/models';

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
  role: { type: String, required: true, default: "user", enum: ['admin', 'user'], },
}, { timestamps: true, versionKey: false, collection: 'users' });

export const User = model<IUser>('User', UserSchema);