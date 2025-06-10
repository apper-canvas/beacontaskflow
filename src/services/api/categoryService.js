import categoryData from '../mockData/categories.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CategoryService {
  constructor() {
    this.categories = [...categoryData];
  }

  async getAll() {
    await delay(250);
    return [...this.categories];
  }

  async getById(id) {
    await delay(200);
    const category = this.categories.find(c => c.id === id);
    if (!category) {
      throw new Error('Category not found');
    }
    return { ...category };
  }

  async create(categoryData) {
    await delay(350);
    const newCategory = {
      id: Date.now().toString(),
      ...categoryData,
      taskCount: 0
    };
    this.categories.push(newCategory);
    return { ...newCategory };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Category not found');
    }
    
    const updatedCategory = {
      ...this.categories[index],
      ...updates
    };
    
    this.categories[index] = updatedCategory;
    return { ...updatedCategory };
  }

  async delete(id) {
    await delay(250);
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Category not found');
    }
    this.categories.splice(index, 1);
    return true;
  }
}

export default new CategoryService();