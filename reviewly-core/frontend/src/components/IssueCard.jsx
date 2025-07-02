const IssueCard = ({ issue }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 1: return '🔴'; // Urgent
      case 2: return '🟠'; // High
      case 3: return '🟡'; // Medium
      case 4: return '🟢'; // Low
      default: return '⚪'; // No priority
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 1: return 'Urgent';
      case 2: return 'High';
      case 3: return 'Medium';
      case 4: return 'Low';
      default: return 'No Priority';
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">
            <a 
              href={issue.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              {issue.title}
            </a>
          </h3>
          
          <div className="flex items-center space-x-3 text-sm text-gray-600 mb-2">
            <span className="inline-flex items-center">
              {issue.team && (
                <span className="font-medium">{issue.team.key}</span>
              )}
            </span>
            
            <span className="inline-flex items-center">
              {getPriorityIcon(issue.priority)}
              <span className="ml-1">{getPriorityText(issue.priority)}</span>
            </span>
          </div>
        </div>
        
        {issue.state && (
          <span 
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: issue.state.color }}
          >
            {issue.state.name}
          </span>
        )}
      </div>
      
      {issue.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {issue.description}
        </p>
      )}
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Created: {formatDate(issue.createdAt)}</span>
        <span>Updated: {formatDate(issue.updatedAt)}</span>
      </div>
    </div>
  );
};

export default IssueCard;
