import React, { useState, useEffect } from 'react';
import { DataTable } from '../DataTable';
import { Modal } from '../Modal';
import { toast } from 'sonner';

export function RolesView() {
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [formData, setFormData] = useState({ RoleName: '' });

  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/roles');
      const data = await res.json();
      setRoles(data);
    } catch (error) {
      toast.error('Failed to fetch roles');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleCreate = () => {
    setEditingRole(null);
    setFormData({ RoleName: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (role: any) => {
    setEditingRole(role);
    setFormData({ RoleName: role.RoleName });
    setIsModalOpen(true);
  };

  const handleDelete = async (role: any) => {
    if (!confirm('Are you sure you want to delete this role?')) return;
    try {
      const res = await fetch(`/api/roles/${role.RoleID}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Role deleted');
        fetchRoles();
      } else {
        toast.error('Failed to delete role');
      }
    } catch (error) {
      toast.error('Error deleting role');
    }
  };

  const handleSubmit = async () => {
    try {
      const url = editingRole ? `/api/roles/${editingRole.RoleID}` : '/api/roles';
      const method = editingRole ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(`Role ${editingRole ? 'updated' : 'created'}`);
        setIsModalOpen(false);
        fetchRoles();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Operation failed');
      }
    } catch (error) {
      toast.error('Error submitting form');
    }
  };

  const columns = [
    { key: 'RoleID', header: 'ID' },
    { key: 'RoleName', header: 'Role Name' },
  ];

  return (
    <>
      <DataTable 
        title="Roles Management" 
        columns={columns} 
        data={roles} 
        onEdit={handleEdit} 
        onDelete={handleDelete}
        onCreate={handleCreate}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRole ? 'Edit Role' : 'Create Role'}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Role Name</label>
            <input 
              className="w-full p-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700" 
              value={formData.RoleName}
              onChange={(e) => setFormData({...formData, RoleName: e.target.value})}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
