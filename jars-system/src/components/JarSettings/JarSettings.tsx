import React, { useState } from 'react';
import { Save, RotateCcw, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getJarInfo, validateJarAllocations } from '../../utils/jarCalculations';
import { type JarAllocations, DEFAULT_JAR_ALLOCATIONS } from '../../types';

const JarSettings: React.FC = () => {
  const { user, updatePreferences } = useAuth();
  const [allocations, setAllocations] = useState<JarAllocations>(
    user?.preferences.jarAllocations || DEFAULT_JAR_ALLOCATIONS
  );
  const [hasChanges, setHasChanges] = useState(false);

  const jars = getJarInfo(user?.preferences.language);

  const handleAllocationChange = (jarId: keyof JarAllocations, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newAllocations = { ...allocations, [jarId]: numValue };
    setAllocations(newAllocations);
    setHasChanges(true);
  };

  const handleSave = () => {
    if (!validateJarAllocations(allocations)) {
      alert('Total allocation must equal 100%');
      return;
    }

    updatePreferences({ jarAllocations: allocations });
    setHasChanges(false);
  };

  const handleReset = () => {
    setAllocations(DEFAULT_JAR_ALLOCATIONS);
    setHasChanges(true);
  };

  const handleResetToSaved = () => {
    setAllocations(user?.preferences.jarAllocations || DEFAULT_JAR_ALLOCATIONS);
    setHasChanges(false);
  };

  const totalPercentage = Object.values(allocations).reduce((sum, value) => sum + value, 0);
  const isValid = Math.abs(totalPercentage - 100) < 0.01;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">JAR Settings</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Customize your money allocation percentages for each JAR
        </p>
      </div>

      {/* JARS Explanation */}
      <div className="jar-card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          About the JARS System
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          The JARS system is a simple money management method that divides your income into 6 categories:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jars.map((jar) => (
            <div key={jar.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-2xl">{jar.icon}</span>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {jar.name} ({jar.defaultPercentage}%)
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {jar.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Allocation Settings */}
      <div className="jar-card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Allocation Percentages
          </h3>
          <div className="flex space-x-3">
            <button
              onClick={handleReset}
              className="btn-secondary flex items-center"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Default
            </button>
            {hasChanges && (
              <button
                onClick={handleResetToSaved}
                className="btn-secondary"
              >
                Cancel Changes
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={!hasChanges || !isValid}
              className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </button>
          </div>
        </div>

        {/* Total Percentage Warning */}
        {!isValid && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
              <p className="text-yellow-800 dark:text-yellow-200">
                Total allocation is {totalPercentage.toFixed(1)}%. It must equal 100%.
              </p>
            </div>
          </div>
        )}

        {/* JAR Allocation Inputs */}
        <div className="space-y-6">
          {jars.map((jar) => (
            <div key={jar.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <span className="text-3xl">{jar.icon}</span>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {jar.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {jar.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Default: {jar.defaultPercentage}%
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={allocations[jar.id]}
                    onChange={(e) => handleAllocationChange(jar.id, e.target.value)}
                    className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
                    %
                  </span>
                </div>
                
                {/* Visual bar */}
                <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${Math.min(allocations[jar.id], 100)}%`,
                      backgroundColor: jar.color,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total Summary */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-900 dark:text-white">
              Total Allocation:
            </span>
            <span className={`font-bold text-lg ${
              isValid ? 'text-green-600' : 'text-red-600'
            }`}>
              {totalPercentage.toFixed(1)}%
            </span>
          </div>
          
          {/* Visual total bar */}
          <div className="mt-3 w-full h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isValid ? 'bg-green-500' : totalPercentage > 100 ? 'bg-red-500' : 'bg-yellow-500'
              }`}
              style={{ width: `${Math.min(totalPercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="jar-card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Tips for Customizing Your JARS
        </h3>
        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
          <li className="flex items-start">
            <span className="text-primary-600 mr-2">•</span>
            Start with the default percentages and adjust based on your lifestyle
          </li>
          <li className="flex items-start">
            <span className="text-primary-600 mr-2">•</span>
            If you have high living costs, you might increase Necessities to 60-65%
          </li>
          <li className="flex items-start">
            <span className="text-primary-600 mr-2">•</span>
            Young professionals might allocate more to Education and Financial Freedom
          </li>
          <li className="flex items-start">
            <span className="text-primary-600 mr-2">•</span>
            Remember: the total must always equal 100%
          </li>
          <li className="flex items-start">
            <span className="text-primary-600 mr-2">•</span>
            Review and adjust your allocations quarterly as your situation changes
          </li>
        </ul>
      </div>
    </div>
  );
};

export default JarSettings;
