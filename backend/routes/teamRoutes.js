const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const { TeamMember, TeamInvite } = require('../model/Team');
const User = require('../model/User');
const Project = require('../model/Project');
const crypto = require('crypto');
const { sendInviteEmail } = require('../utils/emailService');

// Get all team members for the current user's team
router.get('/members', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get all team members where user is owner or member
    const members = await TeamMember.find({
      $or: [
        { teamOwnerId: userId },
        { userId: userId }
      ]
    })
    .populate('userId', 'firstName lastName email avatar')
    .populate('teamOwnerId', 'firstName lastName email')
    .sort({ createdAt: -1 });

    // Get unique owner IDs to fetch their members
    const ownerIds = [...new Set(members.map(m => m.teamOwnerId._id.toString()))];
    
    // If user is an owner, get all their team members
    const ownedMembers = await TeamMember.find({ teamOwnerId: userId })
      .populate('userId', 'firstName lastName email avatar')
      .sort({ createdAt: -1 });

    // Combine and deduplicate
    const allMembers = [...ownedMembers];
    const memberIds = new Set();
    const uniqueMembers = [];
    
    allMembers.forEach(m => {
      const id = m.userId._id.toString();
      if (!memberIds.has(id)) {
        memberIds.add(id);
        uniqueMembers.push(m);
      }
    });

    // Get project counts for each member
    const membersWithProjects = await Promise.all(
      uniqueMembers.map(async (member) => {
        const projectCount = await Project.countDocuments({ userId: member.userId._id });
        const memberData = member.toObject();
        memberData.projects = projectCount;
        return memberData;
      })
    );

    // Add current user as owner if they're not already in the list
    const currentUser = await User.findById(userId);
    const currentUserInList = membersWithProjects.some(m => m.userId._id.toString() === userId);
    
    if (!currentUserInList && currentUser) {
      const ownerProjectCount = await Project.countDocuments({ userId: userId });
      membersWithProjects.unshift({
        userId: {
          _id: currentUser._id,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          email: currentUser.email,
          avatar: currentUser.avatar
        },
        teamOwnerId: {
          _id: currentUser._id,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          email: currentUser.email
        },
        role: 'owner',
        status: 'active',
        projects: ownerProjectCount,
        joinedAt: currentUser.createdAt || new Date(),
        createdAt: currentUser.createdAt || new Date()
      });
    }

    res.json(membersWithProjects);
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get projects for a specific team member
router.get('/members/:memberId/projects', authMiddleware, async (req, res) => {
  try {
    const { memberId } = req.params;
    const userId = req.user.id;

    // Verify user has access to this member's projects
    const member = await TeamMember.findOne({
      $or: [
        { userId: memberId, teamOwnerId: userId },
        { userId: userId, teamOwnerId: memberId }
      ]
    });

    if (!member && memberId !== userId) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const projects = await Project.find({ userId: memberId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(projects);
  } catch (error) {
    console.error('Error fetching member projects:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Invite a team member by email
router.post('/invite', authMiddleware, async (req, res) => {
  try {
    const { email, role = 'member' } = req.body;
    const userId = req.user.id;

    if (!email) {
      return res.status(400).json({ msg: 'Email is required' });
    }

    // Check if user exists
    const invitedUser = await User.findOne({ email });
    
    // Check if already a team member
    if (invitedUser) {
      const existingMember = await TeamMember.findOne({
        userId: invitedUser._id,
        teamOwnerId: userId
      });

      if (existingMember) {
        return res.status(400).json({ msg: 'User is already a team member' });
      }
    }

    // Check for existing pending invite
    const existingInvite = await TeamInvite.findOne({
      email,
      teamOwnerId: userId,
      status: 'pending'
    });

    if (existingInvite) {
      return res.status(400).json({ msg: 'Invite already sent to this email' });
    }

    // Generate invite token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    // Create invite
    const invite = new TeamInvite({
      email,
      teamOwnerId: userId,
      role,
      token,
      expiresAt
    });

    await invite.save();

    // If user exists, create team member with pending status
    if (invitedUser) {
      const teamMember = new TeamMember({
        userId: invitedUser._id,
        teamOwnerId: userId,
        role,
        status: 'pending'
      });
      await teamMember.save();
    }

    // Get inviter's name for email
    const inviter = await User.findById(userId);
    const inviterName = inviter ? `${inviter.firstName || ''} ${inviter.lastName || ''}`.trim() || inviter.email : 'Team Owner';

    // Send invitation email
    try {
      await sendInviteEmail(email, token, inviterName, role);
      console.log(`Invite email sent to ${email}`);
    } catch (emailError) {
      console.error('Error sending invite email:', emailError);
      // Don't fail the request if email fails, just log it
      // The invite is still created in the database
    }

    res.json({ 
      msg: 'Invite sent successfully',
      invite: {
        id: invite._id,
        email: invite.email,
        role: invite.role,
        expiresAt: invite.expiresAt
      }
    });
  } catch (error) {
    console.error('Error sending invite:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all invites
router.get('/invites', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const invites = await TeamInvite.find({ teamOwnerId: userId })
      .sort({ createdAt: -1 });

    res.json(invites);
  } catch (error) {
    console.error('Error fetching invites:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Accept invite (when user accepts via token)
router.post('/invites/accept/:token', authMiddleware, async (req, res) => {
  try {
    const { token } = req.params;
    const userId = req.user.id;

    const invite = await TeamInvite.findOne({ token, status: 'pending' });
    
    if (!invite) {
      return res.status(404).json({ msg: 'Invite not found or already processed' });
    }

    if (invite.expiresAt < new Date()) {
      invite.status = 'expired';
      await invite.save();
      return res.status(400).json({ msg: 'Invite has expired' });
    }

    // Get user email to verify
    const user = await User.findById(userId);
    if (user.email !== invite.email) {
      return res.status(403).json({ msg: 'This invite is not for your email' });
    }

    // Create or update team member
    let teamMember = await TeamMember.findOne({
      userId: userId,
      teamOwnerId: invite.teamOwnerId
    });

    if (teamMember) {
      teamMember.status = 'active';
      teamMember.role = invite.role;
    } else {
      teamMember = new TeamMember({
        userId: userId,
        teamOwnerId: invite.teamOwnerId,
        role: invite.role,
        status: 'active'
      });
    }

    await teamMember.save();

    // Update invite status
    invite.status = 'accepted';
    await invite.save();

    res.json({ msg: 'Invite accepted successfully' });
  } catch (error) {
    console.error('Error accepting invite:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Remove team member
router.delete('/members/:memberId', authMiddleware, async (req, res) => {
  try {
    const { memberId } = req.params;
    const userId = req.user.id;

    const member = await TeamMember.findOne({
      _id: memberId,
      teamOwnerId: userId
    });

    if (!member) {
      return res.status(404).json({ msg: 'Team member not found' });
    }

    // Prevent owner from removing themselves
    if (member.userId.toString() === userId && member.role === 'owner') {
      return res.status(400).json({ msg: 'Cannot remove yourself as owner' });
    }

    await TeamMember.deleteOne({ _id: memberId });
    res.json({ msg: 'Team member removed successfully' });
  } catch (error) {
    console.error('Error removing team member:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Cancel invite
router.delete('/invites/:inviteId', authMiddleware, async (req, res) => {
  try {
    const { inviteId } = req.params;
    const userId = req.user.id;

    const invite = await TeamInvite.findOne({
      _id: inviteId,
      teamOwnerId: userId
    });

    if (!invite) {
      return res.status(404).json({ msg: 'Invite not found' });
    }

    await TeamInvite.deleteOne({ _id: inviteId });
    res.json({ msg: 'Invite cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling invite:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get team stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const activeMembers = await TeamMember.find({ teamOwnerId: userId, status: 'active' });
    const totalMembers = activeMembers.length + 1; // +1 for the owner
    const pendingInvites = await TeamInvite.countDocuments({ teamOwnerId: userId, status: 'pending' });
    
    // Get total projects from all team members including owner
    const memberIds = activeMembers.map(m => m.userId);
    memberIds.push(userId); // Include owner's projects
    const totalProjects = await Project.countDocuments({ userId: { $in: memberIds } });

    res.json({
      totalMembers,
      pendingInvites,
      totalProjects
    });
  } catch (error) {
    console.error('Error fetching team stats:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;

