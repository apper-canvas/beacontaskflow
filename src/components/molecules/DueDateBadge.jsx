import PropTypes from 'prop-types';
import { format, isToday, isPast, isThisWeek } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';

const DueDateBadge = ({ dueDate, className = '' }) => {
  if (!dueDate) return null;

  const date = new Date(dueDate);
  const isOverdue = isPast(date) && !isToday(date);
  
  let label = format(date, 'MMM d');
  if (isToday(date)) label = 'Today';
  else if (isThisWeek(date)) label = format(date, 'EEEE');

  const colorClass = isOverdue ? 'text-error' : 'text-surface-600';

  return (
    <span className={`text-xs flex items-center space-x-1 ${colorClass} ${className}`}>
      <ApperIcon name="Calendar" size={12} />
      <span>{label}</span>
    </span>
  );
};

DueDateBadge.propTypes = {
  dueDate: PropTypes.string, // ISO string
  className: PropTypes.string,
};

export default DueDateBadge;