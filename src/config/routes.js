import AllTasksPage from '@/components/pages/AllTasksPage';
import TodayPage from '@/components/pages/TodayPage';
import UpcomingPage from '@/components/pages/UpcomingPage';
import CategoriesPage from '@/components/pages/CategoriesPage';
import CompletedPage from '@/components/pages/CompletedPage';

export const routes = {
  allTasks: {
    id: 'allTasks',
    label: 'All Tasks',
    path: '/all-tasks',
    icon: 'List',
component: AllTasksPage
  },
  today: {
    id: 'today',
    label: 'Today',
    path: '/today',
    icon: 'Calendar',
component: TodayPage
  },
  upcoming: {
    id: 'upcoming',
    label: 'Upcoming',
    path: '/upcoming',
    icon: 'Clock',
component: UpcomingPage
  },
  categories: {
    id: 'categories',
    label: 'Categories',
    path: '/categories',
    icon: 'Folder',
component: CategoriesPage
  },
  completed: {
    id: 'completed',
    label: 'Completed',
    path: '/completed',
    icon: 'CheckCircle',
component: CompletedPage
  }
};

export const routeArray = Object.values(routes);