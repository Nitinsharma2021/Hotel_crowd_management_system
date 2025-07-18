import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Search, Filter, MoreHorizontal } from 'lucide-react';
import { reservationAPI } from '../services/api';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      const response = await reservationAPI.list();
      const data = response.data.reservations || response.data || [];
      setReservations(data);
      setFilteredReservations(data);
    } catch (error) {
      setReservations([]);
      setFilteredReservations([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
    const interval = setInterval(fetchReservations, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = reservations;
    if (searchTerm) {
      filtered = filtered.filter(reservation =>
        (reservation.customerName || reservation.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (reservation.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (reservation.phone || '').includes(searchTerm)
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(reservation => reservation.status === statusFilter);
    }
    setFilteredReservations(filtered);
  }, [reservations, searchTerm, statusFilter]);

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone"
            className="input-field"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            className="input-field"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      <div className="card overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Party Size</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Table</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.map((r, idx) => (
              <tr key={idx}>
                <td className="px-4 py-2 whitespace-nowrap">{r.customerName || r.customer_name || r.name}</td>
                <td className="px-4 py-2 whitespace-nowrap">{r.email}</td>
                <td className="px-4 py-2 whitespace-nowrap">{r.phone || r.phone_number}</td>
                <td className="px-4 py-2 whitespace-nowrap">{r.partySize || r.party_size}</td>
                <td className="px-4 py-2 whitespace-nowrap">{formatDate(r.date || r.reservation_time)}</td>
                <td className="px-4 py-2 whitespace-nowrap">{(r.time || (r.reservation_time && new Date(r.reservation_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })) )}</td>
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
  );
};

export default Reservations; 