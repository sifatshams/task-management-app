import { useEffect, useState } from 'react';
import { LuSearch, LuTrash2, LuUsers } from 'react-icons/lu';
import { toast } from 'react-toastify';
import DeleteAlert from '../../components/DeleteAlert';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import Modal from '../../components/Modal';
import { API_PATHS } from '../../utils/api_path';
import axiosInstance from '../../utils/axios_instance';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [loading, setLoading] = useState(false);

  // modal state for delete confirmation
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  // fetch all users
  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      const data = response.data?.users || response.data || [];
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      toast.error('Failed to load users list');
    } finally {
      setLoading(false);
    }
  };

  // delete user handler
  const handleDeleteUser = async () => {
    if (!selectedUserId) return;
    try {
      await axiosInstance.delete(API_PATHS.USERS.DELETE_USER(selectedUserId));
      toast.success('User deleted successfully');
      setOpenDeleteModal(false);
      setSelectedUserId(null);
      fetchAllUsers(); // refresh list
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error('Failed to delete user');
    }
  };

  // search and filter logic
  useEffect(() => {
    let result = users;

    if (searchQuery.trim()) {
      result = result.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (roleFilter !== 'All') {
      result = result.filter(
        (user) => user.role?.toLowerCase() === roleFilter.toLowerCase(),
      );
    }

    setFilteredUsers(result);
  }, [searchQuery, roleFilter, users]);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <DashboardLayout activeMenu="Team Members">
      <div className="max-w-7xl mx-auto py-6 px-3 sm:px-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <LuUsers className="text-xl" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
                Manage Users
              </h1>
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-400 mt-1">
              View, filter, and control user access across the platform.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Total Users
              </span>
              <span className="text-lg font-bold text-slate-800">
                {users.length}
              </span>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs sm:text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 focus:bg-white focus:border-slate-800 focus:ring-4 focus:ring-slate-900/5 transition-all outline-none"
            />
          </div>

          {/* Role Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
            {['All', 'Admin', 'Member'].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  roleFilter === role
                    ? 'bg-white text-slate-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-5">User Info</th>
                  <th className="py-3.5 px-5">Role</th>
                  <th className="py-3.5 px-5">Joined Date</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {loading ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-12 text-slate-400 font-medium"
                    >
                      Loading users...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-12 text-slate-400 font-medium"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      {/* Name & Email */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          {user?.profileImage ? (
                            <img
                              src={user.profileImage}
                              alt={user.name}
                              className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-slate-800 line-clamp-1">
                              {user?.name || 'Unnamed User'}
                            </p>
                            <p className="text-xs text-slate-400 font-medium line-clamp-1">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-5">
                        {user?.role === 'admin' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            Member
                          </span>
                        )}
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-5 font-medium text-slate-500 text-xs">
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              },
                            )
                          : 'N/A'}
                      </td>

                      {/* Action Button */}
                      <td className="py-3.5 px-5 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedUserId(user._id);
                            setOpenDeleteModal(true);
                          }}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center"
                          title="Delete User"
                        >
                          <LuTrash2 className="text-base" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete User Modal */}
      <Modal
        isOpen={openDeleteModal}
        onClose={() => {
          setOpenDeleteModal(false);
          setSelectedUserId(null);
        }}
        title="Delete User Account"
      >
        <DeleteAlert
          content="Are you sure you want to remove this user? This action will revoke their access completely."
          onDelete={handleDeleteUser}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default ManageUsers;
