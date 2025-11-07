import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLead, useLeadAssessment, useLeadBooking } from '../hooks/useRealtimeData';
import { supabase } from '../lib/supabase';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  MapPin,
  Calendar,
  FileText,
  Award,
  Trash2,
} from 'lucide-react';

export function LeadProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: lead, isLoading } = useLead(id!);
  const { data: assessment } = useLeadAssessment(lead?.email || '');
  const { data: booking } = useLeadBooking(lead?.email || '');
  const [notes, setNotes] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">Loading lead profile...</div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Lead not found</p>
        <button
          onClick={() => navigate('/admin/leads')}
          className="mt-4 text-brand-teal hover:text-teal-700"
        >
          Back to leads
        </button>
      </div>
    );
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      const updates: any = { status: newStatus, updated_at: new Date().toISOString() };

      if (newStatus === 'Closed') {
        updates.closed_reason = 'Closed';
      }

      const { error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleAddNote = async () => {
    if (!notes.trim()) return;

    try {
      const currentNotes = lead.notes || '';
      const timestamp = new Date().toLocaleString();
      const newNotes = currentNotes
        ? `${currentNotes}\n\n[${timestamp}] ${notes}`
        : `[${timestamp}] ${notes}`;

      const { error } = await supabase
        .from('leads')
        .update({ notes: newNotes, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setNotes('');
    } catch (error) {
      console.error('Error adding note:', error);
      alert('Failed to add note');
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase.from('leads').delete().eq('id', id);
      if (error) throw error;
      navigate('/admin/leads');
    } catch (error) {
      console.error('Error deleting lead:', error);
      alert('Failed to delete lead');
    }
  };

  const statuses = ['New', 'Contacted', 'Qualified Prospect', 'Contract Sent', 'Confirmed Client', 'Closed'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/leads')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{lead.name}</h1>
            <p className="text-slate-600 mt-1">Lead Profile</p>
          </div>
        </div>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete Lead</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lead.email && (
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-600">Email</p>
                    <p className="text-sm font-medium text-slate-900">{lead.email}</p>
                  </div>
                </div>
              )}

              {lead.phone && (
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-600">Phone</p>
                    <p className="text-sm font-medium text-slate-900">{lead.phone}</p>
                  </div>
                </div>
              )}

              {lead.facility && (
                <div className="flex items-start space-x-3">
                  <Building2 className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-600">Facility</p>
                    <p className="text-sm font-medium text-slate-900">{lead.facility}</p>
                  </div>
                </div>
              )}

              {(lead.country || lead.state) && (
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-600">Location</p>
                    <p className="text-sm font-medium text-slate-900">
                      {[lead.state, lead.country].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-600">Created</p>
                  <p className="text-sm font-medium text-slate-900">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <FileText className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-600">Source</p>
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-violet-100 text-violet-700">
                    {lead.source}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {assessment && lead.source === 'Assessment' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Award className="w-5 h-5 text-slate-700" />
                <h2 className="text-lg font-semibold text-slate-900">Assessment Results</h2>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Score</p>
                    <p className="text-2xl font-bold text-slate-900">{assessment.score}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Efficiency Level</p>
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                        assessment.efficiency_level?.includes('Good')
                          ? 'bg-emerald-100 text-emerald-700'
                          : assessment.efficiency_level?.includes('Moderate')
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {assessment.efficiency_level}
                    </span>
                  </div>
                </div>
                {assessment.selected_challenges && assessment.selected_challenges.length > 0 && (
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Challenges</p>
                    <div className="flex flex-wrap gap-2">
                      {assessment.selected_challenges.map((challenge, i) => (
                        <span key={i} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                          {challenge}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {booking && lead.source === 'Consultancy' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Calendar className="w-5 h-5 text-slate-700" />
                <h2 className="text-lg font-semibold text-slate-900">Booking Details</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-600">Service</p>
                  <p className="text-sm font-medium text-slate-900">{booking.product_service}</p>
                </div>
                {booking.preferred_date && (
                  <div>
                    <p className="text-sm text-slate-600">Preferred Date & Time</p>
                    <p className="text-sm font-medium text-slate-900">
                      {booking.preferred_date} at {booking.preferred_time}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-slate-600">Booking Status</p>
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                    {booking.status}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Notes</h2>
            <div className="space-y-4">
              {lead.notes && (
                <div className="bg-slate-50 p-4 rounded-lg">
                  <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans">
                    {lead.notes}
                  </pre>
                </div>
              )}

              <div className="space-y-2">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add a note..."
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal"
                />
                <button
                  onClick={handleAddNote}
                  disabled={!notes.trim()}
                  className="px-4 py-2 bg-brand-teal text-white rounded-lg hover:bg-brand-teal transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Note
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Pipeline Status</h2>

            <div className="space-y-2">
              {statuses.map((status) => {
                const isActive = lead.status === status;
                const statusIndex = statuses.indexOf(lead.status);
                const currentIndex = statuses.indexOf(status);
                const isCompleted = currentIndex < statusIndex;

                return (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-brand-teal/10 border-2 border-brand-teal'
                        : isCompleted
                        ? 'bg-slate-50 border border-slate-200'
                        : 'border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isActive
                          ? 'border-brand-teal bg-brand-teal'
                          : isCompleted
                          ? 'border-slate-400 bg-slate-400'
                          : 'border-slate-300'
                      }`}
                    >
                      {(isActive || isCompleted) && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        isActive
                          ? 'text-brand-teal'
                          : isCompleted
                          ? 'text-slate-600'
                          : 'text-slate-700'
                      }`}
                    >
                      {status}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {lead.closed_reason && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Closure Details</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-600">Reason</p>
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700">
                    {lead.closed_reason}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Delete Lead</h2>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete this lead? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
