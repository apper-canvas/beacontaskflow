import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const Button = ({ children, onClick, className = '', type = 'button', disabled = false, ...props }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-medium transition-all ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Button;