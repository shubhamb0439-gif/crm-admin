import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeads, useServices } from '../hooks/useRealtimeData';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Search, Plus, Filter, X, Eye, Trash2 } from 'lucide-react';
import { countries, getStatesForCountry } from '../lib/countriesData';

export function LeadsPage() {
  const { data: leads, isLoading } = useLeads();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [efficiencyFilter, setEfficiencyFilter] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredLeads = leads?.filter((lead) => {
    const matchesSearch =
      !searchTerm ||
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.facility?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSource = !sourceFilter || lead.source === sourceFilter;
    const matchesStatus = !statusFilter || lead.status === statusFilter;
    const matchesEfficiency = !efficiencyFilter || lead.efficiency_level === efficiencyFilter;

    return matchesSearch && matchesSource && matchesStatus && matchesEfficiency;
  });

  const activeFilters = [sourceFilter, statusFilter, efficiencyFilter].filter(Boolean).length;

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this lead?')) return;

    try {
      const { error } = await supabase.from('leads').delete().eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting lead:', error);
      alert('Failed to delete lead');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Lead Database</h1>
          <p className="text-slate-600 mt-2">
            {filteredLeads?.length || 0} of {leads?.length || 0} leads
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-brand-teal text-white px-6 py-3 rounded-lg hover:bg-brand-teal transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>Add Lead</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or facility..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Filters:</span>
              {activeFilters > 0 && (
                <span className="text-xs bg-brand-teal/10 text-brand-teal px-2 py-1 rounded-full">
                  {activeFilters} active
                </span>
              )}
            </div>

            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
            >
              <option value="">All Sources</option>
              <option value="Assessment">Assessment</option>
              <option value="Consultancy">Consultancy</option>
              <option value="Referral">Referral</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Call">Call</option>
              <option value="Email">Email</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
            >
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified Prospect">Qualified Prospect</option>
              <option value="Contract Sent">Contract Sent</option>
              <option value="Confirmed Client">Confirmed Client</option>
              <option value="Closed">Closed</option>
            </select>

            <select
              value={efficiencyFilter}
              onChange={(e) => setEfficiencyFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
            >
              <option value="">All Efficiency Levels</option>
              <option value="Good Efficiency">Good Efficiency</option>
              <option value="Moderate Efficiency">Moderate Efficiency</option>
              <option value="Needs Improvement">Needs Improvement</option>
            </select>

            {activeFilters > 0 && (
              <button
                onClick={() => {
                  setSourceFilter('');
                  setStatusFilter('');
                  setEfficiencyFilter('');
                }}
                className="flex items-center space-x-1 text-sm text-slate-600 hover:text-slate-900"
              >
                <X className="w-4 h-4" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-600">Loading leads...</div>
        ) : filteredLeads && filteredLeads.length > 0 ? (
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
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Facility
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    State
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Added By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Product/Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Stage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    $ Value/Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Date Contacted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{lead.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600">{lead.email || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600">{lead.phone || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600">{lead.facility || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600">{lead.state || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                        lead.source === 'Assessment' ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {lead.source}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600">{lead.added_by || 'System'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600">{lead.product_service || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{lead.score || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                        lead.status === 'New' ? 'bg-brand-purple/10 text-brand-purple' :
                        lead.status === 'Confirmed Client' ? 'bg-emerald-100 text-emerald-700' :
                        lead.status === 'Closed' ? 'bg-slate-100 text-slate-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600">
                        {lead.value_per_annum ? `$${lead.value_per_annum.toLocaleString()}` : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {new Date(lead.created_at).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => navigate(`/admin/leads/${lead.id}`)}
                          className="text-brand-purple hover:text-brand-purple p-1"
                          title="View"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(lead.id, e)}
                          className="text-red-600 hover:text-red-700 p-1"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-600">No leads found</div>
        )}
      </div>

      {showAddModal && <AddLeadModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}

function AddLeadModal({ onClose }: { onClose: () => void }) {
  const { session } = useAuth();
  const { data: services } = useServices();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    facility: '',
    country: '',
    state: '',
    source: '',
  });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableStates, setAvailableStates] = useState<string[]>([]);

  const serviceCategories = services?.filter((s) => s.category === 'Service' && s.is_visible) || [];
  const innovationCategories = services?.filter((s) => s.category === 'Innovation' && s.is_visible) || [];

  useEffect(() => {
    if (formData.country) {
      const states = getStatesForCountry(formData.country);
      setAvailableStates(states);
      setFormData(prev => ({ ...prev, state: '' }));
    } else {
      setAvailableStates([]);
    }
  }, [formData.country]);

  const toggleService = (serviceName: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceName)
        ? prev.filter((s) => s !== serviceName)
        : [...prev, serviceName]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('leads').insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        facility: formData.facility,
        state: formData.state,
        country: formData.country,
        source: formData.source,
        product_service: selectedServices.join(', '),
        selected_services: selectedServices,
        status: 'New',
        added_by: session?.name || session?.email?.split('@')[0] || 'Admin',
        added_by_email: session?.email,
      });

      if (error) throw error;

      onClose();
    } catch (error) {
      console.error('Error adding lead:', error);
      alert('Failed to add lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Add New Lead</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Facility <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.facility}
              onChange={(e) => setFormData({ ...formData, facility: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Country</label>
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal"
              >
                <option value="">Select country</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                disabled={!formData.country}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal disabled:bg-slate-100 disabled:cursor-not-allowed"
              >
                <option value="">Select state</option>
                {availableStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Source <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal"
            >
              <option value="">Select source</option>
              <option value="Referral">Referral</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Call">Call</option>
              <option value="Email">Email</option>
              <option value="Existing Client">Existing Client</option>
              <option value="Ex-Client">Ex-Client</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Products/Services <span className="text-red-500">*</span>
            </label>
            <div className="border border-slate-300 rounded-lg p-4 max-h-60 overflow-y-auto">
              {serviceCategories.length > 0 && (
                <div className="space-y-2 mb-4">
                  <p className="text-sm font-semibold text-slate-900">Services</p>
                  {serviceCategories.map((service) => (
                    <label
                      key={service.id}
                      className="flex items-center space-x-3 p-2 hover:bg-slate-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(service.name)}
                        onChange={() => toggleService(service.name)}
                        className="w-4 h-4 text-brand-teal border-slate-300 rounded focus:ring-brand-teal"
                      />
                      <span className="text-sm text-slate-700">{service.name}</span>
                    </label>
                  ))}
                </div>
              )}

              {innovationCategories.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-slate-200">
                  <p className="text-sm font-semibold text-slate-900">Products & Innovation</p>
                  {innovationCategories.map((service) => (
                    <label
                      key={service.id}
                      className="flex items-center space-x-3 p-2 hover:bg-slate-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(service.name)}
                        onChange={() => toggleService(service.name)}
                        className="w-4 h-4 text-brand-teal border-slate-300 rounded focus:ring-brand-teal"
                      />
                      <span className="text-sm text-slate-700">{service.name}</span>
                    </label>
                  ))}
                </div>
              )}

              {(!serviceCategories.length && !innovationCategories.length) && (
                <p className="text-sm text-slate-500">No services available</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || selectedServices.length === 0}
              className="px-6 py-3 bg-brand-teal text-white rounded-lg hover:bg-brand-teal transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Adding...' : 'Add Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
