import { useState, useEffect } from 'react';
import Icon from '../Icon';

const ratingQuestions = [
  {
    id: 'roleRating',
    title: '2. Role & Responsibilities Satisfaction?',
    description: 'How satisfied were you with your daily tasks and scope?'
  },
  {
    id: 'managerRating',
    title: '3. Manager Relationship?',
    description: 'Rate your professional relationship and support from leadership.'
  },
  {
    id: 'growthRating',
    title: '4. Career Growth Opportunities?',
    description: 'Availability of paths for advancement and learning.'
  },
  {
    id: 'cultureRating',
    title: '5. Company Culture & Environment?',
    description: 'General atmosphere, diversity, and office dynamics.'
  }
];

function StarRating({ id, value, onChange }) {
  return (
    <fieldset className="space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        {[1, 2, 3, 4, 5].map((star) => {
          const selected = star <= value;
          return (
            <label
              key={star}
              htmlFor={`${id}-${star}`}
              className={`relative inline-flex items-center justify-center rounded-full p-2 transition-colors ${selected ? 'text-[#00dbe9]' : 'text-[#3b494b] hover:text-[#00dbe9]'}`}
              style={{ cursor: 'pointer' }}
            >
              <input
                id={`${id}-${star}`}
                type="radio"
                name={id}
                value={star}
                checked={value === star}
                onChange={() => onChange(star)}
                className="sr-only"
              />
              <Icon className="text-3xl pointer-events-none">star</Icon>
            </label>
          );
        })}
      </div>
      <p className="text-sm text-[#b9cacb]">{value > 0 ? `${value}/5 selected` : 'No rating selected yet'}</p>
    </fieldset>
  );
}

export default function ExitInterview({ user, resignation, onSave, onSubmit }) {
  const [formData, setFormData] = useState({
    reason: '',
    roleRating: 0,
    managerRating: 0,
    growthRating: 0,
    cultureRating: 0,
    training: '',
    enjoyText: '',
    improveText: '',
    recommend: '',
    otherReasonText: '',
    rejoin: ''
  });

  useEffect(() => {
    if (resignation) {
      setFormData(prev => ({
        ...prev,
        reason: resignation.exitFeedback?.reason || resignation.reason || '',
        ...resignation.exitFeedback
      }));
    }
  }, [resignation]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (onSave) onSave(formData);
  };

  const handleSubmit = () => {
    if (onSubmit) onSubmit(formData);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="mb-10">
         <h1 className="text-4xl font-black text-[#00dbe9] mb-3 tracking-tight">Exit Interview</h1>
         <p className="text-lg text-[#b9cacb] max-w-2xl font-medium">Your feedback is invaluable to us as we strive to improve our workplace. This transition is important, and your honest insights will help shape the future of our company culture.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
         <div className="bg-[#1f1f24] p-6 rounded-2xl shadow-sm border border-[#3b494b] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#2a292f] flex items-center justify-center text-[#00dbe9]">
               <Icon>badge</Icon>
            </div>
            <div>
               <p className="text-xs font-bold text-[#b9cacb] uppercase tracking-wider">Employee Name</p>
               <p className="text-lg font-black text-[#e4e1e9]">{user.username || 'Alex Thompson'}</p>
            </div>
         </div>
         <div className="bg-[#1f1f24] p-6 rounded-2xl shadow-sm border border-[#3b494b] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#2a292f] flex items-center justify-center text-[#00dbe9]">
               <Icon>fingerprint</Icon>
            </div>
            <div>
               <p className="text-xs font-bold text-[#b9cacb] uppercase tracking-wider">Employee ID</p>
               <p className="text-lg font-black text-[#e4e1e9]">EF-2019-0482</p>
            </div>
         </div>
         <div className="bg-[#1f1f24] p-6 rounded-2xl shadow-sm border border-[#3b494b] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#ffb4ab]/50 flex items-center justify-center text-[#ffb4ab]">
               <Icon>event_busy</Icon>
            </div>
            <div>
               <p className="text-xs font-bold text-[#b9cacb] uppercase tracking-wider">Last Working Day</p>
               <p className="text-lg font-black text-[#e4e1e9]">{resignation?.relievingDate || 'Oct 24, 2023'}</p>
            </div>
         </div>
      </div>

      <div className="bg-[#1f1f24] p-6 rounded-2xl shadow-sm border border-[#3b494b] mb-8">
         <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-[#00dbe9]">Step 1 of 3: Career & Growth</span>
            <span className="text-sm font-bold text-[#b9cacb]">33% Completed</span>
         </div>
         <div className="w-full bg-[#2a292f] h-3 rounded-full overflow-hidden">
            <div className="bg-[#00dbe9] h-full transition-all duration-500 ease-out" style={{ width: '33%' }}></div>
         </div>
      </div>

      <div className="bg-[#1f1f24] rounded-2xl shadow-sm border border-[#3b494b] overflow-hidden">
         <div className="p-8 border-b border-[#3b494b] bg-[#2a292f]">
            <h3 className="text-xl font-bold text-[#00dbe9] mb-2">Exit Questionnaire</h3>
            <p className="text-sm font-medium text-[#b9cacb]">Please answer the following questions to the best of your ability. All responses are confidential.</p>
         </div>

         <div className="p-8 space-y-12">
            <div className="max-w-2xl">
               <label htmlFor="exit-reason" className="block text-base font-bold text-[#e4e1e9] mb-3">1. Primary reason for resignation?</label>
               <select
                  id="exit-reason"
                  value={formData.reason}
                  onChange={(e) => handleChange('reason', e.target.value)}
                  className="w-full p-4 border border-[#3b494b] rounded-xl focus:ring-2 focus:ring-[#00dbe9] focus:border-[#00dbe9] text-sm font-medium outline-none bg-[#2a292f] appearance-none"
               >
                  <option disabled value="">Select a reason</option>
                  <option>Career Growth</option>
                  <option>Better Opportunity</option>
                  <option>Higher Education</option>
                  <option>Health & Medical</option>
                  <option>Personal Reasons</option>
                  <option>Other</option>
               </select>
               {formData.reason === 'Other' && (
                  <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                     <label htmlFor="other-reason" className="block text-sm font-bold text-[#b9cacb] mb-2">Please describe the reason *</label>
                     <textarea
                        id="other-reason"
                        value={formData.otherReasonText || ''}
                        onChange={(e) => handleChange('otherReasonText', e.target.value)}
                        className="w-full p-4 border border-[#3b494b] rounded-xl focus:ring-2 focus:ring-[#00dbe9] focus:border-[#00dbe9] text-sm font-medium outline-none bg-[#2a292f] resize-none"
                        placeholder="Please share more details about your decision..."
                        rows="3"
                        required
                     />
                  </div>
               )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
               {ratingQuestions.map((question) => (
                 <div key={question.id}>
                   <label className="block text-base font-bold text-[#e4e1e9] mb-2">{question.title}</label>
                   <p className="text-sm font-medium text-[#b9cacb] mb-4">{question.description}</p>
                   <StarRating
                     id={question.id}
                     value={formData[question.id]}
                     onChange={(value) => handleChange(question.id, value)}
                   />
                 </div>
               ))}
            </div>

            <div className="bg-[#2a292f] p-6 rounded-xl border border-[#3b494b]">
               <label className="block text-base font-bold text-[#e4e1e9] mb-6">6. Did you receive adequate training and support?</label>
               <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                     <input
                        className="w-5 h-5 text-[#00dbe9] border-[#3b494b] focus:ring-[#00dbe9] rounded-full"
                        name="training"
                        type="radio"
                        value="yes"
                        checked={formData.training === 'yes'}
                        onChange={(e) => handleChange('training', e.target.value)}
                     />
                     <span className="text-sm font-bold group-hover:text-[#00dbe9] transition-colors">Yes, absolutely</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                     <input
                        className="w-5 h-5 text-[#00dbe9] border-[#3b494b] focus:ring-[#00dbe9] rounded-full"
                        name="training"
                        type="radio"
                        value="no"
                        checked={formData.training === 'no'}
                        onChange={(e) => handleChange('training', e.target.value)}
                     />
                     <span className="text-sm font-bold group-hover:text-[#00dbe9] transition-colors">No, it was lacking</span>
                  </label>
               </div>
            </div>

            <div className="space-y-10">
               <div>
                  <label className="block text-base font-bold text-[#e4e1e9] mb-3">7. What did you enjoy most about working here?</label>
                  <textarea 
                     value={formData.enjoyText}
                     onChange={(e) => handleChange('enjoyText', e.target.value)}
                     className="w-full p-4 border border-[#3b494b] rounded-xl focus:ring-2 focus:ring-[#00dbe9] focus:border-[#00dbe9] text-sm font-medium outline-none bg-[#2a292f] resize-none"
                     placeholder="Mention specific projects, teams, or benefits..." 
                     rows="4" 
                  ></textarea>
               </div>
               <div>
                  <label className="block text-base font-bold text-[#e4e1e9] mb-3">8. Suggested improvements for the role or company?</label>
                  <textarea 
                     value={formData.improveText}
                     onChange={(e) => handleChange('improveText', e.target.value)}
                     className="w-full p-4 border border-[#3b494b] rounded-xl focus:ring-2 focus:ring-[#00dbe9] focus:border-[#00dbe9] text-sm font-medium outline-none bg-[#2a292f] resize-none"
                     placeholder="Your constructive feedback helps us grow..." 
                     rows="4" 
                  ></textarea>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="p-6 rounded-xl bg-[#1f1f24] border border-[#3b494b]">
                  <label className="block text-xs font-bold text-[#b9cacb] uppercase tracking-widest mb-4">9. Recommend to others?</label>
                  <div className="flex flex-col gap-4">
                     <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                           className="w-5 h-5 text-[#00dbe9]"
                           name="recommend"
                           type="radio"
                           value="yes"
                           checked={formData.recommend === 'yes'}
                           onChange={(e) => handleChange('recommend', e.target.value)}
                        />
                        <span className="text-sm font-bold group-hover:text-[#00dbe9] transition-colors">Yes</span>
                     </label>
                     <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                           className="w-5 h-5 text-[#00dbe9]"
                           name="recommend"
                           type="radio"
                           value="no"
                           checked={formData.recommend === 'no'}
                           onChange={(e) => handleChange('recommend', e.target.value)}
                        />
                        <span className="text-sm font-bold group-hover:text-[#00dbe9] transition-colors">No</span>
                     </label>
                  </div>
               </div>
               <div className="p-6 rounded-xl bg-[#1f1f24] border border-[#3b494b]">
                  <label className="block text-xs font-bold text-[#b9cacb] uppercase tracking-widest mb-4">10. Consider rejoining?</label>
                  <div className="flex flex-col gap-4">
                     <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                           className="w-5 h-5 text-[#00dbe9]"
                           name="rejoin"
                           type="radio"
                           value="yes"
                           checked={formData.rejoin === 'yes'}
                           onChange={(e) => handleChange('rejoin', e.target.value)}
                        />
                        <span className="text-sm font-bold group-hover:text-[#00dbe9] transition-colors">Yes</span>
                     </label>
                     <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                           className="w-5 h-5 text-[#00dbe9]"
                           name="rejoin"
                           type="radio"
                           value="no"
                           checked={formData.rejoin === 'no'}
                           onChange={(e) => handleChange('rejoin', e.target.value)}
                        />
                        <span className="text-sm font-bold group-hover:text-[#00dbe9] transition-colors">No</span>
                     </label>
                  </div>
               </div>
            </div>
         </div>

         <div className="p-8 bg-[#2a292f] border-t border-[#3b494b] flex flex-wrap justify-between items-center gap-4">
            <div className="flex gap-4 w-full justify-end">
               <button 
                  onClick={handleSave}
                  className="px-8 py-3.5 border-2 border-[#00dbe9] text-[#00dbe9] font-bold rounded-xl hover:bg-[#00dbe9]/5 transition-all active:scale-95 text-sm"
               >
                  Save Draft
               </button>
               <button 
                  onClick={handleSubmit}
                  className="px-8 py-3.5 bg-[#00dbe9] text-white font-bold rounded-xl shadow-md hover:bg-[#00dbe9] transition-all active:scale-95 flex items-center gap-2 text-sm"
               >
                  Submit Interview
                  <Icon className="text-[20px]">send</Icon>
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
