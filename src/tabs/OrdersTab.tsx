import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, TrendingUp, Clock, CheckCircle2, MoreHorizontal, Filter, Plus, FileText, Download, Loader2 } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { Badge } from '../components/Badge';
import { NewOrderModal } from '../components/NewOrderModal';
import { OrderDetailsModal } from '../components/OrderDetailsModal';
import { subscribeToOrders, saveOrder, deleteOrder, Order } from '../lib/orders';

import { saveOrderFiles } from '../lib/fileStorage';

export function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | undefined>();
  const [uploadedFileData, setUploadedFileData] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToOrders((fetchedOrders) => {
      setOrders(fetchedOrders);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleNewOrderClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUploadedFileName(file.name);
      
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedFileData(reader.result as string);
        setIsModalOpen(true);
      };
      reader.onerror = () => {
        console.error("Failed to read file");
        setIsModalOpen(true); // Open modal anyway
      };
      reader.readAsDataURL(file);
      
      e.target.value = '';
    }
  };

  const handleAddOrder = async (newOrder: any) => {
    // Extract file data to avoid Firebase size limits
    const { poFileData, drawingFileData, ...orderDetails } = newOrder;

    const orderData = {
      id: `ORD-2026-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      customer: orderDetails.companyName || orderDetails.customerName || 'Unknown Customer',
      amount: orderDetails.totalAmount || '$0.00',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'New',
      items: Number(orderDetails.totalItems) || 0,
      details: {
        ...orderDetails,
      }
    };
    
    try {
      await saveOrder(orderData);
      
      // Save files to IndexedDB
      await saveOrderFiles(orderData.id, {
        quotationFileData: uploadedFileData,
        poFileData: poFileData,
        drawingFileData: drawingFileData
      });
      
    } catch (error: any) {
      console.error('Error saving order:', error);
      alert(`Failed to save order: ${error.message}`);
    }
  };

  const handleDeleteOrder = async (docId: string) => {
    try {
      await deleteOrder(docId);
      setSelectedOrder(null);
    } catch (error: any) {
      console.error('Error deleting order:', error);
      alert(`Failed to delete order: ${error.message}`);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-8">
      <NewOrderModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setUploadedFileName(undefined);
          setUploadedFileData(undefined);
        }} 
        fileName={uploadedFileName} 
        fileData={uploadedFileData}
        onAddOrder={handleAddOrder}
      />

      <OrderDetailsModal 
        isOpen={!!selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
        order={selectedOrder} 
        onDelete={() => selectedOrder?.docId && handleDeleteOrder(selectedOrder.docId)}
      />

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Dashboard</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Manage and track customer orders across the pipeline.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleNewOrderClick}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Order
          </button>
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept=".pdf,.doc,.docx,.xls,.xlsx,image/*" 
            onChange={handleFileChange}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Orders (Lifetime)" 
          value="1,248" 
          icon={<ShoppingCart className="w-5 h-5" />}
          colorClass="bg-blue-50 text-blue-600"
        />
        <StatCard 
          title="Total Orders (This Month)" 
          value="142" 
          trend={{ value: 8.2, isPositive: true, label: 'from last month' }}
          icon={<ShoppingCart className="w-5 h-5" />}
          colorClass="bg-emerald-50 text-emerald-600"
        />
        <StatCard 
          title="Total Orders (Last Month)" 
          value="131" 
          icon={<ShoppingCart className="w-5 h-5" />}
          colorClass="bg-amber-50 text-amber-600"
        />
        <StatCard 
          title="Projected Orders (This Month)" 
          value="155" 
          trend={{ value: 9.1, isPositive: true, label: 'vs current' }}
          icon={<ShoppingCart className="w-5 h-5" />}
          colorClass="bg-indigo-50 text-indigo-600"
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
          <h2 className="font-bold text-slate-800">Recent Sales Orders</h2>
          <div className="flex gap-2 items-center">
            {dateFilter === 'custom' && (
              <div className="flex gap-2 items-center mr-2">
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-2 py-1 border border-slate-300 rounded text-xs font-medium text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-xs text-slate-500">to</span>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-2 py-1 border border-slate-300 rounded text-xs font-medium text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1 border border-slate-300 rounded text-xs font-medium text-slate-600 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="New">New Order</option>
              <option value="Processing">Processing</option>
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <select 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-1 border border-slate-300 rounded text-xs font-medium text-slate-600 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Dates</option>
              <option value="day">Today</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Date Range</option>
            </select>
            <button onClick={() => {
              const headers = ['Order ID', 'Customer', 'Amount', 'Date', 'Status'];
              const csvContent = [
                headers.join(','),
                ...filteredOrders.map(order => 
                  `${order.id},"${order.customer}",${order.amount.replace(/,/g, '')},${order.date},${order.status}`
                )
              ].join('\n');
              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const link = document.createElement('a');
              const url = URL.createObjectURL(blob);
              link.setAttribute('href', url);
              link.setAttribute('download', 'orders_export.csv');
              link.style.visibility = 'hidden';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }} className="px-3 py-1 border border-slate-300 rounded text-xs font-medium text-slate-600 bg-white hover:bg-slate-50 flex items-center">
              <Download className="w-3.5 h-3.5 mr-1.5 inline" /> Export Excel
            </button>
          </div>
        </div>
        <div className="flex-1 bg-white border-x border-b border-slate-200 overflow-hidden rounded-b-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase">
                <tr>
                  <th className="px-6 py-3 border-b border-slate-200">Order ID</th>
                  <th className="px-6 py-3 border-b border-slate-200">Customer</th>
                  <th className="px-6 py-3 border-b border-slate-200">Date</th>
                  <th className="px-6 py-3 border-b border-slate-200">Items</th>
                  <th className="px-6 py-3 border-b border-slate-200">Total Amount</th>
                  <th className="px-6 py-3 border-b border-slate-200">Status</th>
                  <th className="px-6 py-3 border-b border-slate-200 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center">
                        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
                        <p>Loading orders...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      No orders found matching the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order, i) => (
                    <motion.tr 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    key={order.id} 
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-semibold">{order.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">{order.items} units</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-bold">{order.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={
                      order.status === 'Completed' ? 'success' : 
                      order.status === 'Processing' ? 'info' : 
                      order.status === 'New' ? 'purple' : 
                      order.status === 'Cancelled' ? 'error' : 'warning'
                    }>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-md hover:bg-indigo-50 transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </motion.tr>
              )))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-white flex items-center justify-between text-sm text-slate-500 font-medium">
            <span>Showing 1 to 6 of 1,248 entries</span>
            <div className="flex gap-1">
              <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 transition-colors" disabled>Prev</button>
              <button className="px-3 py-1 border border-indigo-600 rounded bg-indigo-50 text-indigo-700 font-semibold shadow-sm">1</button>
              <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 transition-colors">2</button>
              <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 transition-colors">3</button>
              <span className="px-2 py-1 text-slate-400">...</span>
              <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 transition-colors">Next</button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
