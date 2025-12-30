<<<<<<< HEAD
import React from 'react'
import Teamintro from '../components/Team/Teamintro'
import Teamhero from '../components/Team/Teamhero'
export const Team = () => {
    return (
        <>
            <Teamintro/>
            <Teamhero/>
        </>
    )
}
=======
import React, { useState, useEffect } from 'react';
import Teamintro from '../components/Team/Teamintro';
import Teamhero from '../components/Team/Teamhero';
import InviteModal from '../components/Team/InviteModal';
import InvitesList from '../components/Team/InvitesList';
import ProjectsModal from '../components/Team/ProjectsModal';
import api from '../services/api';

export const Team = () => {
  const [activeTab, setActiveTab] = useState('Members');
  const [members, setMembers] = useState([]);
  const [invites, setInvites] = useState([]);
  const [stats, setStats] = useState({ totalMembers: 0, totalProjects: 0, pendingInvites: 0 });
  const [loading, setLoading] = useState(true);
  const [invitesLoading, setInvitesLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [projectsModalOpen, setProjectsModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [selectedMemberName, setSelectedMemberName] = useState('');

  // Fetch team data
  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      setInvitesLoading(true);
      
      const [membersData, invitesData, statsData] = await Promise.all([
        api.getTeamMembers(),
        api.getTeamInvites(),
        api.getTeamStats()
      ]);

      setMembers(membersData || []);
      setInvites(invitesData || []);
      setStats(statsData || { totalMembers: 0, totalProjects: 0, pendingInvites: 0 });
    } catch (error) {
      console.error('Error fetching team data:', error);
      setMembers([]);
      setInvites([]);
    } finally {
      setLoading(false);
      setInvitesLoading(false);
    }
  };

  const handleInvite = async (email, role) => {
    await api.inviteTeamMember(email, role);
    // Refresh data
    await fetchTeamData();
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      try {
        await api.removeTeamMember(memberId);
        await fetchTeamData();
      } catch (error) {
        console.error('Error removing team member:', error);
        alert('Failed to remove team member');
      }
    }
  };

  const handleCancelInvite = async (inviteId) => {
    if (window.confirm('Are you sure you want to cancel this invite?')) {
      try {
        await api.cancelInvite(inviteId);
        await fetchTeamData();
      } catch (error) {
        console.error('Error cancelling invite:', error);
        alert('Failed to cancel invite');
      }
    }
  };

  const handleViewProjects = (memberId, memberName) => {
    setSelectedMemberId(memberId);
    setSelectedMemberName(memberName);
    setProjectsModalOpen(true);
  };

  // Filter members based on search query
  const filteredMembers = members.filter(member => {
    if (!searchQuery) return true;
    const name = `${member.userId?.firstName || ''} ${member.userId?.lastName || ''}`.trim().toLowerCase();
    const email = (member.userId?.email || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    return name.includes(query) || email.includes(query);
  });

  return (
    <>
      <Teamintro
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onInviteClick={() => setInviteModalOpen(true)}
        stats={stats}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      {activeTab === 'Members' ? (
        <Teamhero
          members={filteredMembers}
          loading={loading}
          onRemove={handleRemoveMember}
          onViewProjects={(memberId) => {
            const member = members.find(m => m.userId._id === memberId);
            const name = member 
              ? `${member.userId?.firstName || ''} ${member.userId?.lastName || ''}`.trim() || member.userId?.email
              : 'Team Member';
            handleViewProjects(memberId, name);
          }}
        />
      ) : (
        <InvitesList
          invites={invites}
          loading={invitesLoading}
          onCancel={handleCancelInvite}
        />
      )}

      <InviteModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        onInvite={handleInvite}
      />

      <ProjectsModal
        isOpen={projectsModalOpen}
        onClose={() => {
          setProjectsModalOpen(false);
          setSelectedMemberId(null);
          setSelectedMemberName('');
        }}
        memberId={selectedMemberId}
        memberName={selectedMemberName}
      />
    </>
  );
};
>>>>>>> rc
