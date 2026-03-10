import React, { useState, useEffect } from 'react';
import { DataTable } from '../DataTable';
import { Modal } from '../Modal';
import { toast } from 'sonner';

export function ProjectsView() {
  const [projects, setProjects] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [formData, setFormData] = useState({ ProjectName: '', Description: '', CreatedBy: '' });

  const fetchAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      setCurrentUser(data);
    } catch (error) {
      console.error('Failed to fetch auth:', error);
    }
  };

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (Array.isArray(data)) setProjects(data);
    } catch (error) {
      toast.error('Failed to fetch projects');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (Array.isArray(data)) setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  useEffect(() => {
    fetchAuth();
    fetchProjects();
    fetchUsers();
  }, []);

  const isAdmin = currentUser?.role === 'Admin';
  const isPM = currentUser?.role === 'Project Manager';
  const isTM = currentUser?.role === 'Team Member';

  const handleCreate = () => {
    setEditingProject(null);
    setFormData({ ProjectName: '', Description: '', CreatedBy: isAdmin ? (users.length > 0 ? users[0].UserID.toString() : '') : currentUser?.userId.toString() });
    setIsModalOpen(true);
  };

  const handleEdit = (project: any) => {
    setEditingProject(project);
    setFormData({ 
        ProjectName: project.ProjectName, 
        Description: project.Description || '',
        CreatedBy: project.CreatedBy ? project.CreatedBy.toString() : ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (project: any) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await fetch(`/api/projects/${project.ProjectID}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Project deleted');
        fetchProjects();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to delete project');
      }
    } catch (error) {
      toast.error('Error deleting project');
    }
  };

  const handleSubmit = async () => {
    try {
      const url = editingProject ? `/api/projects/${editingProject.ProjectID}` : '/api/projects';
      const method = editingProject ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(`Project ${editingProject ? 'updated' : 'created'}`);
        setIsModalOpen(false);
        fetchProjects();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Operation failed');
      }
    } catch (error) {
      toast.error('Error submitting form');
    }
  };

  const columns = [
    { key: 'ProjectID', header: 'ID' },
    { key: 'ProjectName', header: 'Name' },
    { key: 'Description', header: 'Description' },
    { key: 'users', header: 'Created By', render: (p: any) => p.users?.UserName || p.CreatedBy },
  ];

  return (
    <>
      <DataTable 
        title="Projects Management" 
        columns={columns} 
        data={projects} 
        onEdit={isAdmin || isPM ? handleEdit : undefined} 
        onDelete={isAdmin ? handleDelete : undefined}
        onCreate={isAdmin || isPM ? handleCreate : undefined}
        isLoading={isLoading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? 'Edit Project' : 'Create Project'}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Project Name</label>
            <input 
              className="w-full p-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700" 
              value={formData.ProjectName}
              onChange={(e) => setFormData({...formData, ProjectName: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea 
              className="w-full p-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700" 
              value={formData.Description}
              onChange={(e) => setFormData({...formData, Description: e.target.value})}
            />
          </div>
          {isAdmin && (
            <div>
              <label className="block text-sm font-medium mb-1">Created By</label>
              <select
                  className="w-full p-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                  value={formData.CreatedBy}
                  onChange={(e) => setFormData({...formData, CreatedBy: e.target.value})}
              >
                  <option value="">Select User</option>
                  {users.map((user: any) => (
                      <option key={user.UserID} value={user.UserID}>
                          {user.UserName} ({user.Email})
                      </option>
                  ))}
              </select>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
