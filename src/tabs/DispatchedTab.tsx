import { motion } from 'motion/react';
import { Truck, MapPin, PackageCheck, AlertCircle, MoreHorizontal, Filter, Navigation } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { Badge } from '../components/Badge';

const shipments = [
  { id: 'SHP-7721', orderId: 'ORD-2026-001', carrier: 'FedEx Freight', destination: 'New York, NY', status: 'In Transit', eta: 'Oct 26, 2026' },
  { id: 'SHP-7722', orderId: 'ORD-2026-004', carrier: 'UPS Ground', destination: 'Chicago, IL', status: 'Delivered', eta: 'Oct 24, 2026' },
  { id: 'SHP-7723', orderId: 'ORD-2026-005', carrier: 'DHL Express', destination: 'London, UK', status: 'Customs', eta: 'Oct 28, 2026' },
  { id: 'SHP-7724', orderId: 'ORD-2026-002', carrier: 'Local Courier', destination: 'Austin, TX', status: 'Out for Delivery', eta: 'Today' },
  { id: 'SHP-7725', orderId: 'ORD-2026-008', carrier: 'Maersk Line', destination: 'Tokyo, JP', status: 'Delayed', eta: 'Nov 05, 2026' },
];

export function DispatchedTab() {
  return (
    <div className="space-y-6 pb-8">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Logistics & Dispatch</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Track outgoing shipments, carrier performance, and delivery statuses.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Active Shipments" 
          value="124" 
          trend={{ value: 8.5, isPositive: true }}
          icon={<Truck className="w-5 h-5" />}
          colorClass="bg-blue-50 text-blue-600"
        />
        <StatCard 
          title="Avg Delivery Time" 
          value="2.4 Days" 
          trend={{ value: 12.0, isPositive: true }}
          icon={<MapPin className="w-5 h-5" />}
          colorClass="bg-emerald-50 text-emerald-600"
        />
        <StatCard 
          title="Delivered (MTD)" 
          value="892" 
          icon={<PackageCheck className="w-5 h-5" />}
          colorClass="bg-indigo-50 text-indigo-600"
        />
        <StatCard 
          title="Exceptions/Delays" 
          value="7" 
          icon={<AlertCircle className="w-5 h-5" />}
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
          <h2 className="font-bold text-slate-800">Live Shipments</h2>
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
                  <th className="px-6 py-3 border-b border-slate-200">Tracking ID</th>
                  <th className="px-6 py-3 border-b border-slate-200">Related Order</th>
                  <th className="px-6 py-3 border-b border-slate-200">Carrier</th>
                  <th className="px-6 py-3 border-b border-slate-200">Destination</th>
                  <th className="px-6 py-3 border-b border-slate-200">Status</th>
                  <th className="px-6 py-3 border-b border-slate-200">ETA</th>
                  <th className="px-6 py-3 border-b border-slate-200 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {shipments.map((ship, i) => (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    key={`${ship.id || 'k'}-${i}`} 
                    className="hover:bg-slate-50 transition-colors"
                  >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer">{ship.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium hover:underline cursor-pointer">{ship.orderId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-semibold">{ship.carrier}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                    {ship.destination}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={
                      ship.status === 'Delivered' ? 'success' : 
                      ship.status === 'Delayed' ? 'error' : 
                      ship.status === 'Out for Delivery' ? 'purple' : 'info'
                    }>
                      {ship.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-bold">{ship.eta}</td>
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
