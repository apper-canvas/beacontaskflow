import { toast } from 'react-toastify';

class CategoryService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'category';
    
    // Define updateable fields based on Tables & Fields visibility
    this.updateableFields = [
      'Name', 'Tags', 'Owner', 'color', 'icon', 'task_count'
    ];
    
    // All fields for fetch operations
    this.allFields = [
      'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
      'color', 'icon', 'task_count'
    ];
  }

  async getAll() {
    try {
      const params = {
        fields: this.allFields,
        orderBy: [
          {
            fieldName: "Name",
            SortType: "ASC"
          }
        ]
      };
      
      const response = await this.client.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      // Transform database records to match existing component expectations
      const transformedCategories = response.data?.map(record => ({
        id: record.Id?.toString(),
        name: record.Name || '',
        color: record.color || '#5B47E0',
        icon: record.icon || 'Folder',
        taskCount: record.task_count || 0
      })) || [];
      
      return transformedCategories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: this.allFields
      };
      
      const response = await this.client.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (!response.data) {
        throw new Error('Category not found');
      }
      
      // Transform database record to match existing component expectations
      const record = response.data;
      return {
        id: record.Id?.toString(),
        name: record.Name || '',
        color: record.color || '#5B47E0',
        icon: record.icon || 'Folder',
        taskCount: record.task_count || 0
      };
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      throw error;
    }
  }

  async create(categoryData) {
    try {
      // Filter to only include updateable fields and transform for database
      const dbRecord = {
        Name: categoryData.name || 'Untitled Category',
        color: categoryData.color || '#5B47E0',
        icon: categoryData.icon || 'Folder',
        task_count: 0
      };
      
      const params = {
        records: [dbRecord]
      };
      
      const response = await this.client.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${failedRecords}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to create category');
        }
        
        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          // Transform back to component format
          const record = successfulRecord.data;
          return {
            id: record.Id?.toString(),
            name: record.Name || '',
            color: record.color || '#5B47E0',
            icon: record.icon || 'Folder',
            taskCount: record.task_count || 0
          };
        }
      }
      
      throw new Error('No successful records returned');
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }

  async update(id, updates) {
    try {
      // Filter to only include updateable fields and transform for database
      const dbUpdates = {
        Id: parseInt(id)
      };
      
      if (updates.name !== undefined) dbUpdates.Name = updates.name;
      if (updates.color !== undefined) dbUpdates.color = updates.color;
      if (updates.icon !== undefined) dbUpdates.icon = updates.icon;
      if (updates.taskCount !== undefined) dbUpdates.task_count = updates.taskCount;
      
      const params = {
        records: [dbUpdates]
      };
      
      const response = await this.client.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${failedRecords}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to update category');
        }
        
        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          // Transform back to component format
          const record = successfulRecord.data;
          return {
            id: record.Id?.toString(),
            name: record.Name || '',
            color: record.color || '#5B47E0',
            icon: record.icon || 'Folder',
            taskCount: record.task_count || 0
          };
        }
      }
      
      throw new Error('No successful records returned');
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.client.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${failedRecords}`);
          
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to delete category');
        }
        
        return true;
      }
      
      throw new Error('No results returned');
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  }
}

export default new CategoryService();