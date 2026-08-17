import { motion } from 'motion/react';
import { BarChart3, TrendingUp, Users, DollarSign, Filter, Download } from 'lucide-react';
import { StatCard } from '../components/StatCard';

export function AnalyticsTab() {
  return (
    <div className="space-y-6 pb-8">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Analytics & Reporting</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Key metrics, performance indicators, and comprehensive reports.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue (YTD)" 
          value="₹12.4M" 
          trend={{ value: 14.2, isPositive: true, label: 'vs last year' }}
          icon={<DollarSign className="w-5 h-5" />}
          colorClass="bg-emerald-50 text-emerald-600"
        />
        <StatCard 
          title="Avg Order Value" 
          value="₹8,240" 
          trend={{ value: 5.1, isPositive: true, label: 'vs last month' }}
          icon={<TrendingUp className="w-5 h-5" />}
          colorClass="bg-blue-50 text-blue-600"
        />
        <StatCard 
          title="New Clients" 
          value="48" 
          trend={{ value: 2.4, isPositive: false, label: 'vs last month' }}
          icon={<Users className="w-5 h-5" />}
          colorClass="bg-indigo-50 text-indigo-600"
        />
        <StatCard 
          title="Conversion Rate" 
          value="18.2%" 
          trend={{ value: 4.1, isPositive: true, label: 'vs last month' }}
          icon={<BarChart3 className="w-5 h-5" />}
          colorClass="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Main Content Area */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex-1 flex flex-col"
      >
        <div className="bg-white rounded-t-xl border border-slate-200 flex items-center justify-between px-6 py-4">
          <h2 className="font-bold text-slate-800">Monthly Performance Report</h2>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-slate-300 rounded text-xs font-medium text-slate-600 bg-white hover:bg-slate-50">
              <Filter className="w-3.5 h-3.5 mr-1.5 inline" /> Filters
            </button>
            <button className="px-3 py-1 border border-slate-300 rounded text-xs font-medium text-slate-600 bg-white hover:bg-slate-50 flex items-center">
              <Download className="w-3.5 h-3.5 mr-1.5 inline" /> Export PDF
            </button>
          </div>
        </div>
        <div className="bg-white border-x border-b border-slate-200 overflow-hidden rounded-b-xl p-8 flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
            <BarChart3 className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Detailed Analytics Dashboard</h3>
          <p className="text-sm text-slate-500 max-w-md text-center">
            Connect your data sources to visualize pipeline performance, conversion funnels, and revenue attribution across all operational stages.
          </p>
          <button className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
            Configure Data Sources
          </button>
        </div>
      </motion.div>
    </div>
  );
}
