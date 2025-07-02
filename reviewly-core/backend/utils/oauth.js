import axios from 'axios';

// Linear OAuth utilities
export const getLinearAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: process.env.LINEAR_CLIENT_ID,
    redirect_uri: process.env.LINEAR_REDIRECT_URI,
    response_type: 'code',
    scope: 'read'
  });
  
  return `https://linear.app/oauth/authorize?${params.toString()}`;
};

export const exchangeLinearCode = async (code) => {
  try {
    const params = new URLSearchParams({
      client_id: process.env.LINEAR_CLIENT_ID,
      client_secret: process.env.LINEAR_CLIENT_SECRET,
      redirect_uri: process.env.LINEAR_REDIRECT_URI,
      code,
      grant_type: 'authorization_code'
    });

    const response = await axios.post('https://api.linear.app/oauth/token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Linear token exchange error:', error.response?.data || error.message);
    throw new Error('Failed to exchange Linear authorization code');
  }
};

// GitLab OAuth utilities
export const getGitLabAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: process.env.GITLAB_CLIENT_ID,
    redirect_uri: process.env.GITLAB_REDIRECT_URI,
    response_type: 'code',
    scope: 'read_user api'
  });
  
  return `https://gitlab.com/oauth/authorize?${params.toString()}`;
};

export const exchangeGitLabCode = async (code) => {
  try {
    const response = await axios.post('https://gitlab.com/oauth/token', {
      client_id: process.env.GITLAB_CLIENT_ID,
      client_secret: process.env.GITLAB_CLIENT_SECRET,
      redirect_uri: process.env.GITLAB_REDIRECT_URI,
      code,
      grant_type: 'authorization_code'
    });
    
    return response.data;
  } catch (error) {
    console.error('GitLab token exchange error:', error.response?.data || error.message);
    throw new Error('Failed to exchange GitLab authorization code');
  }
};

// Refresh token utilities
export const refreshLinearToken = async (refreshToken) => {
  try {
    const params = new URLSearchParams({
      client_id: process.env.LINEAR_CLIENT_ID,
      client_secret: process.env.LINEAR_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    });

    const response = await axios.post('https://api.linear.app/oauth/token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Linear token refresh error:', error.response?.data || error.message);
    throw new Error('Failed to refresh Linear token');
  }
};

export const refreshGitLabToken = async (refreshToken) => {
  try {
    const response = await axios.post('https://gitlab.com/oauth/token', {
      client_id: process.env.GITLAB_CLIENT_ID,
      client_secret: process.env.GITLAB_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    });
    
    return response.data;
  } catch (error) {
    console.error('GitLab token refresh error:', error.response?.data || error.message);
    throw new Error('Failed to refresh GitLab token');
  }
};
