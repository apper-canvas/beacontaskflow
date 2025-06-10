import { motion } from 'framer-motion';

function SkeletonLoader({ count = 3 }) {
  return (
    <div className="space-y-4 max-w-full">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-surface-200"
        >
          <div className="animate-pulse flex items-start space-x-3">
            <div className="w-1 h-16 bg-surface-200 rounded-full"></div>
            <div className="w-6 h-6 bg-surface-200 rounded-full flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <div className="h-4 bg-surface-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-surface-200 rounded w-1/2 mb-3"></div>
              <div className="flex space-x-3">
                <div className="h-6 bg-surface-200 rounded w-16"></div>
                <div className="h-6 bg-surface-200 rounded w-20"></div>
                <div className="h-6 bg-surface-200 rounded w-14"></div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default SkeletonLoader;