import React, { createContext, useContext, useState } from 'react';

const RelationshipContext = createContext();

export const useRelationship = () => {
  const context = useContext(RelationshipContext);
  if (!context) {
    throw new Error('useRelationship must be used within a RelationshipProvider');
  }
  return context;
};

export const RelationshipProvider = ({ children }) => {
  const [relationship, setRelationship] = useState(null);
  const [loading, setLoading] = useState(false);

  const value = {
    relationship,
    setRelationship,
    loading,
    setLoading,
  };

  return (
    <RelationshipContext.Provider value={value}>
      {children}
    </RelationshipContext.Provider>
  );
};
