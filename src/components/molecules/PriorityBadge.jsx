import PropTypes from 'prop-types';
import Badge from '@/components/atoms/Badge';

const PriorityBadge = ({ priority, className = '' }) => {
  const getPriorityColor = (prio) => {
    switch (prio) {
      case 'urgent': return 'bg-error text-white';
      case 'high': return 'bg-warning text-surface-900';
      case 'medium': return 'bg-info text-white';
      case 'low': return 'bg-surface-300 text-surface-700';
      default: return 'bg-surface-300 text-surface-700';
    }
  };

  return (
    <Badge className={`${getPriorityColor(priority)} ${className}`}>
      {priority}
    </Badge>
  );
};

PriorityBadge.propTypes = {
  priority: PropTypes.oneOf(['low', 'medium', 'high', 'urgent']).isRequired,
  className: PropTypes.string,
};

export default PriorityBadge;