import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

function ErrorState({ message, onRetry }) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center py-12"
    >
      <div className="w-24 h-24 mx-auto bg-error/10 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-error" />
      </div>
      
      <h3 className="text-xl font-heading font-semibold text-surface-900 mb-2">
        Something went wrong
      </h3>
      
      <p className="text-surface-600 mb-6 max-w-sm mx-auto">
        {message}
      </p>
      
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:brightness-110 transition-all"
        >
          <ApperIcon name="RefreshCw" size={18} />
          <span>Try Again</span>
        </motion.button>
      )}
    </motion.div>
  );
}

export default ErrorState;