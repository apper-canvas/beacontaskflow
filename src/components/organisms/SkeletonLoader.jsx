import PropTypes from 'prop-types';
import SkeletonCard from '@/components/molecules/SkeletonCard';

const SkeletonLoader = ({ count = 3 }) => {
  return (
    <div className="space-y-4 max-w-full">
      {[...Array(count)].map((_, i) => (
        <SkeletonCard key={i} index={i} />
      ))}
    </div>
  );
};

SkeletonLoader.propTypes = {
  count: PropTypes.number,
};

export default SkeletonLoader;