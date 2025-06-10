import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import CategoryBadge from '@/components/molecules/CategoryBadge';
import DueDateBadge from '@/components/molecules/DueDateBadge';
import PriorityBadge from '@/components/molecules/PriorityBadge';
import ActionIconButton from '@/components/molecules/ActionIconButton';

const TaskCard = ({ task, category, onComplete, onEdit, onDelete }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle2';
      case 'in-progress': return 'Clock';
      default: return 'Circle';
    }
  };

  const taskTitleClass = task.status === 'completed' 
    ? 'line-through text-surface-500' 
    : 'text-surface-900';
  const taskDescriptionClass = task.status === 'completed' 
    ? 'text-surface-400' 
    : 'text-surface-600';
  const checkboxClass = task.status === 'completed' 
    ? 'text-success' 
    : 'text-surface-400 hover:text-success';

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
          className={`flex-shrink-0 p-1 rounded-full transition-colors ${checkboxClass}`}
        >
          <ApperIcon name={getStatusIcon(task.status)} size={20} />
        </motion.button>
        
        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between space-x-4">
            <div className="min-w-0 flex-1">
              <h3 className={`font-medium break-words ${taskTitleClass}`}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className={`text-sm mt-1 break-words ${taskDescriptionClass}`}>
                  {task.description}
                </p>
              )}
              
              <div className="flex items-center space-x-3 mt-2">
                <PriorityBadge priority={task.priority} />
                <CategoryBadge category={category} />
                <DueDateBadge dueDate={task.dueDate} />
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-1 flex-shrink-0">
              <ActionIconButton
                icon="Edit2"
                onClick={onEdit}
                className="text-surface-400 hover:text-primary"
              />
              
              <ActionIconButton
                icon="Trash2"
                onClick={onDelete}
                className="text-surface-400 hover:text-error"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

TaskCard.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    categoryId: PropTypes.string,
    priority: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    dueDate: PropTypes.string,
  }).isRequired,
  category: PropTypes.object, // Can be null
  onComplete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TaskCard;