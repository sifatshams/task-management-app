import moment from 'moment';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InfoCard from '../../components/Card/InfoCard';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUser } from '../../context/userContext';
import { useUserAuth } from '../../hooks/useUserAuth';
import { API_PATHS } from '../../utils/api_path';
import axiosInstance from '../../utils/axios_instance';
import { addThousandsSeparator } from '../../utils/helper';

const Dashboard = () => {
  useUserAuth();

  const { user } = useUser();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  // get dash data
  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_DASHBOARD_DATA,
      );
      // validation
      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
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

        {/* 
            - grid-cols-1: একবারে ছোট মোবাইলে ১ টি করে কার্ড দেখাবে।
            - sm:grid-cols-2: মাঝারি ডিভাইসে (যেমন বড় ফোন/ট্যাব) ২ টি দেখাবে।
            - lg:grid-cols-4: বড় স্ক্রিনে ৪ টি দেখাবে।
        */}
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
            color="bg-violet-500"
          />

          <InfoCard
            label="In Progress Tasks"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.InProgress || 0,
            )}
            color="bg-cyan-500"
          />

          <InfoCard
            label="Completed Tasks"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.Completed || 0,
            )}
            color="bg-lime-500"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;