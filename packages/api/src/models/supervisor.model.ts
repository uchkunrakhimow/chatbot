import { model, Schema } from 'mongoose';
import { ISupervisor } from '../types/models';

const SupervisorSchema: Schema = new Schema({
  organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true, versionKey: false, collection: 'supervisors' });

export const Supervisor = model<ISupervisor>('Supervisor', SupervisorSchema);