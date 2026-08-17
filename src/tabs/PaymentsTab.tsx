import { motion } from 'motion/react';
import { CreditCard, DollarSign, Receipt, AlertCircle, MoreHorizontal, Filter, Download, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { Badge } from '../components/Badge';

const invoices = [
  { id: 'INV-2026-1042', entity: 'Acme Corp', amount: '₹12,450.00', dueDate: 'Nov 15, 2026', status: 'Unpaid', type: 'Receivable' },
  { id: 'INV-2026-1041', entity: 'Global Industries', amount: '₹8,230.50', dueDate: 'Oct 23, 2026', status: 'Paid', type: 'Receivable' },
  { id: 'BILL-8890', entity: 'Steel Dynamics Inc.', amount: '₹45,200.00', dueDate: 'Oct 20, 2026', status: 'Overdue', type: 'Payable' },
  { id: 'INV-2026-1040', entity: 'Wayne Tech', amount: '₹3,100.00', dueDate: 'Oct 15, 2026', status: 'Paid', type: 'Receivable' },
  { id: 'BILL-8891', entity: 'Industrial Chemicals', amount: '₹8,900.00', dueDate: 'Nov 01, 2026', status: 'Unpaid', type: 'Payable' },
];

export function PaymentsTab() {
  return (
    <div className="space-y-6 pb-8">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Financial Overview</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Manage accounts receivable, accounts payable, and cash flow.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Receivables" 
          value="₹342.5k" 
          trend={{ value: 14.5, isPositive: true }}
          icon={<DollarSign className="w-5 h-5" />}
          colorClass="bg-emerald-50 text-emerald-600"
        />
        <StatCard 
          title="Total Payables" 
          value="₹128.2k" 
          trend={{ value: 2.4, isPositive: false }}
          icon={<CreditCard className="w-5 h-5" />}
          colorClass="bg-rose-50 text-rose-600"
        />
        <StatCard 
          title="Available Cash Flow" 
          value="₹845.0k" 
          icon={<DollarSign className="w-5 h-5" />}
          colorClass="bg-blue-50 text-blue-600"
        />
        <StatCard 
          title="Overdue Invoices" 
          value="₹54.1k" 
          icon={<AlertCircle className="w-5 h-5" />}
          colorClass="bg-amber-50 text-amber-600"
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
          <h2 className="font-bold text-slate-800">Recent Transactions & Invoices</h2>
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
                  <th className="px-6 py-3 border-b border-slate-200">Reference</th>
                  <th className="px-6 py-3 border-b border-slate-200">Client / Vendor</th>
                  <th className="px-6 py-3 border-b border-slate-200">Type</th>
                  <th className="px-6 py-3 border-b border-slate-200">Amount</th>
                  <th className="px-6 py-3 border-b border-slate-200">Status</th>
                  <th className="px-6 py-3 border-b border-slate-200">Due Date</th>
                  <th className="px-6 py-3 border-b border-slate-200 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv, i) => (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    key={inv.id} 
                    className="hover:bg-slate-50 transition-colors"
                  >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer">{inv.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-semibold">{inv.entity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1.5 text-sm font-medium">
                      {inv.type === 'Receivable' ? (
                        <ArrowDownRight className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-rose-500" />
                      )}
                      <span className={inv.type === 'Receivable' ? 'text-emerald-700' : 'text-rose-700'}>
                        {inv.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-bold">{inv.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={
                      inv.status === 'Paid' ? 'success' : 
                      inv.status === 'Overdue' ? 'error' : 'warning'
                    }>
                      {inv.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium flex items-center">
                    {inv.status === 'Overdue' && <AlertCircle className="w-3.5 h-3.5 mr-1.5 text-rose-500" />}
                    <span className={inv.status === 'Overdue' ? 'text-rose-600 font-bold' : ''}>{inv.dueDate}</span>
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
