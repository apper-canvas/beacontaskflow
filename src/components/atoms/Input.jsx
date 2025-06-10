import PropTypes from 'prop-types';

const Input = ({ type = 'text', value, onChange, className = '', placeholder = '', rows = 3, options = [], ...props }) => {
  const baseClass = `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${className}`;

  if (type === 'textarea') {
    return (
      <textarea
        value={value}
        onChange={onChange}
        rows={rows}
        className={`${baseClass} resize-none`}
        placeholder={placeholder}
        {...props}
      />
    );
  }

  if (type === 'select') {
    return (
      <select
        value={value}
        onChange={onChange}
        className={baseClass}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      className={baseClass}
      placeholder={placeholder}
      {...props}
    />
  );
};

Input.propTypes = {
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
  })),
};

export default Input;