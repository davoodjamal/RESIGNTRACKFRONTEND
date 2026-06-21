import { useState } from 'react';
import Icon from '../Icon';
import CreateUserModal from './CreateUserModal';
import EditUserModal from './EditUserModal';
import DeleteUserModal from './DeleteUserModal';

export default function UserManagement({ users, onRefreshUsers, onSetActiveTab }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.username?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Normalize roles for filtering
    const roleMapping = {
      'admin': 'Admin',
      'hr': 'HR Manager',
      'employee': 'Employee'
    };
    
    const userRole = roleMapping[user.role] || 'Employee';
    const matchesRole = roleFilter === 'All Roles' || userRole === roleFilter;

    return matchesSearch && matchesRole;
  });

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name[0].toUpperCase();
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-[#00dbe9] text-[#1f1f24]';
      case 'hr': return 'bg-[#00dbe9] text-[#131318]';
      default: return 'bg-[#3b494b] text-[#b9cacb]';
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header & Actions */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-4xl font-bold text-[#e4e1e9] mb-1">User Management</h2>
          <p className="text-sm text-[#b9cacb]">
            Manage employee access, roles, and system permissions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateUser(true)}
            className="px-4 h-10 rounded-lg bg-[#00dbe9] text-black text-xs font-medium hover:bg-[#0e4296] hover:shadow-md hover:-translate-y-[1px] active:scale-[0.98] transition-all duration-200 flex items-center gap-1 shadow-sm"
          >
            <Icon className="text-[18px]">person_add</Icon>
            Create User
          </button>
        </div>
      </div>

      {/* Data Table Container */}
      <div className="bg-[#1f1f24] rounded-lg border border-[#3b494b] shadow-sm overflow-hidden">
        {/* Table Filters */}
        <div className="p-4 border-b border-[#3b494b] flex items-center justify-between bg-[#131318]">
          <div className="relative w-64">
            <Icon className="absolute left-2 top-1/2 -translate-y-1/2 text-[#747783] text-[18px]">search</Icon>
            <input
              type="text"
              placeholder="Filter users..."
              className="w-full bg-[#1f1f24] border border-[#3b494b] rounded-lg h-10 pl-[32px] pr-2 text-sm focus:border-[#00dbe9] focus:ring-1 focus:ring-[#00dbe9] transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[#b9cacb]">Filter by Role:</span>
            <select
              className="bg-[#1f1f24] border border-[#3b494b] rounded-lg h-10 px-2 text-sm focus:border-[#00dbe9] focus:ring-1 focus:ring-[#00dbe9] outline-none"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option>All Roles</option>
              <option>Admin</option>
              <option>HR Manager</option>
              <option>Employee</option>
            </select>
          </div>
        </div>

        {/* The Table */}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#1f1f24] border-b border-[#3b494b]">
              <th className="py-4 px-6 text-xs font-medium text-[#b9cacb] uppercase tracking-wider">Name</th>
              <th className="py-4 px-6 text-xs font-medium text-[#b9cacb] uppercase tracking-wider">Role</th>
              <th className="py-4 px-6 text-xs font-medium text-[#b9cacb] uppercase tracking-wider">Status</th>
              <th className="py-4 px-6 text-xs font-medium text-[#b9cacb] uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3b494b] text-sm">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-8 text-center text-[#747783]">No users found matching your filters.</td>
              </tr>
            ) : (
              filteredUsers.map((u, i) => (
                <tr key={u.email} className={`hover:bg-[#2a292f] transition-all duration-200 group animate-in fade-in slide-in-from-left-2`} style={{ animationDelay: `${i * 50}ms` }}>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[12px] ${getRoleBadgeColor(u.role)}`}>
                        {getInitials(u.username)}
                      </div>
                      <div>
                        <div className="font-bold text-[#e4e1e9]">{u.username}</div>
                        <div className="text-[12px] text-[#b9cacb]">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-[#e4e1e9] capitalize">
                    {u.role === 'hr' ? 'HR Manager' : u.role}
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 px-2 py-[2px] rounded-full bg-[#33fb0a]/10 text-[#33fb0a] text-[11px] font-medium">
                      <span className="w-2 h-2 rounded-full bg-[#33fb0a]"></span>Active
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingUser(u)}
                        className="px-3 h-8 rounded-lg border border-[#747783] text-[#e4e1e9] text-[12px] font-medium hover:bg-[#3b494b] transition-colors inline-flex items-center justify-center"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeletingUser(u)}
                        className="p-1 text-[#ffb4ab] hover:bg-[#ffb4ab]/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Icon className="text-[18px]">delete</Icon>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        {/* Pagination Dummy */}
        <div className="p-4 border-t border-[#3b494b] flex items-center justify-between bg-[#1f1f24] text-sm text-[#b9cacb]">
          <div>Showing 1 to {filteredUsers.length} of {filteredUsers.length} entries</div>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-[#3b494b] rounded disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 bg-[#00dbe9] text-white rounded">1</button>
            <button className="px-3 py-1 border border-[#3b494b] rounded disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCreateUser && (
        <CreateUserModal
          onClose={() => setShowCreateUser(false)}
          onRefreshUsers={onRefreshUsers}
          onNavigateUsers={() => onSetActiveTab?.('users')}
        />
      )}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onRefreshUsers={onRefreshUsers}
        />
      )}
      {deletingUser && (
        <DeleteUserModal
          user={deletingUser}
          onClose={() => setDeletingUser(null)}
          onDelete={() => {
            // Placeholder: Call parent's onDeleteUser(user)
            console.log('Deleted user:', deletingUser.email);
            setDeletingUser(null);
          }}
        />
      )}
    </div>
  );
}
