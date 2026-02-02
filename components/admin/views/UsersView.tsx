import React, { useState, useEffect } from 'react';
import { DataTable } from '../DataTable';
import { toast } from 'sonner';

export function UsersView() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (user: any) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const res = await fetch(`/api/users/${user.UserID}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('User deleted');
        fetchUsers();
      } else {
        toast.error('Failed to delete user');
      }
    } catch (error) {
      toast.error('Error deleting user');
    }
  };

  const columns = [
    { key: 'UserName', header: 'Username' },
    { key: 'Email', header: 'Email' },
    {
      key: 'Roles',
      header: 'Roles',
      render: (u: any) =>
        u.Roles && u.Roles.length > 0
          ? u.Roles.join(', ')
          : '—',
    },
    {
      key: 'CreatedAt',
      header: 'Created At',
      render: (u: any) =>
        new Date(u.CreatedAt).toLocaleDateString(),
    },
  ];

  return (
    <DataTable
      title="Users Management"
      columns={columns}
      data={users}
      isLoading={isLoading}
      onDelete={handleDelete}
    />
  );
}
