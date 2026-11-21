import React from 'react';
import { Award, ShieldCheck, Download, Printer, X, Sparkles } from 'lucide-react';

export const CertificateModal = ({ certificate, onClose }) => {
  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Modal Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2 text-violet-700 font-bold text-sm">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Official AuraLMS Completion Certificate</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-200 transition-colors"
              title="Print Certificate"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Canvas */}
        <div className="p-8 sm:p-12 print:p-0 bg-gradient-to-br from-amber-50/40 via-white to-violet-50/40">
          <div className="border-4 border-double border-violet-900/30 p-8 sm:p-10 rounded-2xl bg-white relative shadow-inner text-center">
            
            {/* Top Ribbon Seal */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 via-violet-600 to-purple-700 flex items-center justify-center text-white shadow-glow-orange ring-4 ring-amber-100">
                <Sparkles className="w-8 h-8" />
              </div>
            </div>

            <div className="text-xs uppercase tracking-[0.3em] font-extrabold text-violet-800 mb-2">
              Certificate of Achievement
            </div>
            
            <h2 className="text-sm font-semibold text-slate-500 mb-6">
              This prestigious credential is proudly presented to
            </h2>

            <div className="text-3xl sm:text-4xl font-black text-slate-900 font-serif tracking-tight border-b-2 border-violet-200 pb-4 mx-auto max-w-lg mb-6">
              {certificate.recipientName || 'Alex Morgan'}
            </div>

            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed mb-6">
              for successfully completing all required modules, architectural practical projects, comprehensive assessments, and demonstrating professional mastery in
            </p>

            <div className="text-xl sm:text-2xl font-black text-violet-900 mb-8 max-w-md mx-auto">
              "{certificate.courseTitle}"
            </div>

            {/* Signatures & Verification */}
            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-200/80 max-w-lg mx-auto text-left">
              <div>
                <div className="text-sm font-bold text-slate-900 font-serif italic">
                  {certificate.instructorName || 'Dr. Elena Vance'}
                </div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Lead Course Instructor
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono font-bold text-slate-800">
                  {certificate.id || 'CERT-AURA-2026-789'}
                </div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Issued: {new Date(certificate.issueDate || Date.now()).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-emerald-700 font-bold bg-emerald-50 py-1.5 px-4 rounded-full border border-emerald-200 w-fit mx-auto">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Cryptographically Verified Credential & Distinction Awarded</span>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-medium">
            Certificate ID: <strong className="font-mono text-slate-800">{certificate.id}</strong>
          </div>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-violet-600 to-amber-500 text-white shadow-md hover:opacity-95 flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download / Print PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
