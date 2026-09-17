import { useEffect, useState } from 'react';
import { LuCheck, LuUser } from 'react-icons/lu';
import { API_PATHS } from '../../utils/api_path';
import axiosInstance from '../../utils/axios_instance';
import Modal from '../Modal';

const SelectUsers = ({ selectedUsers = [], setSelectedUsers }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedUsers, setTempSelectedUsers] = useState([]);

  // get all users from API
  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);

      // response structure handling
      const usersData = Array.isArray(response.data)
        ? response.data
        : response.data?.users || response.data?.data || [];

      setAllUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const toggleUserSelection = (userId) => {
    setTempSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleAssign = () => {
    setSelectedUsers(tempSelectedUsers);
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setTempSelectedUsers(selectedUsers);
    setIsModalOpen(true);
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // filter selected user avatars
  const selectedUserObjects = allUsers.filter((user) =>
    selectedUsers.includes(user._id),
  );

  return (
    <div className="space-y-3 mt-1">
      {/* trigger button & selected avatars */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={handleOpenModal}
          className="inline-flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:text-blue-600 bg-slate-50 hover:bg-blue-50/80 active:scale-95 rounded-lg border border-slate-200/80 transition-all duration-150 cursor-pointer shadow-2xs"
        >
          <LuUser className="text-sm" />
          <span>
            {selectedUsers.length > 0 ? 'Edit Members' : 'Add Members'}
          </span>
        </button>

        {/* selected users avatar list */}
        <div className="flex items-center -space-x-2 overflow-hidden">
          {selectedUserObjects.map((user) => (
            <div
              key={user._id}
              className="h-8 w-8 rounded-full ring-2 ring-white overflow-hidden bg-slate-800 text-white font-medium text-xs flex items-center justify-center"
              title={user.name}
            >
              {user.profileImage || user.ProfileImage ? (
                <img
                  src={user.profileImage || user.ProfileImage}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                user.name?.charAt(0)?.toUpperCase()
              )}
            </div>
          ))}
        </div>
      </div>

      {/* select users modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Select Users"
      >
        <div className="space-y-4">
          <div className="space-y-2 max-h-[45vh] overflow-y-auto pr-1 custom-scrollbar">
            {allUsers.length > 0 ? (
              allUsers.map((user) => {
                const isSelected = tempSelectedUsers.includes(user._id);

                return (
                  <div
                    key={user._id}
                    onClick={() => toggleUserSelection(user._id)}
                    className={`flex items-center gap-3.5 p-3 rounded-xl border transition-all duration-150 cursor-pointer select-none ${
                      isSelected
                        ? 'bg-slate-900/5 border-slate-900/20 shadow-xs'
                        : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50/60'
                    }`}
                  >
                    {/* user profile avatar */}
                    <div className="relative shrink-0">
                      {user.profileImage || user.ProfileImage ? (
                        <img
                          src={user.profileImage || user.ProfileImage}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200/60 shadow-xs"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-800 text-white font-semibold text-sm flex items-center justify-center shadow-xs">
                          {user.name?.charAt(0)?.toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* user details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs font-normal text-slate-400 truncate">
                        {user.email}
                      </p>
                    </div>

                    {/* checkbox icon */}
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 shrink-0 ${
                        isSelected
                          ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && (
                        <LuCheck className="w-3.5 h-3.5 stroke-[3]" />
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-slate-400 text-sm">
                No users found.
              </div>
            )}
          </div>

          {/* modal action footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-150 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAssign}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all duration-150 cursor-pointer shadow-xs"
            >
              Apply Selection
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SelectUsers;
