import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';

const AIBlogCard = () => {
  const queryClient = useQueryClient();

  const { data: summary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['dailySummary'],
    queryFn: api.fetchLatestSummary,
    refetchInterval: false
  });

  const { data: history } = useQuery({
    queryKey: ['history'],
    queryFn: () => api.fetchUnifiedHistory(5)
  });

  const generateMutation = useMutation({
    mutationFn: api.generateDailySummary,
    onSuccess: (newSummary) => {
      if (newSummary) {
        queryClient.setQueryData(['dailySummary'], { content: newSummary, created_at: new Date() });
      }
    }
  });

  useEffect(() => {
    if (!isLoadingSummary && !summary && history && history.length > 0) {
      generateMutation.mutate();
    }
  }, [summary, history, isLoadingSummary]);

  const isGenerating = generateMutation.isPending;
  const hasContent = !!summary?.content;
  const hasHistory = history && history.length > 0;

  return (
    <div className="bg-surface border border-border rounded-3xl p-8 relative overflow-hidden shadow-sm h-full flex flex-col justify-center transition-theme">
      
      {/* Background Ambience */}
      <div className={`absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none transition-opacity duration-1000 ${isGenerating ? 'opacity-100 animate-pulse' : 'opacity-50'}`} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md shadow-indigo-500/20 flex items-center gap-1">
              <Sparkles size={10} /> AI INSIGHT
            </div>
            <span className="text-text-muted text-xs font-mono">
              {isGenerating ? 'Generating...' : hasContent ? new Date(summary.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Standby'}
            </span>
          </div>
          
          <button 
            onClick={() => generateMutation.mutate()} 
            disabled={isGenerating}
            className={`text-text-muted hover:text-indigo-500 transition-all p-1 rounded-full hover:bg-surface-highlight ${isGenerating ? 'animate-spin text-indigo-500' : ''}`}
            title="Force Regenerate"
          >
            <RefreshCw size={14} />
          </button>
        </div>
        
        <div className="min-h-[80px] flex items-center">
          {isGenerating ? (
            <div className="flex flex-col gap-2 w-full animate-in fade-in duration-500">
              <div className="flex items-center gap-2 text-indigo-500 font-medium">
                <Loader2 size={18} className="animate-spin" /> 
                <span>Reading your day...</span>
              </div>
              <div className="h-1.5 w-full bg-surface-highlight rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-1/3 animate-[shimmer_1s_infinite_linear]" />
              </div>
            </div>
          ) : hasContent ? (
            <h2 className="text-xl md:text-2xl text-text-main font-light leading-relaxed animate-in slide-in-from-bottom-2">
              "{summary.content}"
            </h2>
          ) : hasHistory ? (
            <div className="text-text-muted italic flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" /> Syncing history to AI...
            </div>
          ) : (
            <p className="text-text-muted italic">
              "No activity yet. Log a task or meal to wake me up."
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIBlogCard;