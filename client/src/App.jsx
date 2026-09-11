import {
  Navigate,
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';

import UserProvider, { useUser } from './context/userContext';
import CreateTask from './pages/admin/CreateTask';
import Dashboard from './pages/admin/Dashboard';
import ManageTasks from './pages/admin/ManageTasks';
import ManageUsers from './pages/admin/ManageUsers';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import MyTasks from './pages/user/MyTasks';
import UserDashboard from './pages/user/UserDashboard';
import ViewTaskDetails from './pages/user/ViewTaskDetails';
import PrivateRoute from './routes/PrivateRoute';

const App = () => {
  return (
    <div>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<SignUp />} />

            {/* Admin Routes */}
            <Route element={<PrivateRoute allowedRoles={['admin']} />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/tasks" element={<ManageTasks />} />
              <Route path="/admin/create-tasks" element={<CreateTask />} />
              <Route path="/admin/users" element={<ManageUsers />} />
            </Route>

            {/* User Routes */}
            <Route element={<PrivateRoute allowedRoles={['admin']} />}>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/tasks" element={<MyTasks />} />
              <Route
                path="/user/task-details/:id"
                element={<ViewTaskDetails />}
              />
            </Route>

            {/* Default Route */}
            <Route path="/" element={<Root />} />
          </Routes>
        </Router>
      </UserProvider>
    </div>
  );
};

export default App;

const Root = () => {
  const { user, loading } = useUser();

  if (loading) return <Outlet />;

  if (!user) {
    return <Navigate to="/login" />;
  }
  return user.role === 'admin' ? (
    <Navigate to="/admin/dashboard" />
  ) : (
    <Navigate to="/user/dashboard" />
  );
};
