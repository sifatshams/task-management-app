import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/userContext';
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from '../../utils/data';

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useUser();
  const [sideMenuData, setSideMenuData] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate('/login');
  };

  const handleClick = (route) => {
    if (route === 'logout') {
      handleLogout();
    } else {
      navigate(route);
    }
  };

  useEffect(() => {
    if (user) {
      setSideMenuData(
        user?.role === 'admin' ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA,
      );
    }
  }, [user]);

  // fallback helpler for get the first letter of name
  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : 'U');

  return (
    <aside className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 sticky top-[61px] z-20 flex flex-col justify-between">
      <div>
        {/* profile section */}
        <div className="flex flex-col items-center justify-center mb-6 pt-6 px-4 text-center">
          <div className="relative group">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user?.name || 'User Profile'}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-slate-100 shadow-md group-hover:scale-105 transition-all duration-300"
              />
            ) : (
              /* fallback avatar */
              <div className="w-20 h-20 rounded-full bg-slate-900 text-white font-bold text-2xl flex items-center justify-center ring-4 ring-slate-100 shadow-md group-hover:scale-105 transition-all duration-300">
                {getInitial(user?.name)}
              </div>
            )}

            {/* admin badge overlay */}
            {user?.role === 'admin' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white bg-blue-600 shadow-blue-500/20 shadow-md px-2.5 py-0.5 rounded-full ring-2 ring-white tracking-wider uppercase whitespace-nowrap">
                Admin
              </span>
            )}
          </div>

          <div className="mt-3.5 space-y-0.5 w-full max-w-[200px]">
            <h5
              className="text-slate-800 font-semibold text-base leading-snug truncate"
              title={user?.name}
            >
              {user?.name || 'Guest User'}
            </h5>

            <p
              className="text-xs font-medium text-slate-400 truncate"
              title={user?.email}
            >
              {user?.email || 'guest@example.com'}
            </p>
          </div>
        </div>

        {/* navigation links */}
        <nav className="space-y-1">
          {sideMenuData.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.label;

            return (
              <button
                key={item.id || item.path}
                type="button"
                className={`w-full flex items-center gap-4 text-[15px] py-3 px-6 cursor-pointer transition-all duration-200 ${
                  isActive
                    ? 'text-primary bg-blue-50/60 font-medium border-r-4 border-primary'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => handleClick(item.path)}
              >
                <Icon className="text-xl" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default SideMenu;
