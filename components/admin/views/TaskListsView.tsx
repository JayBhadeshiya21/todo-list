import React, { useState, useEffect } from 'react';
import { DataTable } from '../DataTable';
import { Modal } from '../Modal';
import { toast } from 'sonner';

export function TaskListsView() {
  const [lists, setLists] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingList, setEditingList] = useState<any>(null);
  const [formData, setFormData] = useState({ ListName: '', ProjectID: '' });

  const fetchAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      setCurrentUser(data);
    } catch (error) {
      console.error('Failed to fetch auth:', error);
    }
  };

  const fetchLists = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/tasklists');
      const data = await res.json();
      if (Array.isArray(data)) setLists(data);
    } catch (error) {
      toast.error('Failed to fetch task lists');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (Array.isArray(data)) setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  useEffect(() => {
    fetchAuth();
    fetchLists();
    fetchProjects();
  }, []);

  const isAdmin = currentUser?.role === 'Admin';
  const isPM = currentUser?.role === 'Project Manager';

  const handleCreate = () => {
    setEditingList(null);
    setFormData({ ListName: '', ProjectID: projects.length > 0 ? (projects[0] as any).ProjectID.toString() : '' });
    setIsModalOpen(true);
  };

  const handleEdit = (list: any) => {
    setEditingList(list);
    setFormData({ 
        ListName: list.ListName, 
        ProjectID: list.ProjectID ? list.ProjectID.toString() : ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (list: any) => {
    if (!confirm('Are you sure you want to delete this list?')) return;
    try {
      const res = await fetch(`/api/tasklists/${list.ListID}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('List deleted');
        fetchLists();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to delete list');
      }
    } catch (error) {
      toast.error('Error deleting list');
    }
  };

  const handleSubmit = async () => {
    try {
      const url = editingList ? `/api/tasklists/${editingList.ListID}` : '/api/tasklists';
      const method = editingList ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(`List ${editingList ? 'updated' : 'created'}`);
        setIsModalOpen(false);
        fetchLists();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Operation failed');
      }
    } catch (error) {
      toast.error('Error submitting form');
    }
  };

  const columns = [
    { key: 'ListID', header: 'ID' },
    { key: 'ListName', header: 'Name' },
    { key: 'projects', header: 'Project', render: (l: any) => l.projects?.ProjectName || l.ProjectID },
  ];

  return (
    <>
      <DataTable 
        title="Task Lists Management" 
        columns={columns} 
        data={lists} 
        onEdit={isAdmin || isPM ? handleEdit : undefined} 
        onDelete={isAdmin || isPM ? handleDelete : undefined}
        onCreate={isAdmin || isPM ? handleCreate : undefined}
        canEdit={(list) => isAdmin || (isPM && list.projects?.CreatedBy === currentUser?.userId)}
        canDelete={(list) => isAdmin || (isPM && list.projects?.CreatedBy === currentUser?.userId)}
        isLoading={isLoading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingList ? 'Edit List' : 'Create List'}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">List Name</label>
            <input 
              className="w-full p-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700" 
              value={formData.ListName}
              onChange={(e) => setFormData({...formData, ListName: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Project</label>
            <select
                className="w-full p-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                value={formData.ProjectID}
                onChange={(e) => setFormData({...formData, ProjectID: e.target.value})}
            >
                <option value="">Select Project</option>
                {projects.map((project: any) => (
                    <option key={project.ProjectID} value={project.ProjectID}>
                        {project.ProjectName}
                    </option>
                ))}
            </select>
          </div>
        </div>
      </Modal>
    </>
  );
}
