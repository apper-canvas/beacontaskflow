import PropTypes from 'prop-types';

const Heading = ({ as: Component = 'h2', children, className = '' }) => {
  return (
    <Component className={`font-heading font-bold text-surface-900 ${className}`}>
      {children}
    </Component>
  );
};

Heading.propTypes = {
  as: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Heading;