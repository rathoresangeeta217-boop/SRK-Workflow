const fs = require('fs');

let code = fs.readFileSync('src/components/VendorQuoteForm.tsx', 'utf8');

const oldReturn = `  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">`;

const newReturn = `  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">`;

code = code.replace(oldReturn, newReturn);

const oldItemWrap = `<div key={index} className="space-y-5">
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">`;

const newItemWrap = `<div key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  {/* Left Column: Requirement Details */}
                  <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200 shadow-sm">`;

code = code.replace(/<div key={index} className="space-y-5">\n                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">/g, newItemWrap);

const oldRightWrap = `</div>
                  <div className="space-y-5 px-2">
                    <div className="space-y-2">`;

const newRightWrap = `</div>
                  {/* Right Column: Vendor Input Form */}
                  <div className="space-y-6 lg:p-4">
                    <div className="space-y-2">`;

code = code.replace(/<\/div>\n                  <div className="space-y-5 px-2">\n                    <div className="space-y-2">/g, newRightWrap);

// Divider needs to span both columns
const oldDivider = `{quote.items && index < quote.items.length - 1 && (
                    <div className="h-px bg-slate-200 w-full my-6"></div>
                  )}
                </div>`;

const newDivider = `</div>
                  {quote.items && index < quote.items.length - 1 && (
                    <div className="col-span-1 lg:col-span-2 h-px bg-slate-200 w-full my-4"></div>
                  )}`;

code = code.replace(/\{quote\.items && index < quote\.items\.length - 1 && \(\n                    <div className="h-px bg-slate-200 w-full my-6"><\/div>\n                  \)\}\n                <\/div>/g, newDivider);

fs.writeFileSync('src/components/VendorQuoteForm.tsx', code);
console.log("Updated layout to landscape");
