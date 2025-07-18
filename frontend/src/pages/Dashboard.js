import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Calendar, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { reservationAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalReservations: 0,
    todayReservations: 0,
    pendingReservations: 0,
    averageWaitTime: 0
  });
  const [recentReservations, setRecentReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to get today's date string (YYYY-MM-DD)
  const getToday = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      const response = await reservationAPI.list(); // We'll add .list() in api.js
      const reservations = response.data.reservations || response.data || [];
      // Compute stats
      const today = getToday();
      const todayReservations = reservations.filter(r => r.date === today).length;
      const pendingReservations = reservations.filter(r => r.status === 'pending').length;
      // For demo, averageWaitTime is not calculated from data
      setStats({
        totalReservations: reservations.length,
        todayReservations,
        pendingReservations,
        averageWaitTime: 12 // Placeholder
      });
      // Show most recent 5
      setRecentReservations(reservations.slice(-5).reverse());
    } catch (error) {
      setStats({ totalReservations: 0, todayReservations: 0, pendingReservations: 0, averageWaitTime: 0 });
      setRecentReservations([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
    const interval = setInterval(fetchReservations, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card flex items-center space-x-4">
          <BarChart3 className="w-8 h-8 text-primary-600" />
          <div>
            <div className="text-2xl font-bold">{stats.totalReservations}</div>
            <div className="text-gray-600">Total Reservations</div>
          </div>
        </div>
        <div className="card flex items-center space-x-4">
          <Calendar className="w-8 h-8 text-green-600" />
          <div>
            <div className="text-2xl font-bold">{stats.todayReservations}</div>
            <div className="text-gray-600">Today</div>
          </div>
        </div>
        <div className="card flex items-center space-x-4">
          <AlertCircle className="w-8 h-8 text-yellow-600" />
          <div>
            <div className="text-2xl font-bold">{stats.pendingReservations}</div>
            <div className="text-gray-600">Pending</div>
          </div>
        </div>
        <div className="card flex items-center space-x-4">
          <Clock className="w-8 h-8 text-purple-600" />
          <div>
            <div className="text-2xl font-bold">{stats.averageWaitTime} min</div>
            <div className="text-gray-600">Avg. Wait</div>
          </div>
        </div>
      </div>

      {/* Recent Reservations */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Recent Reservations
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Party Size</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Table</th>
              </tr>
            </thead>
            <tbody>
              {recentReservations.map((r, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2 whitespace-nowrap">{r.customerName || r.customer_name || r.name}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{r.partySize || r.party_size}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{r.time || r.reservation_time}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(r.status)}`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">{r.tableNumber || r.table_number || r.table_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 