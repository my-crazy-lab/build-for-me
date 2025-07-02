const MergeRequestCard = ({ mergeRequest }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStateColor = (state) => {
    switch (state) {
      case 'opened': return 'bg-green-100 text-green-800';
      case 'merged': return 'bg-purple-100 text-purple-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStateIcon = (state) => {
    switch (state) {
      case 'opened': return '🔄';
      case 'merged': return '✅';
      case 'closed': return '❌';
      default: return '📝';
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">
            <a 
              href={mergeRequest.web_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              {mergeRequest.title}
            </a>
          </h3>
          
          <div className="flex items-center space-x-3 text-sm text-gray-600 mb-2">
            <span className="inline-flex items-center">
              <span className="font-medium">!{mergeRequest.iid}</span>
            </span>
            
            {mergeRequest.source_branch && mergeRequest.target_branch && (
              <span className="inline-flex items-center text-xs">
                <code className="bg-gray-100 px-1 rounded">{mergeRequest.source_branch}</code>
                <span className="mx-1">→</span>
                <code className="bg-gray-100 px-1 rounded">{mergeRequest.target_branch}</code>
              </span>
            )}
          </div>
        </div>
        
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStateColor(mergeRequest.state)}`}>
          {getStateIcon(mergeRequest.state)} {mergeRequest.state}
        </span>
      </div>
      
      {mergeRequest.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {mergeRequest.description}
        </p>
      )}
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Created: {formatDate(mergeRequest.created_at)}</span>
        <span>Updated: {formatDate(mergeRequest.updated_at)}</span>
      </div>
      
      {mergeRequest.assignees && mergeRequest.assignees.length > 0 && (
        <div className="mt-2 flex items-center text-xs text-gray-600">
          <span className="mr-2">Assignees:</span>
          <div className="flex space-x-1">
            {mergeRequest.assignees.map((assignee) => (
              <span key={assignee.id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {assignee.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MergeRequestCard;
