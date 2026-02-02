import React, { useState, useEffect } from 'react';
import { DataTable } from '../DataTable';
import { Modal } from '../Modal';
import { toast } from 'sonner';

export function TasksView() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [formData, setFormData] = useState({ 
      Title: '', Description: '', Status: 'Pending', Priority: 'Medium', ListID: '', AssignedTo: '' 
  });

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreate = () => {
    setEditingTask(null);
    setFormData({ Title: '', Description: '', Status: 'Pending', Priority: 'Medium', ListID: '1', AssignedTo: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (task: any) => {
    setEditingTask(task);
    setFormData({ 
        Title: task.Title, 
        Description: task.Description || '',
        Status: task.Status || 'Pending',
        Priority: task.Priority || 'Medium',
        ListID: task.ListID,
        AssignedTo: task.AssignedTo || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (task: any) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      const res = await fetch(`/api/tasks/${task.TaskID}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Task deleted');
        fetchTasks();
      } else {
        toast.error('Failed to delete task');
      }
    } catch (error) {
      toast.error('Error deleting task');
    }
  };

  const handleSubmit = async () => {
    try {
      const url = editingTask ? `/api/tasks/${editingTask.TaskID}` : '/api/tasks';
      const method = editingTask ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(`Task ${editingTask ? 'updated' : 'created'}`);
        setIsModalOpen(false);
        fetchTasks();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Operation failed');
      }
    } catch (error) {
      toast.error('Error submitting form');
    }
  };

  const columns = [
    { key: 'TaskID', header: 'ID' },
    { key: 'Title', header: 'Title' },
    { key: 'Status', header: 'Status', render: (t: any) => (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${
            t.Status === 'Completed' ? 'bg-green-100 text-green-700' : 
            t.Status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
        }`}>
            {t.Status}
        </span>
    )},
    { key: 'Priority', header: 'Priority' },
    { key: 'users', header: 'Assigned To', render: (t: any) => t.users?.UserName || 'Unassigned' },
  ];

  return (
    <>
      <DataTable 
        title="Tasks Management" 
        columns={columns} 
        data={tasks} 
        onEdit={handleEdit} 
        onDelete={handleDelete}
        onCreate={handleCreate}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTask ? 'Edit Task' : 'Create Task'}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input 
              className="w-full p-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700" 
              value={formData.Title}
              onChange={(e) => setFormData({...formData, Title: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select 
                    className="w-full p-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                    value={formData.Status}
                    onChange={(e) => setFormData({...formData, Status: e.target.value})}
                >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
             </div>
             <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select 
                    className="w-full p-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                    value={formData.Priority}
                    onChange={(e) => setFormData({...formData, Priority: e.target.value})}
                >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
             </div>
          </div>
           <div>
            <label className="block text-sm font-medium mb-1">List ID</label>
            <input 
              className="w-full p-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700" 
              type="number"
              value={formData.ListID}
              onChange={(e) => setFormData({...formData, ListID: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Assigned User ID</label>
            <input 
              className="w-full p-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700" 
              type="number"
              value={formData.AssignedTo}
              onChange={(e) => setFormData({...formData, AssignedTo: e.target.value})}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
