import { useLeads } from '../hooks/useRealtimeData';
import { TrendingUp, Users, CheckCircle, Target, PieChart, AlertTriangle } from 'lucide-react';

export function DashboardPage() {
  const { data: leads, isLoading } = useLeads();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">Loading dashboard...</div>
      </div>
    );
  }

  const totalLeads = leads?.length || 0;
  const qualifiedLeads = leads?.filter(
    (l) => l.status === 'Qualified Prospect' || l.status === 'Contract Sent' || l.status === 'Confirmed Client'
  ).length || 0;
  const closedDeals = leads?.filter((l) => l.status === 'Confirmed Client').length || 0;
  const conversionRate = totalLeads > 0 ? ((closedDeals / totalLeads) * 100).toFixed(1) : '0.0';

  const sourceBreakdown = leads?.reduce((acc, lead) => {
    acc[lead.source] = (acc[lead.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const efficiencyBreakdown = leads?.reduce((acc, lead) => {
    if (lead.efficiency_level) {
      acc[lead.efficiency_level] = (acc[lead.efficiency_level] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>) || {};

  const stateBreakdown = leads?.reduce((acc, lead) => {
    if (lead.state) {
      acc[lead.state] = (acc[lead.state] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>) || {};

  const topStates = Object.entries(stateBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  const challengeKeywords = leads
    ?.filter((l) => l.comments)
    .flatMap((l) => l.comments!.toLowerCase().split(/\s+/))
    .filter((word) => word.length > 4)
    .reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const topChallenges = Object.entries(challengeKeywords || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  const metrics = [
    {
      label: 'Total Leads',
      value: totalLeads,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      label: 'Qualified Leads',
      value: qualifiedLeads,
      icon: Target,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
    },
    {
      label: 'Closed Deals',
      value: closedDeals,
      icon: CheckCircle,
      color: 'bg-violet-500',
      bgColor: 'bg-violet-50',
      textColor: 'text-violet-700',
    },
    {
      label: 'Conversion Rate',
      value: `${conversionRate}%`,
      icon: TrendingUp,
      color: 'bg-amber-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-2">Real-time overview of your healthcare CRM</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{metric.label}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{metric.value}</p>
                </div>
                <div className={`w-12 h-12 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${metric.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center space-x-2 mb-6">
            <PieChart className="w-5 h-5 text-slate-700" />
            <h2 className="text-lg font-semibold text-slate-900">Lead Sources</h2>
          </div>
          <div className="space-y-4">
            {Object.entries(sourceBreakdown).map(([source, count]) => {
              const percentage = totalLeads > 0 ? ((count / totalLeads) * 100).toFixed(0) : 0;
              const colors: Record<string, string> = {
                Assessment: 'bg-blue-500',
                Consultancy: 'bg-emerald-500',
                Referral: 'bg-violet-500',
              };
              return (
                <div key={source}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">{source}</span>
                    <span className="text-sm text-slate-600">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className={`${colors[source]} h-2 rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center space-x-2 mb-6">
            <AlertTriangle className="w-5 h-5 text-slate-700" />
            <h2 className="text-lg font-semibold text-slate-900">Efficiency Levels</h2>
          </div>
          <div className="space-y-4">
            {Object.entries(efficiencyBreakdown).map(([level, count]) => {
              const total = Object.values(efficiencyBreakdown).reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? ((count / total) * 100).toFixed(0) : 0;
              const colors: Record<string, string> = {
                Good: 'bg-emerald-500',
                Moderate: 'bg-amber-500',
                'Needs Improvement': 'bg-red-500',
              };
              return (
                <div key={level}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">{level}</span>
                    <span className="text-sm text-slate-600">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className={`${colors[level]} h-2 rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Top 10 States by Leads</h2>
          <div className="space-y-3">
            {topStates.map(([state, count], index) => (
              <div key={state} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-slate-500 w-6">#{index + 1}</span>
                  <span className="text-sm font-medium text-slate-900">{state}</span>
                </div>
                <span className="text-sm font-semibold text-slate-700">{count} leads</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Top 10 Challenge Keywords</h2>
          <div className="space-y-3">
            {topChallenges.map(([keyword, count], index) => (
              <div key={keyword} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-slate-500 w-6">#{index + 1}</span>
                  <span className="text-sm font-medium text-slate-900 capitalize">{keyword}</span>
                </div>
                <span className="text-sm font-semibold text-slate-700">{count}x</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
