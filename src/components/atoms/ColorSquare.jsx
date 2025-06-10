import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const ColorSquare = ({ color, isSelected, onClick, className = '', ...props }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      type="button"
      onClick={onClick}
      className={`w-10 h-10 rounded-lg border-2 transition-all ${
        isSelected ? 'border-surface-900 scale-110' : 'border-surface-200'
      } ${className}`}
      style={{ backgroundColor: color }}
      {...props}
    />
  );
};

ColorSquare.propTypes = {
  color: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default ColorSquare;