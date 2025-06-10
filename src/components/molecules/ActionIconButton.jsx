import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const ActionIconButton = ({ icon, onClick, className = '', iconSize = 16, ...props }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`p-2 rounded-lg transition-colors ${className}`}
      {...props}
    >
      <ApperIcon name={icon} size={iconSize} />
    </motion.button>
  );
};

ActionIconButton.propTypes = {
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  iconSize: PropTypes.number,
};

export default ActionIconButton;