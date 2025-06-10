import PropTypes from 'prop-types';
import ModalContainer from '@/components/molecules/ModalContainer';
import TaskForm from '@/components/organisms/TaskForm';

const TaskModal = ({ task, categories, onClose, onSave, isSubmitting = false }) => {
  return (
    <ModalContainer 
      isOpen={true} // TaskModal is only rendered when it should be open
      title={task ? 'Edit Task' : 'Create New Task'} 
      onClose={onClose}
    >
      <TaskForm 
        task={task} 
        categories={categories} 
        onSave={onSave} 
        onCancel={onClose}
        isSubmitting={isSubmitting} 
      />
    </ModalContainer>
  );
};

TaskModal.propTypes = {
  task: PropTypes.object,
  categories: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};

export default TaskModal;