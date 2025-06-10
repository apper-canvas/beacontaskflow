import { toast } from 'react-toastify';

class TaskService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'task';
    
    // Define updateable fields based on Tables & Fields visibility
    this.updateableFields = [
      'Name', 'Tags', 'Owner', 'title', 'description', 'category_id', 
      'priority', 'status', 'due_date', 'created_at', 'completed_at', 'order'
    ];
    
    // All fields for fetch operations
    this.allFields = [
      'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
      'title', 'description', 'category_id', 'priority', 'status', 'due_date', 
      'created_at', 'completed_at', 'order'
    ];
  }

  async getAll() {
    try {
      const params = {
        fields: this.allFields,
        orderBy: [
          {
            fieldName: "due_date",
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
      const transformedTasks = response.data?.map(record => ({
        id: record.Id?.toString(),
        title: record.title || record.Name || '',
        description: record.description || '',
        categoryId: record.category_id?.toString(),
        priority: record.priority || 'medium',
        status: record.status || 'pending',
        dueDate: record.due_date,
        createdAt: record.created_at || record.CreatedOn,
        completedAt: record.completed_at,
        order: record.order || 0
      })) || [];
      
      return transformedTasks;
    } catch (error) {
      console.error("Error fetching tasks:", error);
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
        throw new Error('Task not found');
      }
      
      // Transform database record to match existing component expectations
      const record = response.data;
      return {
        id: record.Id?.toString(),
        title: record.title || record.Name || '',
        description: record.description || '',
        categoryId: record.category_id?.toString(),
        priority: record.priority || 'medium',
        status: record.status || 'pending',
        dueDate: record.due_date,
        createdAt: record.created_at || record.CreatedOn,
        completedAt: record.completed_at,
        order: record.order || 0
      };
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      throw error;
    }
  }

  async create(taskData) {
    try {
      // Filter to only include updateable fields and transform for database
      const dbRecord = {
        Name: taskData.title || 'Untitled Task',
        title: taskData.title || 'Untitled Task',
        description: taskData.description || '',
        category_id: parseInt(taskData.categoryId) || null,
        priority: taskData.priority || 'medium',
        status: taskData.status || 'pending',
        due_date: taskData.dueDate || null,
        created_at: new Date().toISOString(),
        completed_at: taskData.status === 'completed' ? new Date().toISOString() : null,
        order: taskData.order || 0
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
          throw new Error('Failed to create task');
        }
        
        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          // Transform back to component format
          const record = successfulRecord.data;
          return {
            id: record.Id?.toString(),
            title: record.title || record.Name || '',
            description: record.description || '',
            categoryId: record.category_id?.toString(),
            priority: record.priority || 'medium',
            status: record.status || 'pending',
            dueDate: record.due_date,
            createdAt: record.created_at || record.CreatedOn,
            completedAt: record.completed_at,
            order: record.order || 0
          };
        }
      }
      
      throw new Error('No successful records returned');
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }

  async update(id, updates) {
    try {
      // Filter to only include updateable fields and transform for database
      const dbUpdates = {
        Id: parseInt(id)
      };
      
      if (updates.title !== undefined) {
        dbUpdates.Name = updates.title;
        dbUpdates.title = updates.title;
      }
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.categoryId !== undefined) dbUpdates.category_id = parseInt(updates.categoryId) || null;
      if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate;
      if (updates.order !== undefined) dbUpdates.order = updates.order;
      
      // Handle completed_at automatically based on status
      if (updates.status === 'completed') {
        dbUpdates.completed_at = new Date().toISOString();
      } else if (updates.status && updates.status !== 'completed') {
        dbUpdates.completed_at = null;
      } else if (updates.completedAt !== undefined) {
        dbUpdates.completed_at = updates.completedAt;
      }
      
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
          throw new Error('Failed to update task');
        }
        
        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          // Transform back to component format
          const record = successfulRecord.data;
          return {
            id: record.Id?.toString(),
            title: record.title || record.Name || '',
            description: record.description || '',
            categoryId: record.category_id?.toString(),
            priority: record.priority || 'medium',
            status: record.status || 'pending',
            dueDate: record.due_date,
            createdAt: record.created_at || record.CreatedOn,
            completedAt: record.completed_at,
            order: record.order || 0
          };
        }
      }
      
      throw new Error('No successful records returned');
    } catch (error) {
      console.error("Error updating task:", error);
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
          throw new Error('Failed to delete task');
        }
        
        return true;
      }
      
      throw new Error('No results returned');
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }
}

export default new TaskService();