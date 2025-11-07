import { useState } from 'react';
import { useBookings } from '../hooks/useRealtimeData';
import { supabase } from '../lib/supabase';
import { Calendar, Mail, Building2, Filter, X, Phone, Globe, Clock } from 'lucide-react';

export function BookingsPage() {
  const { data: bookings, isLoading } = useBookings();
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  const filteredBookings = bookings?.filter((booking) => {
    return !statusFilter || booking.status === statusFilter;
  });

  const activeFilters = statusFilter ? 1 : 0;

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('consultancy_bookings_v2')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Consultancy Bookings</h1>
        <p className="text-slate-600 mt-2">
          {filteredBookings?.length || 0} of {bookings?.length || 0} bookings
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center space-x-3">
          <Filter className="w-4 h-4 text-slate-600" />
          <span className="text-sm font-medium text-slate-700">Status Filter:</span>
          {activeFilters > 0 && (
            <span className="text-xs bg-brand-purple/10 text-brand-purple px-2 py-1 rounded-full">
              {activeFilters} active
            </span>
          )}

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
          </select>

          {activeFilters > 0 && (
            <button
              onClick={() => setStatusFilter('')}
              className="flex items-center space-x-1 text-sm text-slate-600 hover:text-slate-900"
            >
              <X className="w-4 h-4" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-600">Loading bookings...</div>
        ) : filteredBookings && filteredBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Facility
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">
                        {booking.full_name || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600">{booking.email || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600">{booking.facility || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900 max-w-xs truncate">{booking.product_service}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600">
                        {booking.preferred_date
                          ? `${new Date(booking.preferred_date).toLocaleDateString()} ${booking.preferred_time || ''}`
                          : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                        className={`px-2 py-1 text-xs font-medium rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-brand-purple ${
                          booking.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-700'
                            : booking.status === 'Scheduled'
                            ? 'bg-blue-100 text-blue-700'
                            : booking.status === 'Reviewed'
                            ? 'bg-violet-100 text-violet-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedBooking(booking.id)}
                        className="text-sm text-brand-purple hover:text-brand-teal font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-600">No bookings found</div>
        )}
      </div>

      {selectedBooking && (
        <BookingDetailsModal
          bookingId={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
}

function BookingDetailsModal({ bookingId, onClose }: { bookingId: string; onClose: () => void }) {
  const { data: bookings } = useBookings();
  const booking = bookings?.find((b) => b.id === bookingId);

  if (!booking) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Booking Details</h2>
          <p className="text-sm text-slate-600 mt-1">Complete consultation booking information</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-600 mb-1">Contact Name</p>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-brand-purple/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-brand-purple">
                      {booking.full_name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-slate-900">{booking.full_name}</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-600 mb-1">Email</p>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-900">{booking.email || '-'}</span>
                </div>
              </div>

              {booking.phone && (
                <div>
                  <p className="text-sm text-slate-600 mb-1">Phone</p>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-900">{booking.phone}</span>
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm text-slate-600 mb-1">Facility</p>
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-900">{booking.facility || '-'}</span>
                </div>
              </div>

              {booking.website && (
                <div>
                  <p className="text-sm text-slate-600 mb-1">Website</p>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-slate-400" />
                    <a
                      href={booking.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-brand-purple hover:text-brand-teal"
                    >
                      {booking.website}
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-600 mb-1">Service Requested</p>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-slate-900">{booking.product_service}</p>
                </div>
              </div>

              {booking.reason && (
                <div>
                  <p className="text-sm text-slate-600 mb-1">Reason</p>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-sm text-slate-900">{booking.reason}</p>
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm text-slate-600 mb-1">Preferred Date & Time</p>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-900">
                    {booking.preferred_date
                      ? `${new Date(booking.preferred_date).toLocaleDateString()} at ${booking.preferred_time}`
                      : 'Not specified'}
                  </span>
                </div>
              </div>

              {booking.timezone && (
                <div>
                  <p className="text-sm text-slate-600 mb-1">Timezone</p>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-900">{booking.timezone}</span>
                  </div>
                  {booking.ist_time && (
                    <p className="text-xs text-slate-500 mt-1 ml-6">IST: {booking.ist_time}</p>
                  )}
                </div>
              )}

              <div>
                <p className="text-sm text-slate-600 mb-1">Current Status</p>
                <span
                  className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                    booking.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-700'
                      : booking.status === 'Scheduled'
                      ? 'bg-blue-100 text-blue-700'
                      : booking.status === 'Reviewed'
                      ? 'bg-violet-100 text-violet-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-slate-600">Location</p>
                <p className="text-slate-900">{[booking.city, booking.state, booking.country].filter(Boolean).join(', ')}</p>
              </div>
              <div>
                <p className="text-slate-600">Booking ID</p>
                <p className="text-slate-900 font-mono text-xs">{booking.id.slice(0, 8)}...</p>
              </div>
              <div>
                <p className="text-slate-600">Created On</p>
                <p className="text-slate-900">{new Date(booking.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {booking.notes && (
            <div className="border-t border-slate-200 pt-4">
              <p className="text-sm text-slate-600 mb-2">Notes</p>
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-sm text-slate-900">{booking.notes}</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-brand-purple text-white rounded-lg hover:bg-brand-teal transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
