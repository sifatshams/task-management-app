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
        <div className="flex flex-col items-center justify-center mb-7 pt-5 px-4 text-center">
          <div className="relative">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user?.name || 'User Profile'}
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-100 shadow-sm"
              />
            ) : (
              /* if img not here */
              <div className="w-20 h-20 rounded-full bg-primary/10 text-primary font-semibold text-2xl flex items-center justify-center border-2 border-primary/20">
                {getInitial(user?.name)}
              </div>
            )}
          </div>

          {user?.role === 'admin' && (
            <span className="text-[10px] font-medium text-white bg-primary px-2.5 py-0.5 rounded-full mt-2 tracking-wide uppercase">
              Admin
            </span>
          )}

          <h5 className="text-gray-950 font-medium text-base leading-6 mt-3 line-clamp-1">
            {user?.name || 'Guest User'}
          </h5>

          <p className="text-[12px] text-gray-500 line-clamp-1">
            {user?.email || ''}
          </p>
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
