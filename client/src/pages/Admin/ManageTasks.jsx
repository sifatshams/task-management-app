import { useEffect, useState } from 'react';
import { LuFileSpreadsheet } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import TaskCard from '../../components/Card/TaskCard';
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
    navigate(`/admin/update-task/${taskData._id}`);
  };

  // download task report as CSV
  const handleDownloadReport = () => {
    if (!allTasks || allTasks.length === 0) {
      alert('No tasks available to download.');
      return;
    }

    // CSV headers
    const headers = [
      'Task Title',
      'Description',
      'Priority',
      'Status',
      'Progress (%)',
      'Created At',
      'Due Date',
      'Checklist Total',
      'Checklist Completed',
    ];

    // map tasks to CSV rows
    const rows = allTasks.map((task) => [
      `"${(task.title || '').replace(/"/g, '""')}"`,
      `"${(task.description || '').replace(/"/g, '""')}"`,
      `"${task.priority || 'Low'}"`,
      `"${task.status || 'Pending'}"`,
      `"${task.progress || 0}"`,
      `"${task.createdAt ? new Date(task.createdAt).toLocaleDateString() : ''}"`,
      `"${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ''}"`,
      `"${task.todoCheckList?.length || 0}"`,
      `"${task.completedTodoCount || 0}"`,
    ]);

    // construct CSV content
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    // create a temporary link element to trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Task_Report_${filterStatus.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    getAllTasks();
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="Manage Tasks">
      <div className="max-w-7xl mx-auto my-6 px-4 sm:px-6 space-y-6">
        {/* top filter and header box */}
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
          {tabs?.[0]?.count > 0 && (
            <div className="pt-1">
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />
            </div>
          )}
        </div>

        {/* task cards grid container */}
        {allTasks?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {allTasks.map((item) => (
              <TaskCard
                key={item._id}
                title={item.title}
                description={item.description}
                priority={item.priority}
                status={item.status}
                progress={item.progress}
                createdAt={item.createdAt}
                dueDate={item.dueDate}
                assignedTo={item.assignedTo?.map((u) => u.profileImage)}
                attachmentsCount={item.attachments?.length || 0}
                completedTodoCount={item.completedTodoCount || 0}
                todoCheckList={item.todoCheckList || []}
                onClick={() => handleClick(item)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-xs">
            <p className="text-sm font-semibold text-slate-500">
              No tasks found for this status.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageTasks;
