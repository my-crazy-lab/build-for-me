/**
 * Career Path Visualization - Export View Component
 * 
 * This component provides export and sharing functionality for career data
 * including PDF generation, data export, and sharing options.
 * 
 * @fileoverview Export and sharing functionality
 * @author Career Path Visualization Team
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Share2, 
  FileText, 
  Image, 
  Code, 
  Link,
  Mail,
  Printer,
  Copy,
  Check,
  ExternalLink,
  Settings
} from 'lucide-react';
import type { CareerData } from '../../types';
import { useAppContext } from '../Layout/AppLayout';

// ============================================================================
// INTERFACES
// ============================================================================

interface ExportViewProps {
  className?: string;
}

interface ExportOption {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  format: string;
  action: () => void;
  disabled?: boolean;
}

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Export view component
 */
export function ExportView({ className = '' }: ExportViewProps): React.JSX.Element {
  const { careerData } = useAppContext();
  const [copiedLink, setCopiedLink] = useState(false);
  const [exportProgress, setExportProgress] = useState<string | null>(null);

  if (!careerData) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-center">
          <Download size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No career data available</p>
        </div>
      </div>
    );
  }

  // Export functions
  const handleExportPDF = async () => {
    setExportProgress('Generating PDF...');
    try {
      // TODO: Implement PDF export using jsPDF and html2canvas
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate export
      console.log('Export PDF');
      alert('PDF export functionality will be implemented with jsPDF and html2canvas');
    } catch (error) {
      console.error('PDF export failed:', error);
    } finally {
      setExportProgress(null);
    }
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(careerData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'career-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    // Convert milestones to CSV
    const milestones = careerData.milestones || [];
    const csvHeaders = ['Title', 'Organization', 'Type', 'Start Date', 'End Date', 'Location'];
    const csvRows = milestones.map(milestone => [
      milestone.title,
      milestone.organization,
      milestone.type,
      milestone.dateRange.start,
      milestone.dateRange.end || 'Present',
      milestone.location || ''
    ]);
    
    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    const dataBlob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'career-milestones.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(`${careerData.profile.name}'s Career Path`);
    const body = encodeURIComponent(`Check out my career journey: ${window.location.href}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out my career path visualization!`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`, '_blank');
  };

  // Export options configuration
  const exportOptions: ExportOption[] = [
    {
      id: 'pdf',
      title: 'Export as PDF',
      description: 'Generate a comprehensive PDF report of your career journey',
      icon: FileText,
      format: 'PDF',
      action: handleExportPDF,
      disabled: false
    },
    {
      id: 'json',
      title: 'Export Data (JSON)',
      description: 'Download your career data in JSON format for backup or migration',
      icon: Code,
      format: 'JSON',
      action: handleExportJSON,
      disabled: false
    },
    {
      id: 'csv',
      title: 'Export Milestones (CSV)',
      description: 'Export your career milestones as a CSV file for spreadsheet analysis',
      icon: FileText,
      format: 'CSV',
      action: handleExportCSV,
      disabled: false
    },
    {
      id: 'image',
      title: 'Export as Image',
      description: 'Generate high-quality images of your visualizations',
      icon: Image,
      format: 'PNG/JPG',
      action: () => alert('Image export functionality will be implemented'),
      disabled: true
    }
  ];

  const sharingOptions = [
    {
      id: 'link',
      title: 'Copy Link',
      description: 'Copy a shareable link to your career path',
      icon: copiedLink ? Check : Link,
      action: handleCopyLink,
      color: copiedLink ? 'text-green-500' : 'text-blue-500'
    },
    {
      id: 'email',
      title: 'Share via Email',
      description: 'Send your career path via email',
      icon: Mail,
      action: handleShareEmail,
      color: 'text-purple-500'
    },
    {
      id: 'linkedin',
      title: 'Share on LinkedIn',
      description: 'Share your career journey on LinkedIn',
      icon: ExternalLink,
      action: handleShareLinkedIn,
      color: 'text-blue-600'
    },
    {
      id: 'print',
      title: 'Print',
      description: 'Print your career path for physical copies',
      icon: Printer,
      action: handlePrint,
      color: 'text-gray-600'
    }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className={`max-w-4xl mx-auto ${className}`}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Export & Share
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Export your career data in various formats or share your professional journey with others.
        </p>
      </div>

      {/* Export Progress */}
      {exportProgress && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-blue-800 dark:text-blue-200">{exportProgress}</span>
          </div>
        </motion.div>
      )}

      {/* Export Options */}
      <motion.div variants={itemVariants} className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Export Options
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exportOptions.map((option) => (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={option.action}
              disabled={option.disabled || !!exportProgress}
              className={`
                p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 
                text-left transition-all duration-200 hover:shadow-md
                ${option.disabled || exportProgress 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:border-blue-300 dark:hover:border-blue-600'
                }
              `}
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <option.icon size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {option.title}
                    </h3>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {option.format}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {option.description}
                  </p>
                  {option.disabled && (
                    <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                      Coming soon
                    </p>
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Sharing Options */}
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Sharing Options
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sharingOptions.map((option) => (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={option.action}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-left transition-all duration-200 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600"
            >
              <div className="flex items-center space-x-3">
                <option.icon size={20} className={option.color} />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {option.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {option.description}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Export Settings */}
      <motion.div
        variants={itemVariants}
        className="mt-12 bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Settings size={20} className="text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Export Settings
          </h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Include Personal Information
              </label>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Include contact details and personal bio in exports
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Include Compensation Data
              </label>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Include salary and compensation information
              </p>
            </div>
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                High Quality Images
              </label>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Export images in high resolution (larger file size)
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
        </div>
      </motion.div>

      {/* Tips */}
      <motion.div
        variants={itemVariants}
        className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800"
      >
        <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-3">
          💡 Export Tips
        </h3>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <li>• PDF exports include all visualizations and are perfect for sharing with recruiters</li>
          <li>• JSON exports can be imported into other career tracking tools</li>
          <li>• CSV exports are great for analyzing your career data in spreadsheet applications</li>
          <li>• Use the sharing link to showcase your career journey on social media</li>
        </ul>
      </motion.div>
    </motion.div>
  );
}
