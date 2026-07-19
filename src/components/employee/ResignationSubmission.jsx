import { useState, useEffect } from 'react';
import Icon from '../Icon';
import { fetchDraftResignation, saveDraftResignation, submitResignation } from '../../api';

const emergencyReasons = [
  'Medical Emergency',
  'Family Relocation',
  'Personal / Health Issues',
  'Immediate Better Opportunity',
  'Other'
];

export default function ResignationSubmission({ user, systemSettings, onSubmitResignation }) {
  const [reason, setReason] = useState('');
  const [comments, setComments] = useState('');
  const [relievingDate, setRelievingDate] = useState('');
  const [isEmergencyRequested, setIsEmergencyRequested] = useState(false);
  const [emergencyReason, setEmergencyReason] = useState('');
  const [emergencyRemarks, setEmergencyRemarks] = useState('');
  const [additionalFeedback, setAdditionalFeedback] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Requirement States
  const [draftId, setDraftId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState('idle');
  const [toast, setToast] = useState(null);

  // Load draft on mount
  useEffect(() => {
    const loadDraft = async () => {
      setLoading(true);
      try {
        const draft = await fetchDraftResignation();
        if (draft) {
          setDraftId(draft.id);
          if (draft.reason_for_leaving) setReason(draft.reason_for_leaving);
          if (draft.elaboration) setComments(draft.elaboration);
          if (draft.immediate_release !== undefined) setIsEmergencyRequested(draft.immediate_release);
          if (draft.last_working_day) setRelievingDate(draft.last_working_day);
          if (draft.additional_feedback) setAdditionalFeedback(draft.additional_feedback);
        }
      } catch (err) {
        console.log('No active draft found or error loading draft:', err.message);
      } finally {
        setLoading(false);
      }
    };
    loadDraft();
  }, []);

  // Validation
  useEffect(() => {
    const errorsList = {};
    if (!reason) {
      errorsList.reason = 'Reason for leaving is required.';
    }
    if (!relievingDate) {
      errorsList.relievingDate = 'Proposed last working day is required.';
    } else {
      const localToday = new Date();
      const year = localToday.getFullYear();
      const month = String(localToday.getMonth() + 1).padStart(2, '0');
      const day = String(localToday.getDate()).padStart(2, '0');
      const todayStr = `${year}-${month}-${day}`;
      
      if (relievingDate < todayStr) {
        errorsList.relievingDate = 'Last working day cannot be before the current date.';
      }
    }
    setValidationErrors(errorsList);
  }, [reason, relievingDate]);

  // Toast timer
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleSaveDraft = async () => {
    setLoading(true);
    try {
      const payload = {
        reason_for_leaving: reason,
        elaboration: comments,
        immediate_release: isEmergencyRequested,
        last_working_day: relievingDate || null,
        additional_feedback: additionalFeedback,
      };
      const result = await saveDraftResignation(payload, draftId);
      if (result && result.id) {
        setDraftId(result.id);
      }
      setToast('Draft saved successfully.');
    } catch (err) {
      setToast(err.message || 'Failed to save draft');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    if (isEmergencyRequested && !emergencyReason) {
      alert('Please select an emergency reason.');
      return;
    }
    if (isEmergencyRequested && !emergencyRemarks.trim()) {
      alert('Please provide remarks explaining your emergency request.');
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus('submitting');
    try {
      const payload = {
        employee_id: String(user.id || user.email || ''),
        reason: reason,
        last_working_day: relievingDate,
        comments: comments,
      };
      const result = await submitResignation(payload);
      setSubmissionStatus('success');
      setToast('Resignation submitted successfully.');
      setTimeout(() => {
        const completeResignation = {
          id: result.id,
          email: user.email,
          name: user.fullName || user.username || 'Alex Thompson',
          department: user.designation || 'Design',
          reason: reason,
          submissionDate: new Date().toISOString().split('T')[0],
          relievingDate: relievingDate,
          comments: comments,
          status: 'Pending',
          exitFeedback: {
            cultureRating: 0,
            compensationRating: 0,
            recommend: 'neutral',
            emergencyReleaseRequested: isEmergencyRequested,
            emergencyReason: isEmergencyRequested ? emergencyReason : '',
            emergencyRemarks: isEmergencyRequested ? emergencyRemarks : '',
          }
        };
        onSubmitResignation(completeResignation);
      }, 1000);
    } catch (err) {
      setSubmissionStatus('error');
      setToast(err.message || 'Failed to submit resignation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-3xl bg-[#111827] border border-[#00dbe9]/20 px-6 py-4 text-sm shadow-2xl text-[#e4e1e9] animate-in fade-in duration-200">
          {toast}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
         <div>
            <h3 className="text-4xl font-black text-[#00dbe9] mb-3 tracking-tight">Initiate Transition</h3>
            <p className="text-base font-medium text-[#b9cacb] max-w-2xl leading-relaxed">
               We value your time at RESIGN TRACK. This process is designed to be supportive, clear, and professional as you prepare for your next chapter.
            </p>
         </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#1f1f24] rounded-2xl shadow-sm border border-[#3b494b] overflow-hidden">
         <div className="p-8 md:p-10 space-y-10">
            <section className="space-y-6">
               <div className="space-y-2">
                  <label className="text-xs font-bold text-[#00dbe9] uppercase tracking-wider">Reason for Leaving *</label>
                  <select 
                     required
                     value={reason}
                     onChange={(e) => setReason(e.target.value)}
                     className="w-full bg-[#2a292f] border border-[#3b494b] rounded-xl p-4 text-sm font-semibold focus:ring-2 focus:ring-[#00dbe9] focus:border-[#00dbe9] outline-none transition-all"
                  >
                     <option value="" disabled>Select a primary reason</option>
                     {systemSettings.reasons.map((r, i) => (
                        <option key={i} value={r}>{r}</option>
                     ))}
                  </select>
                  {validationErrors.reason && <p className="text-xs text-[#ffb4ab] mt-1">{validationErrors.reason}</p>}
               </div>
               
               <div className="space-y-2">
                  <label className="text-xs font-bold text-[#00dbe9] uppercase tracking-wider">Please Elaborate (Optional)</label>
                  <textarea 
                     rows="4"
                     value={comments}
                     onChange={(e) => setComments(e.target.value)}
                     className="w-full bg-[#2a292f] border border-[#3b494b] rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#00dbe9] focus:border-[#00dbe9] outline-none transition-all resize-none"
                     placeholder="Briefly share the context of your decision..."
                  ></textarea>
               </div>

               <div className="space-y-3">
                  <div>
                     <label className="text-xs font-bold text-[#00dbe9] uppercase tracking-wider block mb-3">Emergency Immediate Release Request</label>
                     <p className="text-sm text-[#b9cacb] mb-4">Is this an emergency resignation requiring immediate release?</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                     {['Yes', 'No'].map((option) => (
                        <label
                           key={option}
                           className={`flex items-center gap-3 p-4 rounded-xl border text-sm font-semibold cursor-pointer transition-all ${
                              (option === 'Yes' && isEmergencyRequested) || (option === 'No' && !isEmergencyRequested)
                                 ? 'bg-[#00dbe9] text-[#08131f] border-[#00dbe9]'
                                 : 'bg-[#2a292f] text-[#e4e1e9] border border-[#3b494b] hover:border-[#00dbe9]'
                           }`}
                        >
                           <input
                              type="radio"
                              name="emergencyRelease"
                              value={option}
                              checked={option === 'Yes' ? isEmergencyRequested : !isEmergencyRequested}
                              onChange={() => {
                                 const isYes = option === 'Yes';
                                 setIsEmergencyRequested(isYes);
                                 if (!isYes) {
                                    setEmergencyReason('');
                                    setEmergencyRemarks('');
                                    setErrors(prev => ({ ...prev, emergencyReason: '', emergencyRemarks: '' }));
                                 }
                              }}
                              className="sr-only"
                           />
                           <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center">
                              {((option === 'Yes' && isEmergencyRequested) || (option === 'No' && !isEmergencyRequested)) && (
                                 <span className="w-2.5 h-2.5 rounded-full bg-current"></span>
                              )}
                           </span>
                           <span>{option}</span>
                        </label>
                     ))}
                  </div>
               </div>

               {isEmergencyRequested && (
                  <div className="space-y-4 mt-6 overflow-hidden transition-all duration-300 ease-out animate-in fade-in slide-in-from-top-2">
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-[#00dbe9] uppercase tracking-wider block mb-3">Emergency Reason *</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                           {emergencyReasons.map((r, i) => {
                              const selected = emergencyReason === r;
                              return (
                                 <button
                                    key={i}
                                    type="button"
                                    onClick={() => {
                                       setEmergencyReason(r);
                                       setErrors(prev => ({ ...prev, emergencyReason: '' }));
                                    }}
                                    className={`flex items-center justify-center p-4 rounded-xl border text-sm font-semibold transition-all ${
                                       selected
                                          ? 'bg-[#00dbe9] text-[#08131f] border-[#00dbe9]'
                                          : 'bg-[#2a292f] text-[#e4e1e9] border border-[#3b494b] hover:border-[#00dbe9]'
                                    }`}
                                 >
                                    {r}
                                 </button>
                              );
                           })}
                        </div>
                        {errors.emergencyReason && <p className="text-xs text-[#ffb4ab] mt-1">{errors.emergencyReason}</p>}
                     </div>

                     <div className="space-y-2">
                        <label className="text-xs font-bold text-[#00dbe9] uppercase tracking-wider">Remarks *</label>
                        <textarea
                           rows="4"
                           value={emergencyRemarks}
                           onChange={(e) => {
                              setEmergencyRemarks(e.target.value);
                              if (e.target.value.trim()) setErrors(prev => ({ ...prev, emergencyRemarks: '' }));
                           }}
                           className="w-full bg-[#2a292f] border border-[#3b494b] rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#00dbe9] focus:border-[#00dbe9] outline-none transition-all resize-none"
                           placeholder="Please explain why immediate release is required."
                        ></textarea>
                        {errors.emergencyRemarks && <p className="text-xs text-[#ffb4ab] mt-1">{errors.emergencyRemarks}</p>}
                     </div>
                  </div>
               )}

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-[#00dbe9] uppercase tracking-wider">Proposed Last Working Day *</label>
                     <div className="relative">
                        <Icon className="absolute right-4 top-1/2 -translate-y-1/2 text-[#76777d]">calendar_today</Icon>
                        <input 
                           required
                           type="date"
                           value={relievingDate}
                           onChange={(e) => setRelievingDate(e.target.value)}
                           className="w-full bg-[#2a292f] border border-[#3b494b] rounded-xl p-4 text-sm font-semibold focus:ring-2 focus:ring-[#00dbe9] focus:border-[#00dbe9] outline-none transition-all appearance-none"
                        />
                     </div>
                     {validationErrors.relievingDate && <p className="text-xs text-[#ffb4ab] mt-1">{validationErrors.relievingDate}</p>}
                     <p className="text-[11px] font-medium text-[#b9cacb] italic mt-2">Note: Standard notice period is {systemSettings.noticePeriod} days.</p>
                  </div>
               </div>
            </section>

            <div className="h-px bg-[#e0e3e5]"></div>

            <section className="space-y-6">
               <div className="space-y-2">
                  <label className="text-xs font-bold text-[#00dbe9] uppercase tracking-wider">Additional Feedback</label>
                  <p className="text-sm font-medium text-[#b9cacb] mb-4">How could we have better supported your growth during your tenure?</p>
                  <textarea 
                     rows="3"
                     value={additionalFeedback}
                     onChange={(e) => setAdditionalFeedback(e.target.value)}
                     className="w-full bg-[#2a292f] border border-[#3b494b] rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#00dbe9] focus:border-[#00dbe9] outline-none transition-all resize-none"
                     placeholder="Share any suggestions or reflections..."
                  ></textarea>
               </div>
            </section>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-4 pt-4 mt-8">
               <button 
                  type="button" 
                  disabled={loading || isSubmitting}
                  onClick={handleSaveDraft}
                  className="text-[#b9cacb] font-bold hover:text-[#00dbe9] hover:bg-[#2a292f] rounded-xl transition-colors px-6 py-3 disabled:opacity-50"
               >
                  {loading ? 'Saving Draft...' : 'Save as Draft'}
               </button>
               <button 
                  type="submit" 
                  disabled={isSubmitting || loading || Object.keys(validationErrors).length > 0}
                  className="px-8 py-3.5 bg-[#00dbe9] text-white font-bold rounded-xl shadow-md hover:bg-[#00dbe9] active:scale-95 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:active:scale-100"
               >
                  {isSubmitting ? 'Submitting Request...' : 'Review & Submit'}
                  {!isSubmitting && <Icon className="text-[20px]">arrow_forward</Icon>}
               </button>
            </div>
         </div>
      </form>
    </div>
  );
}
