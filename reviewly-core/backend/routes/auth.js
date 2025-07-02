import express from 'express';
import axios from 'axios';
import Token from '../models/Token.js';
import { 
  getLinearAuthUrl, 
  getGitLabAuthUrl, 
  exchangeLinearCode, 
  exchangeGitLabCode 
} from '../utils/oauth.js';

const router = express.Router();

// Get OAuth URLs
router.get('/linear/url', (req, res) => {
  try {
    const authUrl = getLinearAuthUrl();
    res.json({ authUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate Linear auth URL' });
  }
});

router.get('/gitlab/url', (req, res) => {
  try {
    const authUrl = getGitLabAuthUrl();
    res.json({ authUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate GitLab auth URL' });
  }
});

// Linear OAuth callback
router.get('/linear/callback', async (req, res) => {
  try {
    const { code, error } = req.query;
    
    if (error) {
      return res.redirect(`${process.env.FRONTEND_URL}?error=${encodeURIComponent(error)}`);
    }
    
    if (!code) {
      return res.redirect(`${process.env.FRONTEND_URL}?error=no_code`);
    }

    // Exchange code for token
    const tokenData = await exchangeLinearCode(code);
    
    // Get user info from Linear
    const userResponse = await axios.post('https://api.linear.app/graphql', {
      query: `
        query {
          viewer {
            id
            name
            email
          }
        }
      `
    }, {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json'
      }
    });

    const userData = userResponse.data.data.viewer;
    
    // Generate a simple user ID (in production, use proper session management)
    const userId = userData.id;
    
    // Save or update token
    await Token.findOneAndUpdate(
      { userId },
      {
        userId,
        linearToken: {
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
          expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
          scope: tokenData.scope
        },
        linearUser: {
          id: userData.id,
          name: userData.name,
          email: userData.email
        }
      },
      { upsert: true, new: true }
    );

    // Redirect to frontend with success
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?linear=success&userId=${userId}`);
    
  } catch (error) {
    console.error('Linear callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}?error=linear_auth_failed`);
  }
});

// GitLab OAuth callback
router.get('/gitlab/callback', async (req, res) => {
  try {
    const { code, error } = req.query;
    
    if (error) {
      return res.redirect(`${process.env.FRONTEND_URL}?error=${encodeURIComponent(error)}`);
    }
    
    if (!code) {
      return res.redirect(`${process.env.FRONTEND_URL}?error=no_code`);
    }

    // Exchange code for token
    const tokenData = await exchangeGitLabCode(code);
    
    // Get user info from GitLab
    const userResponse = await axios.get('https://gitlab.com/api/v4/user', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`
      }
    });

    const userData = userResponse.data;
    
    // Generate a simple user ID (in production, use proper session management)
    const userId = userData.id.toString();
    
    // Save or update token
    await Token.findOneAndUpdate(
      { userId },
      {
        userId,
        gitlabToken: {
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
          expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
          scope: tokenData.scope
        },
        gitlabUser: {
          id: userData.id,
          username: userData.username,
          name: userData.name,
          email: userData.email
        }
      },
      { upsert: true, new: true }
    );

    // Redirect to frontend with success
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?gitlab=success&userId=${userId}`);
    
  } catch (error) {
    console.error('GitLab callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}?error=gitlab_auth_failed`);
  }
});

export default router;
