import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api';
import { Sparkles, Loader2, RefreshCw, AlertCircle } from 'lucide-react';

const AIBlogCard = () => {
  const queryClient = useQueryClient();

  // 1. Fetch Today's Summary
  const { data: summary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['dailySummary'],
    queryFn: api.fetchLatestSummary,
    refetchInterval: false // Don't poll DB, we rely on invalidation
  });

  // 2. Fetch Today's History (Just to check if we SHOULD generate)
  const { data: history } = useQuery({
    queryKey: ['history'],
    queryFn: () => api.fetchUnifiedHistory(5)
  });

  // 3. The Generator Mutation
  const generateMutation = useMutation({
    mutationFn: api.generateDailySummary,
    onSuccess: (newSummary) => {
      if (newSummary) {
        queryClient.setQueryData(['dailySummary'], { content: newSummary, created_at: new Date() });
      }
    }
  });

  // 4. AUTO-TRIGGER: If we have history but no summary, GENERATE IT.
  useEffect(() => {
    if (!isLoadingSummary && !summary && history && history.length > 0) {
      console.log("⚡ Auto-triggering AI Summary...");
      generateMutation.mutate();
    }
  }, [summary, history, isLoadingSummary]);

  // UI State Calculation
  const isGenerating = generateMutation.isPending;
  const hasContent = !!summary?.content;
  const hasHistory = history && history.length > 0;

  return (
    <div className="bg-white border border-slate-200/60 rounded-3xl p-8 relative overflow-hidden shadow-sm h-full flex flex-col justify-center transition-all">
      
      {/* Background Ambience */}
      <div className={`absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-50 rounded-full blur-[80px] pointer-events-none transition-opacity duration-1000 ${isGenerating ? 'opacity-100 animate-pulse' : 'opacity-50'}`} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md shadow-indigo-200 flex items-center gap-1">
              <Sparkles size={10} /> AI INSIGHT
            </div>
            <span className="text-slate-400 text-xs font-mono">
              {isGenerating ? 'Generating...' : hasContent ? new Date(summary.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Standby'}
            </span>
          </div>
          
          <button 
            onClick={() => generateMutation.mutate()} 
            disabled={isGenerating}
            className={`text-slate-300 hover:text-indigo-600 transition-all p-1 rounded-full hover:bg-indigo-50 ${isGenerating ? 'animate-spin text-indigo-500' : ''}`}
            title="Force Regenerate"
          >
            <RefreshCw size={14} />
          </button>
        </div>
        
        <div className="min-h-[80px] flex items-center">
          {isGenerating ? (
            <div className="flex flex-col gap-2 w-full animate-in fade-in duration-500">
              <div className="flex items-center gap-2 text-indigo-600 font-medium">
                <Loader2 size={18} className="animate-spin" /> 
                <span>Reading your day...</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-1/3 animate-[shimmer_1s_infinite_linear]" />
              </div>
            </div>
          ) : hasContent ? (
            <h2 className="text-xl md:text-2xl text-slate-800 font-light leading-relaxed animate-in slide-in-from-bottom-2">
              "{summary.content}"
            </h2>
          ) : hasHistory ? (
            <div className="text-slate-400 italic flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" /> Syncing history to AI...
            </div>
          ) : (
            <p className="text-slate-400 italic">
              "No activity yet. Log a task or meal to wake me up."
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIBlogCard;