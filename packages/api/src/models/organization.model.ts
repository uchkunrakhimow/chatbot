import { model, Schema } from 'mongoose'
import { IOrganization } from '../types/models'

const OrganizationSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    supervisors: [{ type: Schema.Types.ObjectId, ref: 'Supervisor' }],
  },
  { timestamps: true, versionKey: false, collection: 'organizations' },
)

export const Organization = model<IOrganization>(
  'Organization',
  OrganizationSchema,
)
