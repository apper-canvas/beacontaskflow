import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import ActionIconButton from '@/components/molecules/ActionIconButton';
import Heading from '@/components/atoms/Heading';

const CategoryList = ({ categories, onEdit, onDelete, getCategoryTaskCount }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-full">
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-surface-200 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                style={{ backgroundColor: category.color }}
              >
                <ApperIcon name={category.icon} size={24} />
              </div>
              <div>
                <Heading as="h3" className="font-semibold text-base">
                  {category.name}
                </Heading>
                <p className="text-sm text-surface-600">
                  {getCategoryTaskCount(category.id)} tasks
                </p>
              </div>
            </div>
            
            <div className="flex space-x-1">
              <ActionIconButton
                icon="Edit2"
                onClick={() => onEdit(category)}
                className="p-2 text-surface-400 hover:text-primary rounded-lg"
              />
              
              <ActionIconButton
                icon="Trash2"
                onClick={() => onDelete(category.id)}
                className="p-2 text-surface-400 hover:text-error rounded-lg"
              />
            </div>
          </div>
          
          <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                backgroundColor: category.color,
                width: `${Math.min(getCategoryTaskCount(category.id) * 10, 100)}%`
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

CategoryList.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
  })).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  getCategoryTaskCount: PropTypes.func.isRequired,
};

export default CategoryList;