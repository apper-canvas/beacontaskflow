import PropTypes from 'prop-types';
import Label from '@/components/atoms/Label';
import Input from '@/components/atoms/Input';

const FormField = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  rows,
  options,
  error,
  required = false,
  ...props
}) => {
  const inputClass = error ? 'border-error' : 'border-surface-200';

  return (
    <div>
      <Label htmlFor={name}>
        {label} {required && '*'}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className={inputClass}
        placeholder={placeholder}
        rows={rows}
        options={options}
        {...props}
      />
      {error && (
        <p className="text-error text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  options: PropTypes.array,
  error: PropTypes.string,
  required: PropTypes.bool,
};

export default FormField;