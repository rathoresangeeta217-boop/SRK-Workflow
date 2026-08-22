import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { Factory, Zap, AlertTriangle, MoreHorizontal, Filter, PlayCircle, Settings } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { Badge } from '../components/Badge';

const activeJobs = [
  { id: 'JOB-9402', product: 'Industrial Motor X-1', stage: 'Assembly', completion: 75, priority: 'High', status: 'In Progress' },
  { id: 'JOB-9403', product: 'Sensor Array Base', stage: 'Testing', completion: 90, priority: 'Normal', status: 'In Progress' },
  { id: 'JOB-9404', product: 'Control Panel V2', stage: 'Painting', completion: 40, priority: 'Normal', status: 'Halted' },
  { id: 'JOB-9405', product: 'Heavy Duty Gearbox', stage: 'Milling', completion: 15, priority: 'High', status: 'In Progress' },
  { id: 'JOB-9406', product: 'Power Supply Unit', stage: 'Quality Check', completion: 100, priority: 'Normal', status: 'Completed' },
];

export function ProductionTab() {
  return (
    <div className="space-y-6 pb-8">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Production Floor</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Monitor manufacturing jobs, machinery status, and output quality.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Active Jobs" 
          value="42" 
          trend={{ value: 5.0, isPositive: true }}
          icon={<Factory className="w-5 h-5" />}
          colorClass="bg-blue-50 text-blue-600"
        />
        <StatCard 
          title="Overall Efficiency (OEE)" 
          value="87.4%" 
          trend={{ value: 1.2, isPositive: true }}
          icon={<Zap className="w-5 h-5" />}
          colorClass="bg-emerald-50 text-emerald-600"
        />
        <StatCard 
          title="Completed (Today)" 
          value="18" 
          icon={<Settings className="w-5 h-5" />}
          colorClass="bg-purple-50 text-purple-600"
        />
        <StatCard 
          title="Critical Alerts" 
          value="1" 
          icon={<AlertTriangle className="w-5 h-5" />}
          colorClass="bg-rose-50 text-rose-600"
        />
      </div>

      {/* Main Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex-1 flex flex-col"
      >
        <div className="bg-white rounded-t-xl border border-slate-200 flex items-center justify-between px-6 py-4">
          <h2 className="font-bold text-slate-800">Current Manufacturing Jobs</h2>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-slate-300 rounded text-xs font-medium text-slate-600 bg-white hover:bg-slate-50">
              <Filter className="w-3.5 h-3.5 mr-1.5 inline" /> Filters
            </button>
          </div>
        </div>
        <div className="flex-1 bg-white border-x border-b border-slate-200 overflow-hidden rounded-b-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase">
                <tr>
                  <th className="px-6 py-3 border-b border-slate-200">Job ID</th>
                  <th className="px-6 py-3 border-b border-slate-200">Product Line</th>
                  <th className="px-6 py-3 border-b border-slate-200">Current Stage</th>
                  <th className="px-6 py-3 border-b border-slate-200">Progress</th>
                  <th className="px-6 py-3 border-b border-slate-200">Priority</th>
                  <th className="px-6 py-3 border-b border-slate-200">Status</th>
                  <th className="px-6 py-3 border-b border-slate-200 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeJobs.map((job, i) => (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    key={`${job.id || 'k'}-${i}`} 
                    className="hover:bg-slate-50 transition-colors"
                  >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer">{job.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-semibold">{job.product}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">{job.stage}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="w-full bg-slate-200 rounded-full h-2 max-w-[100px]">
                        <div 
                          className={cn("h-2 rounded-full", job.completion === 100 ? "bg-emerald-500" : "bg-indigo-500")}
                          style={{ width: `${job.completion}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-slate-600">{job.completion}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={job.priority === 'High' ? 'error' : 'default'}>
                      {job.priority}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={
                      job.status === 'Completed' ? 'success' : 
                      job.status === 'In Progress' ? 'info' : 'warning'
                    }>
                      {job.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-md hover:bg-indigo-50 transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
