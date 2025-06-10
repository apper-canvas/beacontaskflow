import PropTypes from 'prop-types';
import ModalContainer from '@/components/molecules/ModalContainer';
import CategoryForm from '@/components/organisms/CategoryForm';

const CategoryModal = ({ isOpen, category, onClose, onSave, isSubmitting = false }) => {
  return (
    <ModalContainer 
      isOpen={isOpen} 
      title={category ? 'Edit Category' : 'Create Category'} 
      onClose={onClose}
    >
      <CategoryForm 
        category={category} 
        onSave={onSave} 
        onCancel={onClose} 
        isSubmitting={isSubmitting} 
      />
    </ModalContainer>
  );
};

CategoryModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  category: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};

export default CategoryModal;