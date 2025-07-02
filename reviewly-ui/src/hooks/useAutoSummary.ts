/**
 * Auto-Summary Hook for Reviewly Application
 * 
 * React hook for managing auto-summary functionality including
 * data collection, processing, and caching of summary results.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import { useState, useEffect, useCallback } from 'react';
import type { SummaryItem, AutoSummaryResult } from '../utils/autoSummary';
import { generateAutoSummary } from '../utils/autoSummary';

interface UseAutoSummaryOptions {
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
  cacheKey?: string;
}

interface UseAutoSummaryReturn {
  summaryResult: AutoSummaryResult | null;
  isLoading: boolean;
  error: string | null;
  generateSummary: (items: SummaryItem[]) => Promise<void>;
  refreshSummary: () => Promise<void>;
  clearSummary: () => void;
  addItems: (newItems: SummaryItem[]) => Promise<void>;
  removeItems: (itemIds: string[]) => Promise<void>;
  updateItems: (updatedItems: SummaryItem[]) => Promise<void>;
}

export const useAutoSummary = (
  initialItems: SummaryItem[] = [],
  options: UseAutoSummaryOptions = {}
): UseAutoSummaryReturn => {
  const {
    autoRefresh = false,
    refreshInterval = 300000, // 5 minutes
    cacheKey = 'auto-summary-cache'
  } = options;

  const [summaryResult, setSummaryResult] = useState<AutoSummaryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<SummaryItem[]>(initialItems);

  // Load cached summary on mount
  useEffect(() => {
    const loadCachedSummary = () => {
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsedCache = JSON.parse(cached);
          // Check if cache is still valid (less than 1 hour old)
          const cacheAge = Date.now() - new Date(parsedCache.timestamp).getTime();
          if (cacheAge < 3600000) { // 1 hour
            setSummaryResult({
              ...parsedCache.summary,
              metadata: {
                ...parsedCache.summary.metadata,
                processedAt: new Date(parsedCache.summary.metadata.processedAt)
              }
            });
          }
        }
      } catch (err) {
        console.warn('Failed to load cached summary:', err);
      }
    };

    loadCachedSummary();
  }, [cacheKey]);

  // Cache summary result
  const cacheSummary = useCallback((result: AutoSummaryResult) => {
    try {
      const cacheData = {
        summary: result,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (err) {
      console.warn('Failed to cache summary:', err);
    }
  }, [cacheKey]);

  // Generate summary from items
  const generateSummary = useCallback(async (summaryItems: SummaryItem[]) => {
    if (summaryItems.length === 0) {
      setSummaryResult(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate processing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = generateAutoSummary(summaryItems);
      setSummaryResult(result);
      cacheSummary(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate summary';
      setError(errorMessage);
      console.error('Auto-summary generation failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, [cacheSummary]);

  // Refresh current summary
  const refreshSummary = useCallback(async () => {
    if (items.length > 0) {
      await generateSummary(items);
    }
  }, [items, generateSummary]);

  // Clear summary and cache
  const clearSummary = useCallback(() => {
    setSummaryResult(null);
    setError(null);
    try {
      localStorage.removeItem(cacheKey);
    } catch (err) {
      console.warn('Failed to clear summary cache:', err);
    }
  }, [cacheKey]);

  // Add new items and regenerate summary
  const addItems = useCallback(async (newItems: SummaryItem[]) => {
    const updatedItems = [...items, ...newItems];
    setItems(updatedItems);
    await generateSummary(updatedItems);
  }, [items, generateSummary]);

  // Remove items and regenerate summary
  const removeItems = useCallback(async (itemIds: string[]) => {
    const updatedItems = items.filter(item => !itemIds.includes(item.id));
    setItems(updatedItems);
    await generateSummary(updatedItems);
  }, [items, generateSummary]);

  // Update existing items and regenerate summary
  const updateItems = useCallback(async (updatedItems: SummaryItem[]) => {
    const itemMap = new Map(updatedItems.map(item => [item.id, item]));
    const newItems = items.map(item => itemMap.get(item.id) || item);
    setItems(newItems);
    await generateSummary(newItems);
  }, [items, generateSummary]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh || items.length === 0) return;

    const interval = setInterval(() => {
      refreshSummary();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refreshSummary, items.length]);

  // Generate initial summary when items change
  useEffect(() => {
    if (initialItems.length > 0 && items.length === 0) {
      setItems(initialItems);
      generateSummary(initialItems);
    }
  }, [initialItems, items.length, generateSummary]);

  return {
    summaryResult,
    isLoading,
    error,
    generateSummary,
    refreshSummary,
    clearSummary,
    addItems,
    removeItems,
    updateItems,
  };
};

// Helper hook for collecting summary items from various sources
export const useSummaryItemCollector = () => {
  const [collectedItems, setCollectedItems] = useState<SummaryItem[]>([]);

  const collectFromSelfReview = useCallback((reviewData: any): SummaryItem[] => {
    const items: SummaryItem[] = [];
    
    // Collect from tasks section
    if (reviewData.tasks?.length > 0) {
      reviewData.tasks.forEach((task: any, index: number) => {
        if (task.description?.trim()) {
          items.push({
            id: `task-${index}-${Date.now()}`,
            content: `Task: ${task.description}. ${task.results || ''}`,
            source: 'self-entered',
            sourceDetails: 'Self Review - Tasks',
            timestamp: new Date(),
            keywords: [],
            importance: 'medium'
          });
        }
      });
    }

    // Collect from achievements
    if (reviewData.achievements?.length > 0) {
      reviewData.achievements.forEach((achievement: any, index: number) => {
        if (achievement.description?.trim()) {
          items.push({
            id: `achievement-${index}-${Date.now()}`,
            content: `Achievement: ${achievement.description}. Impact: ${achievement.impact || 'Not specified'}`,
            source: 'self-entered',
            sourceDetails: 'Self Review - Achievements',
            timestamp: new Date(),
            keywords: [],
            importance: 'high'
          });
        }
      });
    }

    // Collect from skills
    if (reviewData.skills?.length > 0) {
      reviewData.skills.forEach((skill: any, index: number) => {
        if (skill.description?.trim()) {
          items.push({
            id: `skill-${index}-${Date.now()}`,
            content: `Skill Development: ${skill.name} - ${skill.description}. Application: ${skill.application || 'Not specified'}`,
            source: 'self-entered',
            sourceDetails: 'Self Review - Skills',
            timestamp: new Date(),
            keywords: [],
            importance: 'medium'
          });
        }
      });
    }

    return items;
  }, []);

  const collectFromIntegrations = useCallback((integrationData: any[]): SummaryItem[] => {
    const items: SummaryItem[] = [];
    
    integrationData.forEach((integration) => {
      if (integration.data?.length > 0) {
        integration.data.forEach((dataItem: any, index: number) => {
          let content = '';
          let sourceDetails = '';
          
          switch (integration.type) {
            case 'github':
              content = `Code Contribution: ${dataItem.title || dataItem.message}`;
              sourceDetails = 'GitHub Integration';
              break;
            case 'jira':
              content = `Project Task: ${dataItem.summary} - ${dataItem.status}`;
              sourceDetails = 'Jira Integration';
              break;
            case 'notion':
              content = `Documentation: ${dataItem.title}`;
              sourceDetails = 'Notion Integration';
              break;
            default:
              content = dataItem.title || dataItem.description || 'Imported item';
              sourceDetails = `${integration.name} Integration`;
          }
          
          if (content.trim()) {
            items.push({
              id: `integration-${integration.type}-${index}-${Date.now()}`,
              content,
              source: 'imported',
              sourceDetails,
              timestamp: new Date(dataItem.date || Date.now()),
              keywords: [],
              importance: 'medium'
            });
          }
        });
      }
    });
    
    return items;
  }, []);

  const collectFromFeedback = useCallback((feedbackData: any[]): SummaryItem[] => {
    const items: SummaryItem[] = [];
    
    feedbackData.forEach((feedback, index) => {
      if (feedback.content?.trim()) {
        items.push({
          id: `feedback-${index}-${Date.now()}`,
          content: `Feedback: ${feedback.content}`,
          source: 'external',
          sourceDetails: `Feedback from ${feedback.from || 'Anonymous'}`,
          timestamp: new Date(feedback.date || Date.now()),
          keywords: [],
          importance: feedback.rating >= 4 ? 'high' : 'medium'
        });
      }
    });
    
    return items;
  }, []);

  const addCollectedItems = useCallback((newItems: SummaryItem[]) => {
    setCollectedItems(prev => [...prev, ...newItems]);
  }, []);

  const clearCollectedItems = useCallback(() => {
    setCollectedItems([]);
  }, []);

  return {
    collectedItems,
    collectFromSelfReview,
    collectFromIntegrations,
    collectFromFeedback,
    addCollectedItems,
    clearCollectedItems,
  };
};
