import { useEffect, useState } from 'react';
import { LuFileSpreadsheet } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import TaskStatusTabs from '../../components/TaskStatusTabs';
import { API_PATHS } from '../../utils/api_path';
import axiosInstance from '../../utils/axios_instance';

const ManageTasks = () => {
  const [allTasks, setAllTasks] = useState([]);

  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');

  const navigate = useNavigate();

  const getAllTasks = async () => {
    try {
      const statusParam = filterStatus === 'All' ? '' : filterStatus;

      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: { status: statusParam },
      });

      const tasks = response.data?.tasks ?? [];
      const statusSummary = response.data?.statusSummary ?? {};

      setAllTasks(tasks);

      // map status summary with default values
      const statusArray = [
        { label: 'All', count: statusSummary.all ?? 0 },
        { label: 'Pending', count: statusSummary.pendingTasks ?? 0 },
        { label: 'In Progress', count: statusSummary.inProgressTasks ?? 0 },
        { label: 'Completed', count: statusSummary.completedTasks ?? 0 },
      ];

      setTabs(statusArray);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleClick = (taskData) => {
    navigate(`/admin/create-task`, { state: { taskId: taskData._id } });
  };

  // download task report
  const handleDownloadReport = async () => {};

  useEffect(() => {
    getAllTasks(filterStatus);

    return () => {};
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="Manage Tasks">
      <div className="max-w-7xl mx-auto my-6 px-4 sm:px-6">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
          {/* page header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                My Tasks
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-400 mt-0.5">
                Manage and track all your assigned tasks
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownloadReport}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 active:scale-95 rounded-xl border border-emerald-200/60 shadow-2xs transition-all duration-200 cursor-pointer shrink-0"
            >
              <LuFileSpreadsheet className="text-base text-emerald-600" />
              <span>Download Report</span>
            </button>
          </div>

          {/* task filter tabs */}
          {allTasks?.length > 0 && (
            <div className="pt-1">
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageTasks;
