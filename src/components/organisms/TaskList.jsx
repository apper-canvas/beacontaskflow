import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import TaskCard from '@/components/organisms/TaskCard';
import EmptyState from '@/components/molecules/EmptyState';

const TaskList = ({ tasks, categories, onCompleteTask, onEditTask, onDeleteTask, filter, onAddTask }) => {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      {tasks.length === 0 ? (
        <EmptyState
          title={filter === 'completed' ? 'No completed tasks' : 'No tasks found'}
          description={filter === 'completed' 
            ? 'Complete some tasks to see them here' 
            : 'Create your first task to get started'
          }
          actionLabel="Create Task"
          onAction={onAddTask}
        />
      ) : (
        <motion.div 
          className="space-y-4 max-w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <AnimatePresence>
            {tasks.map((task, index) => (
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
                  onComplete={() => onCompleteTask(task.id)}
                  onEdit={() => onEditTask(task)}
                  onDelete={() => onDeleteTask(task.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

TaskList.propTypes = {
  tasks: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  onCompleteTask: PropTypes.func.isRequired,
  onEditTask: PropTypes.func.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
  filter: PropTypes.string,
  onAddTask: PropTypes.func.isRequired,
};

export default TaskList;