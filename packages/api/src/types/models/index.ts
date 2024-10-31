import { Document, Types } from 'mongoose';

export interface IOrganization extends Document {
  name: string;
  supervisors: Types.ObjectId[];
}

export interface ISupervisor extends Document {
  organization: Types.ObjectId;
  name: string;
  username: string;
  password: string;
  users: Types.ObjectId[];
}

export interface IUser extends Document {
  name: string;
  username: string;
  password: string;
  role: string;
}