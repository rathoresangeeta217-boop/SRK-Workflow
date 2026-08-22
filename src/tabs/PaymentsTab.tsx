import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CreditCard, DollarSign, Receipt, AlertCircle, MoreHorizontal, Filter, Download, ArrowUpRight, ArrowDownRight, Edit } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { Badge } from '../components/Badge';
import { subscribeToOrders, Order } from '../lib/orders';
import { PaymentManagementModal } from '../components/PaymentManagementModal';
import { getAllPayments } from '../lib/payments';
import * as XLSX from 'xlsx';

export function PaymentsTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToOrders((fetchedOrders) => {
      setOrders(fetchedOrders);
    });
    return () => unsubscribe();
  }, []);

  const totalReceivables = orders.reduce((sum, order) => {
    const amountStr = order.amount?.toString().replace(/[^0-9.-]+/g, "") || "0";
    return sum + parseFloat(amountStr);
  }, 0);

    const handleDownloadDetailedReport = async () => {
    try {
      setIsDownloading(true);
      const allPayments = await getAllPayments();
      
      const paymentsData: any[] = [];
      const historyData: any[] = [];
      
      orders.forEach(order => {
        const paymentRecord = allPayments.find(p => p.orderId === order.id);
        const customerName = order.customer;
        const totalAmount = order.amount;
        
        if (paymentRecord && paymentRecord.phases && paymentRecord.phases.length > 0) {
          paymentRecord.phases.forEach((phase, index) => {
            paymentsData.push({
              "Order ID": order.id,
              "Customer": customerName,
              "Total Amount": totalAmount,
              "Phase Title": phase.title || `Phase ${index + 1}`,
              "Phase Amount": phase.amount || '',
              "Status": phase.status || '',
              "Date": phase.date ? new Date(phase.date).toLocaleString('en-IN') : '',
              "UTR Number": phase.utrNumber || ''
            });
          });
        } else {
          paymentsData.push({
            "Order ID": order.id,
            "Customer": customerName,
            "Total Amount": totalAmount,
            "Phase Title": "No phases defined",
            "Phase Amount": "-",
            "Status": "-",
            "Date": "-",
            "UTR Number": "-"
          });
        }
        
        if (paymentRecord && paymentRecord.rateEditHistory && paymentRecord.rateEditHistory.length > 0) {
          paymentRecord.rateEditHistory.forEach(entry => {
            historyData.push({
              "Order ID": order.id,
              "Customer": customerName,
              "Date Modified": new Date(entry.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
              "Reason": entry.reason,
              "Changes": entry.changes.join(' | ')
            });
          });
        }
      });
      
      const wb = XLSX.utils.book_new();
      
      const wsPayments = XLSX.utils.json_to_sheet(paymentsData);
      XLSX.utils.book_append_sheet(wb, wsPayments, "Payment Phases");
      
      if (historyData.length > 0) {
        const wsHistory = XLSX.utils.json_to_sheet(historyData);
        XLSX.utils.book_append_sheet(wb, wsHistory, "Rate Modification History");
      } else {
        const wsHistory = XLSX.utils.json_to_sheet([{"Note": "No rate modifications found."}]);
        XLSX.utils.book_append_sheet(wb, wsHistory, "Rate Modification History");
      }
      
      XLSX.writeFile(wb, `Detailed_Payment_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error("Error downloading report:", error);
      alert("Failed to download report");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Financial Overview</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Manage customer payments, advance tracking, and structured payment phases.</p>
        </div>
        
        <button 
          onClick={handleDownloadDetailedReport}
          disabled={isDownloading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {isDownloading ? 'Downloading...' : 'Detailed Report'}
        </button>
      </div>


      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Expected Receivables" 
          value={`₹${totalReceivables.toLocaleString()}`} 
          trend={{ value: 14.5, isPositive: true }}
          icon={<DollarSign className="w-5 h-5" />}
          colorClass="bg-emerald-50 text-emerald-600"
        />
        <StatCard 
          title="Active Orders" 
          value={orders.length.toString()} 
          icon={<Receipt className="w-5 h-5" />}
          colorClass="bg-blue-50 text-blue-600"
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
          <h2 className="font-bold text-slate-800">Customer Payment Tracking</h2>
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
                  <th className="px-6 py-3 border-b border-slate-200">Order Ref</th>
                  <th className="px-6 py-3 border-b border-slate-200">Customer</th>
                  <th className="px-6 py-3 border-b border-slate-200">Auto-Fetched Amount</th>
                  <th className="px-6 py-3 border-b border-slate-200">Order Date</th>
                  <th className="px-6 py-3 border-b border-slate-200">Order Status</th>
                  <th className="px-6 py-3 border-b border-slate-200 text-right">Payment Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order, i) => (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    key={`${order.docId || order.id || 'k'}-${i}`} 
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-semibold">{order.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-bold">{order.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={order.status === 'Completed' ? 'success' : 'default'}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button 
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsModalOpen(true);
                        }}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5 mr-1.5" /> Manage Payments
                      </button>
                    </td>
                  </motion.tr>
                ))}
                
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">
                      No orders found to track payments for.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Modal */}
      {isModalOpen && selectedOrder && (
        <PaymentManagementModal 
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedOrder(null);
          }}
          order={selectedOrder}
        />
      )}
    </div>
  );
}
