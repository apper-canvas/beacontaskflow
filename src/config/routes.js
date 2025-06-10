import AllTasks from '../pages/AllTasks';
import Today from '../pages/Today';
import Upcoming from '../pages/Upcoming';
import Categories from '../pages/Categories';
import Completed from '../pages/Completed';

export const routes = {
  allTasks: {
    id: 'allTasks',
    label: 'All Tasks',
    path: '/all-tasks',
    icon: 'List',
    component: AllTasks
  },
  today: {
    id: 'today',
    label: 'Today',
    path: '/today',
    icon: 'Calendar',
    component: Today
  },
  upcoming: {
    id: 'upcoming',
    label: 'Upcoming',
    path: '/upcoming',
    icon: 'Clock',
    component: Upcoming
  },
  categories: {
    id: 'categories',
    label: 'Categories',
    path: '/categories',
    icon: 'Folder',
    component: Categories
  },
  completed: {
    id: 'completed',
    label: 'Completed',
    path: '/completed',
    icon: 'CheckCircle',
    component: Completed
  }
};

export const routeArray = Object.values(routes);