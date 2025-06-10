import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Button from '@/components/atoms/Button';

const EmptyState = ({ title, description, actionLabel, onAction }) => {
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
      
      <Heading as="h3" className="text-xl mb-2">
        {title}
      </Heading>
      
      <p className="text-surface-600 mb-6 max-w-sm mx-auto">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="inline-flex items-center space-x-2 bg-primary text-white hover:brightness-110"
        >
          <ApperIcon name="Plus" size={18} />
          <span>{actionLabel}</span>
        </Button>
      )}
    </motion.div>
  );
};

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
};

export default EmptyState;