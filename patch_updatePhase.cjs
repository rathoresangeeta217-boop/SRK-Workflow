const fs = require('fs');
let content = fs.readFileSync('src/components/PaymentManagementModal.tsx', 'utf8');

const oldUpdatePhase = `  const updatePhase = (id: string, updates: Partial<PaymentPhase>) => {
    const updatedPhases = record.phases?.map(p => p.id === id ? { ...p, ...updates } : p) || [];
    setRecord({ ...record, phases: updatedPhases });
  };`;

const newUpdatePhase = `  const updatePhase = (id: string, updates: Partial<PaymentPhase>) => {
    if (updates.status === 'Received') {
      setUnlockedPhases(prev => ({ ...prev, [id]: true }));
    }
    const updatedPhases = record.phases?.map(p => p.id === id ? { ...p, ...updates } : p) || [];
    setRecord({ ...record, phases: updatedPhases });
  };`;

content = content.replace(oldUpdatePhase, newUpdatePhase);
fs.writeFileSync('src/components/PaymentManagementModal.tsx', content);
