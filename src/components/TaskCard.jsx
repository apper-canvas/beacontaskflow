import { motion } from 'framer-motion';
import { format, isToday, isPast, isThisWeek } from 'date-fns';
import ApperIcon from './ApperIcon';

function TaskCard({ task, category, onComplete, onEdit, onDelete }) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-error text-white';
      case 'high': return 'bg-warning text-surface-900';
      case 'medium': return 'bg-info text-white';
      case 'low': return 'bg-surface-300 text-surface-700';
      default: return 'bg-surface-300 text-surface-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle2';
      case 'in-progress': return 'Clock';
      default: return 'Circle';
    }
  };

  const getDueDateInfo = (dueDate) => {
    if (!dueDate) return null;
    
    const date = new Date(dueDate);
    const isOverdue = isPast(date) && !isToday(date);
    
    let label = format(date, 'MMM d');
    if (isToday(date)) label = 'Today';
    else if (isThisWeek(date)) label = format(date, 'EEEE');
    
    return {
      label,
      isOverdue,
      className: isOverdue ? 'text-error' : 'text-surface-600'
    };
  };

  const dueDateInfo = getDueDateInfo(task.dueDate);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl p-4 shadow-sm border border-surface-200 hover:shadow-md transition-all duration-200 max-w-full overflow-hidden"
    >
      <div className="flex items-start space-x-3 min-w-0">
        {/* Category Color Bar */}
        {category && (
          <div 
            className="w-1 h-16 rounded-full flex-shrink-0"
            style={{ backgroundColor: category.color }}
          />
        )}
        
        {/* Status Checkbox */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onComplete}
          className={`flex-shrink-0 p-1 rounded-full transition-colors ${
            task.status === 'completed' 
              ? 'text-success' 
              : 'text-surface-400 hover:text-success'
          }`}
        >
          <ApperIcon name={getStatusIcon(task.status)} size={20} />
        </motion.button>
        
        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between space-x-4">
            <div className="min-w-0 flex-1">
              <h3 className={`font-medium break-words ${
                task.status === 'completed' 
                  ? 'line-through text-surface-500' 
                  : 'text-surface-900'
              }`}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className={`text-sm mt-1 break-words ${
                  task.status === 'completed' 
                    ? 'text-surface-400' 
                    : 'text-surface-600'
                }`}>
                  {task.description}
                </p>
              )}
              
              <div className="flex items-center space-x-3 mt-2">
                {/* Priority Badge */}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                
                {/* Category */}
                {category && (
                  <span className="text-xs text-surface-500 flex items-center space-x-1">
                    <ApperIcon name={category.icon} size={12} />
                    <span>{category.name}</span>
                  </span>
                )}
                
                {/* Due Date */}
                {dueDateInfo && (
                  <span className={`text-xs flex items-center space-x-1 ${dueDateInfo.className}`}>
                    <ApperIcon name="Calendar" size={12} />
                    <span>{dueDateInfo.label}</span>
                  </span>
                )}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-1 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onEdit}
                className="p-2 text-surface-400 hover:text-primary rounded-lg transition-colors"
              >
                <ApperIcon name="Edit2" size={16} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onDelete}
                className="p-2 text-surface-400 hover:text-error rounded-lg transition-colors"
              >
                <ApperIcon name="Trash2" size={16} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default TaskCard;