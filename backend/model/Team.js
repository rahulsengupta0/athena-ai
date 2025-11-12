const mongoose = require('mongoose');

const TeamMemberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  teamOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['owner', 'admin', 'member'], default: 'member' },
  status: { type: String, enum: ['active', 'pending', 'inactive'], default: 'active' },
  joinedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const TeamInviteSchema = new mongoose.Schema({
  email: { type: String, required: true },
  teamOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['admin', 'member'], default: 'member' },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'expired'], default: 'pending' },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  invitedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const TeamMember = mongoose.model('TeamMember', TeamMemberSchema);
const TeamInvite = mongoose.model('TeamInvite', TeamInviteSchema);

module.exports = { TeamMember, TeamInvite };

