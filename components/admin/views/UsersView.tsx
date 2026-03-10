import React, { useState, useEffect } from 'react';
import { DataTable } from '../DataTable';
import { Modal } from '../Modal';
import { toast } from 'sonner';

export function UsersView() {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({ UserName: '', Email: '', PasswordHash: '', RoleID: '' });

  const fetchAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      setCurrentUser(data);
    } catch (error) {
      console.error('Failed to fetch auth:', error);
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/users');
      if (res.status === 403) {
          setUsers([]);
          return;
      }
      const data = await res.json();
      if (Array.isArray(data)) setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await fetch('/api/roles');
      const data = await res.json();
      if (Array.isArray(data)) setRoles(data);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    }
  };

  useEffect(() => {
    fetchAuth();
    fetchUsers();
    fetchRoles();
  }, []);

  const isAdmin = currentUser?.role === 'Admin';

  if (currentUser && !isAdmin) {
      return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold">!</span>
              </div>
              <div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Access Denied</h2>
                  <p className="text-zinc-500 max-w-sm mx-auto">You do not have permission to manage users. This area is restricted to system administrators.</p>
              </div>
          </div>
      );
  }

  const handleCreate = () => {
    setEditingUser(null);
    setFormData({ UserName: '', Email: '', PasswordHash: '', RoleID: roles.length > 0 ? (roles[0] as any).RoleID.toString() : '' });
    setIsModalOpen(true);
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    let roleId = '';
    if (user.Roles && user.Roles.length > 0 && roles.length > 0) {
        const userRoleName = user.Roles[0];
        const roleObj = roles.find(r => r.RoleName === userRoleName);
        if (roleObj) roleId = roleObj.RoleID.toString();
    }

    setFormData({ 
        UserName: user.UserName, 
        Email: user.Email, 
        PasswordHash: '', 
        RoleID: roleId
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (user: any) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`/api/users/${user.UserID}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('User deleted');
        fetchUsers();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to delete user');
      }
    } catch (error) {
      toast.error('Error deleting user');
    }
  };

  const handleSubmit = async () => {
    try {
      const url = editingUser ? `/api/users/${editingUser.UserID}` : '/api/users';
      const method = editingUser ? 'PUT' : 'POST';
      
      const payload: any = {
        UserName: formData.UserName,
        Email: formData.Email,
        RoleID: formData.RoleID
      };

      if (!editingUser) {
          payload.PasswordHash = formData.PasswordHash || 'password123';
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(`User ${editingUser ? 'updated' : 'created'}`);
        setIsModalOpen(false);
        fetchUsers();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Operation failed');
      }
    } catch (error) {
      toast.error('Error submitting form');
    }
  };

  const columns = [
    { key: 'UserID', header: 'ID' },
    { key: 'UserName', header: 'Username' },
    { key: 'Email', header: 'Email' },
    { key: 'Roles', header: 'Roles', render: (u: any) => u.Roles && u.Roles.length > 0 ? u.Roles.join(', ') : '—' },
    { key: 'CreatedAt', header: 'Created At', render: (u: any) => new Date(u.CreatedAt).toLocaleDateString() },
  ];

  return (
    <>
      <DataTable
        title="Users Management"
        columns={columns}
        data={users}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Edit User' : 'Create User'}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input 
              className="w-full p-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700" 
              value={formData.UserName}
              onChange={(e) => setFormData({...formData, UserName: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              className="w-full p-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700" 
              type="email"
              value={formData.Email}
              onChange={(e) => setFormData({...formData, Email: e.target.value})}
            />
          </div>
          {!editingUser && (
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input 
                className="w-full p-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700" 
                type="password"
                value={formData.PasswordHash}
                onChange={(e) => setFormData({...formData, PasswordHash: e.target.value})}
                placeholder="Default: password123"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
                className="w-full p-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                value={formData.RoleID}
                onChange={(e) => setFormData({...formData, RoleID: e.target.value})}
            >
                <option value="">Select Role</option>
                {roles.map((role: any) => (
                    <option key={role.RoleID} value={role.RoleID}>
                        {role.RoleName}
                    </option>
                ))}
            </select>
          </div>
        </div>
      </Modal>
    </>
  );
}
