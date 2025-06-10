import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { taskService, categoryService } from '@/services';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import TaskModal from '@/components/organisms/TaskModal';
import TaskList from '@/components/organisms/TaskList';
import HeaderSection from '@/components/molecules/HeaderSection';
import AddButton from '@/components/molecules/AddButton';
import Input from '@/components/atoms/Input';

function TaskManagement({ filter = 'all' }) {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [sortBy, setSortBy] = useState('dueDate');
  const [filterBy, setFilterBy] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false); // For modal save

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksResult, categoriesResult] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      setTasks(tasksResult);
      setCategories(categoriesResult);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTask = async (taskData) => {
    setIsSubmitting(true);
    try {
      if (editingTask) {
        const updated = await taskService.update(editingTask.id, taskData);
        setTasks(prev => prev.map(task => 
          task.id === editingTask.id ? updated : task
        ));
        toast.success('Task updated successfully');
      } else {
        const newTask = await taskService.create(taskData);
        setTasks(prev => [...prev, newTask]);
        toast.success('Task created successfully');
      }
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      toast.error('Failed to save task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast.success('Task deleted successfully');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const handleCompleteTask = async (taskId) => {
    const taskToUpdate = tasks.find(t => t.id === taskId);
    if (!taskToUpdate) return;
    
    const updates = {
      status: taskToUpdate.status === 'completed' ? 'pending' : 'completed',
      completedAt: taskToUpdate.status === 'completed' ? null : new Date().toISOString()
    };
    
    try {
      const updatedTask = await taskService.update(taskId, updates);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
      toast.success('Task status updated');
    } catch (err) {
      toast.error('Failed to update task status');
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const getFilteredAndSortedTasks = () => {
    let currentFilteredTasks = [...tasks];
    
    const today = new Date().toDateString();
    
    switch (filter) {
      case 'today':
        currentFilteredTasks = currentFilteredTasks.filter(task => {
          if (!task.dueDate) return false;
          return new Date(task.dueDate).toDateString() === today;
        });
        break;
      case 'upcoming':
        currentFilteredTasks = currentFilteredTasks.filter(task => {
          if (!task.dueDate) return false;
          const taskDate = new Date(task.dueDate);
          const now = new Date();
          // Exclude tasks due today, only truly 'upcoming'
          return taskDate > new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        });
        break;
      case 'completed':
        currentFilteredTasks = currentFilteredTasks.filter(task => task.status === 'completed');
        break;
      default:
        // For 'all' filter, no initial filtering based on date/status
        break;
    }
    
    // Apply category filter (if selected)
    if (filterBy !== 'all') {
      currentFilteredTasks = currentFilteredTasks.filter(task => task.categoryId === filterBy);
    }
    
    // Apply sorting
    currentFilteredTasks.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1; // Tasks without due date go to end
          if (!b.dueDate) return -1; // Tasks without due date go to end
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });
    
    return currentFilteredTasks;
  };

  const displayedTasks = getFilteredAndSortedTasks();

  const categoryFilterOptions = [
    { value: 'all', label: 'All Categories' },
    ...categories.map(category => ({ value: category.id, label: category.name }))
  ];

  const sortOptions = [
    { value: 'dueDate', label: 'Due Date' },
    { value: 'priority', label: 'Priority' },
    { value: 'created', label: 'Created' },
  ];

  if (loading) {
    return (
      <div className="p-6">
        <SkeletonLoader count={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState message={error} onRetry={loadData} />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col max-w-full overflow-hidden">
      <HeaderSection
        title={filter === 'all' ? 'All Tasks' : filter}
        description={`${displayedTasks.length} task${displayedTasks.length !== 1 ? 's' : ''}`}
        actions={
          <>
            <Input
              type="select"
              value={filterBy}
              onChange={(name, value) => setFilterBy(value)}
              options={categoryFilterOptions}
              className="px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            
            <Input
              type="select"
              value={sortBy}
              onChange={(name, value) => setSortBy(value)}
              options={sortOptions}
              className="px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            
            <AddButton label="Add Task" onClick={() => setIsModalOpen(true)} className="hidden sm:inline-flex" />
          </>
        }
      />
      {/* Mobile Add Task Button - positioned fixed */}
      <AddButton label="Add Task" onClick={() => setIsModalOpen(true)} className="sm:hidden fixed bottom-4 right-4 z-10" />

      <TaskList
        tasks={displayedTasks}
        categories={categories}
        onCompleteTask={handleCompleteTask}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        filter={filter}
        onAddTask={() => setIsModalOpen(true)}
      />

      <TaskModal
        isOpen={isModalOpen}
        task={editingTask}
        categories={categories}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

TaskManagement.propTypes = {
  filter: PropTypes.oneOf(['all', 'today', 'upcoming', 'completed']),
};

export default TaskManagement;