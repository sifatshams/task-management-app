import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { LuArrowRight } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import InfoCard from '../../components/Card/InfoCard';
import CustomBarChart from '../../components/Charts/CustomBarChart';
import CustomPieChart from '../../components/Charts/CustomPieChart';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import TaskListTable from '../../components/TaskListTable';
import { useUser } from '../../context/userContext';
import { useUserAuth } from '../../hooks/useUserAuth';
import { API_PATHS } from '../../utils/api_path';
import axiosInstance from '../../utils/axios_instance';
import { addThousandsSeparator } from '../../utils/helper';

const COLORS = ['#8D51FF', '#00B8DB', '#7BCE00'];

const Dashboard = () => {
  useUserAuth();

  const { user } = useUser();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  // prepare chart data
  const prepareChartData = useCallback((data) => {
    if (!data?.charts) return;

    const { taskDistribution = {}, taskPriorityLevels = {} } = data.charts;

    const pieData = [
      { status: 'Pending', count: taskDistribution.Pending || 0 },
      { status: 'In Progress', count: taskDistribution.InProgress || 0 },
      { status: 'Completed', count: taskDistribution.Completed || 0 },
    ];

    const barData = [
      { priority: 'Low', count: taskPriorityLevels.Low || 0 },
      { priority: 'Medium', count: taskPriorityLevels.Medium || 0 },
      { priority: 'High', count: taskPriorityLevels.High || 0 },
    ];

    setPieChartData(pieData);
    setBarChartData(barData);
  }, []);

  // get dash data
  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_DASHBOARD_DATA,
      );

      if (response.data) {
        setDashboardData(response.data);
        prepareChartData(response.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const onSeeMore = () => {
    navigate('/admin/tasks');
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="card my-5 p-4 md:p-6">
        <div>
          <div className="col-span-3">
            <h2 className="text-xl md:text-2xl font-semibold">
              Good Morning! {user?.name}
            </h2>
            <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
              {moment().format('dddd Do MMM YYYY')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-6">
          <InfoCard
            label="Total Tasks"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.All || 0,
            )}
            color="bg-primary"
          />

          <InfoCard
            label="Pending Tasks"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.Pending || 0,
            )}
            color="bg-amber-500"
          />

          <InfoCard
            label="In Progress Tasks"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.InProgress ||
                dashboardData?.charts?.taskDistribution?.['In Progress'] ||
                0,
            )}
            color="bg-blue-500"
          />

          <InfoCard
            label="Completed Tasks"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.Completed || 0,
            )}
            color="bg-emerald-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
        <div>
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="font-medium">Task Distribution</h5>
            </div>

            <CustomPieChart data={pieChartData} colors={COLORS} />
          </div>
        </div>

        <div>
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="font-medium">Task Priority Levels</h5>
            </div>

            <CustomBarChart data={barChartData} />
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <h5 className="text-lg">Recent Tasks</h5>

              <button className="card-btn" onClick={onSeeMore}>
                See All <LuArrowRight className="text-base" />
              </button>
            </div>

            <TaskListTable tableData={dashboardData?.recentTasks || []} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
