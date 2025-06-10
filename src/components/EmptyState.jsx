import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center py-12"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="mb-6"
      >
        <div className="w-24 h-24 mx-auto bg-surface-100 rounded-full flex items-center justify-center">
          <ApperIcon name="ListTodo" className="w-12 h-12 text-surface-400" />
        </div>
      </motion.div>
      
      <h3 className="text-xl font-heading font-semibold text-surface-900 mb-2">
        {title}
      </h3>
      
      <p className="text-surface-600 mb-6 max-w-sm mx-auto">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:brightness-110 transition-all"
        >
          <ApperIcon name="Plus" size={18} />
          <span>{actionLabel}</span>
        </motion.button>
      )}
    </motion.div>
  );
}

export default EmptyState;