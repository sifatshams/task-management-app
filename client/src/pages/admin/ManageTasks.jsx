import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/DashboardLayout';
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

      // Map status summary with default values
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
      <div className="my-5"></div>
    </DashboardLayout>
  );
};

export default ManageTasks;
