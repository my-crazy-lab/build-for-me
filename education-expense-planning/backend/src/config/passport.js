/**
 * Passport.js configuration for authentication
 * 
 * This module configures Passport.js strategies for:
 * - Google OAuth 2.0 authentication
 * - JWT token authentication
 * - Demo mode authentication
 * 
 * @author Education Expense Dashboard Team
 * @version 1.0.0
 * @created 2025-06-25
 */

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/User.js';
import { logger } from '../utils/logger.js';

/**
 * Setup Passport.js strategies
 */
export const setupPassport = () => {
  // Serialize user for session
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      logger.logError('User deserialization failed', error, { userId: id });
      done(error, null);
    }
  });

  // Google OAuth Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
      scope: ['profile', 'email']
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        logger.logSecurity('google_oauth_attempt', {
          googleId: profile.id,
          email: profile.emails?.[0]?.value
        });

        // Check if user already exists with this Google ID
        let user = await User.findByGoogleId(profile.id);

        if (user) {
          // Update last login
          await user.updateLastLogin();
          
          logger.logSecurity('google_oauth_success_existing', {
            userId: user._id,
            email: user.email
          });
          
          return done(null, user);
        }

        // Check if user exists with the same email
        const email = profile.emails?.[0]?.value;
        if (email) {
          user = await User.findByEmail(email);
          
          if (user) {
            // Link Google account to existing user
            user.googleId = profile.id;
            user.isEmailVerified = true;
            
            // Update profile info if not set
            if (!user.avatar && profile.photos?.[0]?.value) {
              user.avatar = profile.photos[0].value;
            }
            
            await user.save();
            await user.updateLastLogin();
            
            logger.logSecurity('google_oauth_linked_existing', {
              userId: user._id,
              email: user.email,
              googleId: profile.id
            });
            
            return done(null, user);
          }
        }

        // Create new user
        if (!email) {
          return done(new Error('No email provided by Google'), null);
        }

        user = await User.create({
          googleId: profile.id,
          email: email,
          name: profile.displayName || profile.name?.givenName || 'Google User',
          avatar: profile.photos?.[0]?.value || null,
          isEmailVerified: true,
          theme: 'system'
        });

        await user.updateLastLogin();

        logger.logSecurity('google_oauth_new_user', {
          userId: user._id,
          email: user.email,
          googleId: profile.id
        });

        return done(null, user);

      } catch (error) {
        logger.logError('Google OAuth strategy error', error, {
          googleId: profile.id,
          email: profile.emails?.[0]?.value
        });
        return done(error, null);
      }
    }));
  } else {
    logger.warn('Google OAuth not configured - missing client ID or secret');
  }

  // JWT Strategy
  passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
    algorithms: ['HS256']
  }, async (payload, done) => {
    try {
      // Find user by ID from JWT payload
      const user = await User.findById(payload.userId);

      if (!user) {
        logger.logSecurity('jwt_auth_failed_user_not_found', {
          userId: payload.userId,
          tokenIat: payload.iat,
          tokenExp: payload.exp
        });
        return done(null, false);
      }

      if (!user.isActive) {
        logger.logSecurity('jwt_auth_failed_user_inactive', {
          userId: user._id,
          email: user.email
        });
        return done(null, false);
      }

      // Check if token was issued before user's last password change
      // (This would be implemented if we track password change timestamps)
      
      logger.logSecurity('jwt_auth_success', {
        userId: user._id,
        email: user.email,
        tokenIat: payload.iat
      });

      return done(null, user);

    } catch (error) {
      logger.logError('JWT strategy error', error, {
        userId: payload.userId,
        tokenIat: payload.iat
      });
      return done(error, false);
    }
  }));
};

/**
 * Middleware to authenticate with JWT
 */
export const authenticateJWT = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      logger.logError('JWT authentication error', err, {
        url: req.originalUrl,
        method: req.method,
        ip: req.ip
      });
      return next(err);
    }

    if (!user) {
      logger.logSecurity('jwt_auth_failed', {
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        authHeader: req.get('Authorization') ? 'present' : 'missing'
      });

      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      });
    }

    req.user = user;
    next();
  })(req, res, next);
};

/**
 * Middleware to authenticate with Google OAuth
 */
export const authenticateGoogle = passport.authenticate('google', {
  scope: ['profile', 'email']
});

/**
 * Middleware to handle Google OAuth callback
 */
export const authenticateGoogleCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err) {
      logger.logError('Google OAuth callback error', err, {
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      
      // Redirect to frontend with error
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/auth/error?message=oauth_error`);
    }

    if (!user) {
      logger.logSecurity('google_oauth_callback_failed', {
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      
      // Redirect to frontend with error
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/auth/error?message=oauth_failed`);
    }

    req.user = user;
    next();
  })(req, res, next);
};

/**
 * Optional middleware to check if user is demo account
 */
export const checkDemoAccount = (req, res, next) => {
  if (req.user && req.user.isDemoAccount) {
    // Add demo flag to request for potential restrictions
    req.isDemoUser = true;
  }
  next();
};

/**
 * Middleware to require authentication (with better error messages)
 */
export const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'AUTHENTICATION_REQUIRED',
        message: 'You must be logged in to access this resource'
      }
    });
  }
  next();
};

/**
 * Middleware to require non-demo account for certain operations
 */
export const requireNonDemo = (req, res, next) => {
  if (req.user && req.user.isDemoAccount) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'DEMO_ACCOUNT_RESTRICTION',
        message: 'This operation is not available for demo accounts'
      }
    });
  }
  next();
};
