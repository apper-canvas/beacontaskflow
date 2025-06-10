import PropTypes from 'prop-types';
import Heading from '@/components/atoms/Heading';

const HeaderSection = ({ title, description, actions, className = '' }) => {
  return (
    <div className={`flex-shrink-0 p-6 bg-white border-b border-surface-200 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <Heading as="h2" className="text-2xl capitalize">
            {title}
          </Heading>
          {description && <p className="text-surface-600 mt-1">{description}</p>}
        </div>
        {actions && <div className="flex items-center space-x-3">{actions}</div>}
      </div>
    </div>
  );
};

HeaderSection.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  actions: PropTypes.node,
  className: PropTypes.string,
};

export default HeaderSection;