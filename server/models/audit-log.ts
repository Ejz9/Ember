import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: ['created', 'updated', 'deleted']
  },
  snippetId: {
    type: String,
    required: true
  },
  userId: {
    type: String
  },
  email: {
    type: String
  }
}, { timestamps: true });

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);