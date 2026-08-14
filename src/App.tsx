import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { OrdersTab } from './tabs/OrdersTab';
import { PurchaseTab } from './tabs/PurchaseTab';
import { ProductionTab } from './tabs/ProductionTab';
import { DispatchedTab } from './tabs/DispatchedTab';
import { PaymentsTab } from './tabs/PaymentsTab';
import { AnalyticsTab } from './tabs/AnalyticsTab';
import { VendorQuoteForm } from './components/VendorQuoteForm';
import { TabName } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabName>('Orders');
  const [quoteId, setQuoteId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qId = params.get('quoteId');
    if (qId) {
      setQuoteId(qId);
    }
  }, []);

  if (quoteId) {
    return <VendorQuoteForm quoteId={quoteId} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header activeTab={activeTab} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto h-full">
            {activeTab === 'Orders' && <OrdersTab />}
            {activeTab === 'Purchase' && <PurchaseTab />}
            {activeTab === 'Production' && <ProductionTab />}
            {activeTab === 'Dispatched' && <DispatchedTab />}
            {activeTab === 'Payments' && <PaymentsTab />}
            {activeTab === 'Analytics' && <AnalyticsTab />}
          </div>
        </main>
      </div>
    </div>
  );
}

