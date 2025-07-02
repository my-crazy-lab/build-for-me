const ConnectionCard = ({ title, description, icon, connected, user, onConnect, color }) => {
  const colorClasses = {
    blue: {
      border: 'border-blue-200',
      bg: 'bg-blue-50',
      button: 'bg-blue-600 hover:bg-blue-700',
      text: 'text-blue-600',
      badge: 'bg-blue-100 text-blue-800'
    },
    orange: {
      border: 'border-orange-200',
      bg: 'bg-orange-50',
      button: 'bg-orange-600 hover:bg-orange-700',
      text: 'text-orange-600',
      badge: 'bg-orange-100 text-orange-800'
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`bg-white rounded-lg shadow-lg border-2 ${colors.border} p-6 transition-all hover:shadow-xl`}>
      <div className="text-center">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>
        
        {connected ? (
          <div className="space-y-4">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors.badge}`}>
              ✅ Connected
            </div>
            
            {user && (
              <div className="text-sm text-gray-600">
                <p className="font-medium">{user.name || user.username}</p>
                {user.email && <p>{user.email}</p>}
              </div>
            )}
            
            <button
              onClick={onConnect}
              className={`w-full px-4 py-2 text-white font-medium rounded-md ${colors.button} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
            >
              Reconnect
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
              ❌ Not Connected
            </div>
            
            <button
              onClick={onConnect}
              className={`w-full px-4 py-2 text-white font-medium rounded-md ${colors.button} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
            >
              Connect to {title}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionCard;
