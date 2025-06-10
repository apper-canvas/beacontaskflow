import { useState } from 'react';
import ApperIcon from './ApperIcon';

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Search functionality will be implemented in task filtering
    console.log('Searching for:', searchTerm);
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="relative">
        <ApperIcon 
          name="Search" 
          size={18} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400"
        />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        />
      </div>
    </form>
  );
}

export default SearchBar;