import express from 'express';
import axios from 'axios';
import Token from '../models/Token.js';
import { refreshLinearToken, refreshGitLabToken } from '../utils/oauth.js';

const router = express.Router();

// Helper function to check and refresh token if needed
const ensureValidToken = async (tokenData, refreshFunction) => {
  if (!tokenData.expiresAt || new Date() >= tokenData.expiresAt) {
    if (tokenData.refreshToken) {
      const newTokenData = await refreshFunction(tokenData.refreshToken);
      return {
        accessToken: newTokenData.access_token,
        refreshToken: newTokenData.refresh_token || tokenData.refreshToken,
        expiresAt: new Date(Date.now() + newTokenData.expires_in * 1000),
        scope: newTokenData.scope || tokenData.scope
      };
    } else {
      throw new Error('Token expired and no refresh token available');
    }
  }
  return tokenData;
};

// Get Linear issues
router.get('/linear/issues', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const tokenDoc = await Token.findOne({ userId });
    
    if (!tokenDoc || !tokenDoc.linearToken) {
      return res.status(401).json({ error: 'Linear not connected' });
    }

    // Ensure token is valid
    const validToken = await ensureValidToken(tokenDoc.linearToken, refreshLinearToken);
    
    // Update token if it was refreshed
    if (validToken !== tokenDoc.linearToken) {
      tokenDoc.linearToken = validToken;
      await tokenDoc.save();
    }

    // Fetch issues from Linear
    const response = await axios.post('https://api.linear.app/graphql', {
      query: `
        query {
          issues(filter: { assignee: { isMe: { eq: true } } }) {
            nodes {
              id
              title
              description
              state {
                name
                color
              }
              priority
              createdAt
              updatedAt
              url
              team {
                name
                key
              }
              assignee {
                name
                email
              }
            }
          }
        }
      `
    }, {
      headers: {
        'Authorization': `Bearer ${validToken.accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    // Check for GraphQL errors
    if (response.data.errors) {
      console.error('Linear GraphQL errors:', response.data.errors);
      return res.status(400).json({
        error: 'Failed to fetch Linear issues',
        details: response.data.errors
      });
    }

    const issues = response.data.data.issues.nodes;
    res.json({ issues, user: tokenDoc.linearUser });
    
  } catch (error) {
    console.error('Linear API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch Linear issues' });
  }
});

// Get GitLab merge requests
router.get('/gitlab/merge-requests', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const tokenDoc = await Token.findOne({ userId });
    
    if (!tokenDoc || !tokenDoc.gitlabToken) {
      return res.status(401).json({ error: 'GitLab not connected' });
    }

    // Ensure token is valid
    const validToken = await ensureValidToken(tokenDoc.gitlabToken, refreshGitLabToken);
    
    // Update token if it was refreshed
    if (validToken !== tokenDoc.gitlabToken) {
      tokenDoc.gitlabToken = validToken;
      await tokenDoc.save();
    }

    // Fetch merge requests from GitLab
    const response = await axios.get(`https://gitlab.com/api/v4/merge_requests?author_username=${tokenDoc.gitlabUser.username}&state=opened`, {
      headers: {
        'Authorization': `Bearer ${validToken.accessToken}`
      }
    });

    const mergeRequests = response.data;
    res.json({ mergeRequests, user: tokenDoc.gitlabUser });
    
  } catch (error) {
    console.error('GitLab API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch GitLab merge requests' });
  }
});

// Get connection status
router.get('/status', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const tokenDoc = await Token.findOne({ userId });
    
    const status = {
      linear: {
        connected: !!(tokenDoc?.linearToken?.accessToken),
        user: tokenDoc?.linearUser || null
      },
      gitlab: {
        connected: !!(tokenDoc?.gitlabToken?.accessToken),
        user: tokenDoc?.gitlabUser || null
      }
    };

    res.json(status);
    
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({ error: 'Failed to check connection status' });
  }
});

export default router;
