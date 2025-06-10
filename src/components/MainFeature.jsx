import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import TaskModal from './TaskModal';
import TaskCard from './TaskCard';
import SkeletonLoader from './SkeletonLoader';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
import { taskService, categoryService } from '../services';

function MainFeature({ filter = 'all' }) {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [sortBy, setSortBy] = useState('dueDate');
  const [filterBy, setFilterBy] = useState('all');

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

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      setTasks(prev => [...prev, newTask]);
      setIsModalOpen(false);
      toast.success('Task created successfully');
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const updatedTask = await taskService.update(taskId, updates);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
      setIsModalOpen(false);
      setEditingTask(null);
      toast.success('Task updated successfully');
    } catch (err) {
      toast.error('Failed to update task');
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
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const updates = {
      status: task.status === 'completed' ? 'pending' : 'completed',
      completedAt: task.status === 'completed' ? null : new Date().toISOString()
    };
    
    await handleUpdateTask(taskId, updates);
  };

  const getFilteredTasks = () => {
    let filtered = [...tasks];
    
    // Apply view filter
    const today = new Date().toDateString();
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toDateString();
    
    switch (filter) {
      case 'today':
        filtered = filtered.filter(task => {
          if (!task.dueDate) return false;
          return new Date(task.dueDate).toDateString() === today;
        });
        break;
      case 'upcoming':
        filtered = filtered.filter(task => {
          if (!task.dueDate) return false;
          const taskDate = new Date(task.dueDate);
          const now = new Date();
          return taskDate > now;
        });
        break;
      case 'completed':
        filtered = filtered.filter(task => task.status === 'completed');
        break;
      default:
        break;
    }
    
    // Apply category filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(task => task.categoryId === filterBy);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
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
    
    return filtered;
  };

  const filteredTasks = getFilteredTasks();

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
        <ErrorState 
          message={error}
          onRetry={loadData}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-6 bg-white border-b border-surface-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl font-heading font-bold text-surface-900 capitalize">
              {filter === 'all' ? 'All Tasks' : filter}
            </h2>
            <p className="text-surface-600 mt-1">
              {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="created">Created</option>
            </select>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:brightness-110 transition-all"
            >
              <ApperIcon name="Plus" size={18} />
              <span className="hidden sm:inline">Add Task</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredTasks.length === 0 ? (
          <EmptyState
            title={filter === 'completed' ? 'No completed tasks' : 'No tasks found'}
            description={filter === 'completed' 
              ? 'Complete some tasks to see them here' 
              : 'Create your first task to get started'
            }
            actionLabel="Create Task"
            onAction={() => setIsModalOpen(true)}
          />
        ) : (
          <motion.div 
            className="space-y-4 max-w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AnimatePresence>
              {filteredTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TaskCard
                    task={task}
                    category={categories.find(c => c.id === task.categoryId)}
                    onComplete={() => handleCompleteTask(task.id)}
                    onEdit={() => {
                      setEditingTask(task);
                      setIsModalOpen(true);
                    }}
                    onDelete={() => handleDeleteTask(task.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Task Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <TaskModal
            task={editingTask}
            categories={categories}
            onClose={() => {
              setIsModalOpen(false);
              setEditingTask(null);
            }}
            onSave={editingTask ? 
              (updates) => handleUpdateTask(editingTask.id, updates) :
              handleCreateTask
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default MainFeature;