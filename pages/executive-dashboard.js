import dynamic from 'next/dynamic';

const Dashboard = dynamic(() => import('../src/pages/ExecDashboard'), {
  ssr: false,
});

export default Dashboard;
