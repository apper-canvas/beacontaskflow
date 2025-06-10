import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Button from '@/components/atoms/Button';

const ErrorState = ({ message, onRetry }) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center py-12"
    >
      <div className="w-24 h-24 mx-auto bg-error/10 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-error" />
      </div>
      
      <Heading as="h3" className="text-xl mb-2">
        Something went wrong
      </Heading>
      
      <p className="text-surface-600 mb-6 max-w-sm mx-auto">
        {message}
      </p>
      
      {onRetry && (
        <Button
          onClick={onRetry}
          className="inline-flex items-center space-x-2 bg-primary text-white hover:brightness-110"
        >
          <ApperIcon name="RefreshCw" size={18} />
          <span>Try Again</span>
        </Button>
      )}
    </motion.div>
  );
};

ErrorState.propTypes = {
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func,
};

export default ErrorState;