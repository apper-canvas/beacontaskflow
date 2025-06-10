import taskData from '../mockData/tasks.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TaskService {
  constructor() {
    this.tasks = [...taskData];
  }

  async getAll() {
    await delay(300);
    return [...this.tasks];
  }

  async getById(id) {
    await delay(200);
    const task = this.tasks.find(t => t.id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    return { ...task };
  }

  async create(taskData) {
    await delay(400);
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      createdAt: new Date().toISOString(),
      completedAt: taskData.status === 'completed' ? new Date().toISOString() : null,
      order: this.tasks.length
    };
    this.tasks.push(newTask);
    return { ...newTask };
  }

  async update(id, updates) {
    await delay(350);
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    const updatedTask = {
      ...this.tasks[index],
      ...updates
    };
    
    // Set completedAt if status changes to completed
    if (updates.status === 'completed' && this.tasks[index].status !== 'completed') {
      updatedTask.completedAt = new Date().toISOString();
    } else if (updates.status !== 'completed') {
      updatedTask.completedAt = null;
    }
    
    this.tasks[index] = updatedTask;
    return { ...updatedTask };
  }

  async delete(id) {
    await delay(250);
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    this.tasks.splice(index, 1);
    return true;
  }
}

export default new TaskService();