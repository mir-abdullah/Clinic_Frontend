"use client";

import { User, Calendar, Phone, MapPin, Stethoscope, Briefcase, FileText, X, Clock } from 'lucide-react';
import { IMaskInput } from 'react-imask';
import { useState } from 'react';

export const AddPatient = ({open , onClose}:{open: boolean, onClose: () => void}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    guardianName: '',
    phoneNumber: '',
    address: '',
    occupation: '',
    medicalNotes: ''
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string>('');

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl w-full bg-gradient-to-br from-white via-slate-50/30 to-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-slate-200/60">
      {/* Header */}
      <div className="relative px-8 py-6 bg-[var(--primary-dark)] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-lg">
              <User className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Add New Patient</h2>
              <div className="flex items-center gap-2 mt-1 text-white/90">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-sm font-medium">Complete registration form</span>
              </div>
            </div>
          </div>
          
          <button 
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            aria-label="Close modal"
            onClick={onClose}
          >
            <X className="w-5 h-5 text-white" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
        
        {/* Patient Information Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--primary-dark)] shadow-sm">
              <User className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
            </div>
            <h3 className="text-sm uppercase tracking-wider font-bold text-slate-700">
              Patient Information
            </h3>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent"></div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6 space-y-5 hover:shadow-md transition-shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Full Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name <span className="text-rose-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focusedField === 'fullName' ? 'text-[var(--primary-dark)]' : 'text-slate-400'}`}>
                    <User className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    onFocus={() => setFocusedField('fullName')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50/80 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[var(--primary-dark)] focus:bg-white focus:shadow-lg transition-all text-[15px]"
                    placeholder="Enter patient's full legal name"
                  />
                </div>
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Age
                </label>
                <div className="relative">
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focusedField === 'age' ? 'text-[var(--primary-dark)]' : 'text-slate-400'}`}>
                    <Calendar className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                    onFocus={() => setFocusedField('age')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-12 pr-16 py-3.5 bg-slate-50/80 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[var(--primary-dark)] focus:bg-white focus:shadow-lg transition-all text-[15px]"
                    placeholder="Enter age"
                  />
                  {formData.age && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500">
                      years
                    </div>
                  )}
                </div>
              </div>

              {/* Occupation */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Occupation
                </label>
                <div className="relative">
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focusedField === 'occupation' ? 'text-[var(--primary-dark)]' : 'text-slate-400'}`}>
                    <Briefcase className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <input
                    type="text"
                    value={formData.occupation}
                    onChange={(e) => handleChange('occupation', e.target.value)}
                    onFocus={() => setFocusedField('occupation')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50/80 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[var(--primary-dark)] focus:bg-white focus:shadow-lg transition-all text-[15px]"
                    placeholder="Current profession"
                  />
                </div>
              </div>

              {/* Guardian Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Guardian Name <span className="text-xs text-slate-500 font-normal">(for minors)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.guardianName}
                    onChange={(e) => handleChange('guardianName', e.target.value)}
                    onFocus={() => setFocusedField('guardian')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full px-4 py-3.5 bg-slate-50/80 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[var(--primary-dark)] focus:bg-white focus:shadow-lg transition-all text-[15px]"
                    placeholder="Legal guardian or parent name"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--primary-dark)] shadow-sm">
              <Phone className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
            </div>
            <h3 className="text-sm uppercase tracking-wider font-bold text-slate-700">
              Contact Information
            </h3>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent"></div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6 space-y-5 hover:shadow-md transition-shadow">
            <div className="grid grid-cols-1 gap-5">
              
              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Phone Number <span className="text-rose-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focusedField === 'phone' ? 'text-[var(--primary-dark)]' : 'text-slate-400'}`}>
                    <Phone className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <IMaskInput
                    type="tel"
                    mask="0000-0000000"
                    value={formData.phoneNumber}
                    onAccept={(value: string) => {
                      handleChange('phoneNumber', String(value || ''));
                      if (phoneError && /^\d{4}-\d{7}$/.test(String(value || ''))) {
                        setPhoneError('');
                      }
                    }}
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => {
                      setFocusedField(null);
                      if (formData.phoneNumber && !/^\d{4}-\d{7}$/.test(formData.phoneNumber)) {
                        setPhoneError('Please enter a valid phone number (e.g., 03XX-XXXXXXX)');
                      } else {
                        setPhoneError('');
                      }
                    }}
                    aria-invalid={!!phoneError}
                    className={`w-full pl-12 pr-4 py-3.5 bg-slate-50/80 border-2 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:shadow-lg transition-all text-[15px] ${
                      phoneError 
                        ? 'border-rose-400 focus:border-rose-500' 
                        : 'border-slate-200 focus:border-[var(--primary-dark)]'
                    }`}
                    placeholder="03XX-XXXXXXX"
                  />
                </div>
                <p className={`text-xs mt-2 transition-colors ${phoneError ? 'text-rose-500' : 'text-slate-500'}`}>
                  {phoneError || 'Required — used for appointment reminders and SMS'}
                </p>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Residential Address
                </label>
                <div className="relative">
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focusedField === 'address' ? 'text-[var(--primary-dark)]' : 'text-slate-400'}`}>
                    <MapPin className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    onFocus={() => setFocusedField('address')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50/80 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[var(--primary-dark)] focus:bg-white focus:shadow-lg transition-all text-[15px]"
                    placeholder="Complete street address, city, and postal code"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Medical Details Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--primary-dark)] shadow-sm">
              <Stethoscope className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
            </div>
            <h3 className="text-sm uppercase tracking-wider font-bold text-slate-700">
              Medical Details
            </h3>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent"></div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6 hover:shadow-md transition-shadow">
            {/* Medical Notes */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Medical Notes & History
              </label>
              <div className="relative">
                <div className={`absolute left-4 top-4 transition-colors ${focusedField === 'notes' ? 'text-[var(--primary-dark)]' : 'text-slate-400'}`}>
                  <FileText className="w-5 h-5" strokeWidth={2} />
                </div>
                <textarea
                  rows={4}
                  value={formData.medicalNotes}
                  onChange={(e) => handleChange('medicalNotes', e.target.value)}
                  onFocus={() => setFocusedField('notes')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50/80 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[var(--primary-dark)] focus:bg-white focus:shadow-lg transition-all resize-none text-[15px] leading-relaxed"
                  placeholder="Allergies, pre-existing conditions, current medications, special considerations..."
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-br from-slate-50 to-white border-t-2 border-slate-200/80 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
          <p className="text-sm font-medium text-slate-600">
            <span className="text-rose-500 font-bold">*</span> indicates required field
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="px-6 py-3 rounded-xl font-semibold text-slate-700 bg-white border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm hover:shadow active:scale-[0.98] text-[15px]"
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-6 py-3 rounded-xl font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-dark)] transition-all shadow-lg active:scale-[0.98] text-[15px]"
          >
            Save Patient
          </button>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgb(241 245 249);
          border-radius: 10px;
          margin: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, rgb(16 185 129), rgb(6 182 212));
          border-radius: 10px;
          border: 2px solid rgb(241 245 249);
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, rgb(5 150 105), rgb(8 145 178));
        }

        /* Animation for pulsing dot */
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};