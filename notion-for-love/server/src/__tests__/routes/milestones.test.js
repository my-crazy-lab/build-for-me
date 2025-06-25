/**
 * Love Journey - Milestones API Tests
 * 
 * Comprehensive test suite for milestone API endpoints
 * including CRUD operations, validation, and error handling.
 * 
 * Created: 2025-06-25
 * Version: 1.0.0
 */

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const User = require('../../models/User');
const Milestone = require('../../models/Milestone');
const { generateToken } = require('../../utils/auth');

// Test database setup
const MONGODB_URI = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/love-journey-test';

describe('Milestones API', () => {
  let authToken;
  let userId;
  let partnerId;
  let relationshipId;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(MONGODB_URI);
    
    // Create test users
    const user = await User.create({
      name: 'John Doe',
      email: 'john@test.com',
      password: 'password123',
      isVerified: true
    });

    const partner = await User.create({
      name: 'Jane Doe',
      email: 'jane@test.com',
      password: 'password123',
      isVerified: true
    });

    userId = user._id;
    partnerId = partner._id;
    relationshipId = new mongoose.Types.ObjectId();

    // Link users in relationship
    await User.findByIdAndUpdate(userId, {
      partner: partnerId,
      relationshipId,
      relationshipStatus: 'active'
    });

    await User.findByIdAndUpdate(partnerId, {
      partner: userId,
      relationshipId,
      relationshipStatus: 'active'
    });

    // Generate auth token
    authToken = generateToken(userId);
  });

  afterAll(async () => {
    // Clean up test data
    await User.deleteMany({});
    await Milestone.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear milestones before each test
    await Milestone.deleteMany({});
  });

  describe('GET /api/milestones', () => {
    test('should get all milestones for authenticated user', async () => {
      // Create test milestones
      await Milestone.create([
        {
          title: 'First Date',
          description: 'Our magical first date',
          date: new Date('2023-01-01'),
          category: 'romantic',
          relationshipId,
          createdBy: userId
        },
        {
          title: 'First Kiss',
          description: 'Our first kiss under the stars',
          date: new Date('2023-01-15'),
          category: 'romantic',
          relationshipId,
          createdBy: partnerId
        }
      ]);

      const response = await request(app)
        .get('/api/milestones')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].title).toBe('First Kiss'); // Should be sorted by date desc
      expect(response.body.data[1].title).toBe('First Date');
    });

    test('should filter milestones by category', async () => {
      await Milestone.create([
        {
          title: 'First Date',
          category: 'romantic',
          date: new Date('2023-01-01'),
          relationshipId,
          createdBy: userId
        },
        {
          title: 'Graduation',
          category: 'achievement',
          date: new Date('2023-06-01'),
          relationshipId,
          createdBy: userId
        }
      ]);

      const response = await request(app)
        .get('/api/milestones?category=romantic')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].category).toBe('romantic');
    });

    test('should paginate results', async () => {
      // Create 15 milestones
      const milestones = Array.from({ length: 15 }, (_, i) => ({
        title: `Milestone ${i + 1}`,
        date: new Date(`2023-01-${String(i + 1).padStart(2, '0')}`),
        category: 'romantic',
        relationshipId,
        createdBy: userId
      }));

      await Milestone.create(milestones);

      const response = await request(app)
        .get('/api/milestones?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).toHaveLength(10);
      expect(response.body.pagination.total).toBe(15);
      expect(response.body.pagination.pages).toBe(2);
    });

    test('should return 401 for unauthenticated requests', async () => {
      await request(app)
        .get('/api/milestones')
        .expect(401);
    });
  });

  describe('POST /api/milestones', () => {
    test('should create a new milestone', async () => {
      const milestoneData = {
        title: 'First Date',
        description: 'Our magical first date at the Italian restaurant',
        date: '2023-01-01T19:00:00Z',
        category: 'romantic',
        emotions: ['happy', 'excited', 'nervous'],
        location: 'Bella Vista Restaurant',
        isPrivate: false
      };

      const response = await request(app)
        .post('/api/milestones')
        .set('Authorization', `Bearer ${authToken}`)
        .send(milestoneData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(milestoneData.title);
      expect(response.body.data.description).toBe(milestoneData.description);
      expect(response.body.data.category).toBe(milestoneData.category);
      expect(response.body.data.createdBy).toBe(userId.toString());
      expect(response.body.data.relationshipId).toBe(relationshipId.toString());
    });

    test('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/milestones')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('validation');
    });

    test('should validate date format', async () => {
      const response = await request(app)
        .post('/api/milestones')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Milestone',
          date: 'invalid-date',
          category: 'romantic'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    test('should validate category enum', async () => {
      const response = await request(app)
        .post('/api/milestones')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Milestone',
          date: '2023-01-01',
          category: 'invalid-category'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/milestones/:id', () => {
    test('should update milestone by creator', async () => {
      const milestone = await Milestone.create({
        title: 'Original Title',
        date: new Date('2023-01-01'),
        category: 'romantic',
        relationshipId,
        createdBy: userId
      });

      const updateData = {
        title: 'Updated Title',
        description: 'Updated description'
      };

      const response = await request(app)
        .put(`/api/milestones/${milestone._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.description).toBe(updateData.description);
    });

    test('should allow partner to update milestone', async () => {
      const milestone = await Milestone.create({
        title: 'Original Title',
        date: new Date('2023-01-01'),
        category: 'romantic',
        relationshipId,
        createdBy: partnerId
      });

      const updateData = { title: 'Updated by Partner' };

      const response = await request(app)
        .put(`/api/milestones/${milestone._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.data.title).toBe(updateData.title);
    });

    test('should return 404 for non-existent milestone', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      await request(app)
        .put(`/api/milestones/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated' })
        .expect(404);
    });

    test('should return 403 for unauthorized update', async () => {
      // Create milestone for different relationship
      const otherRelationshipId = new mongoose.Types.ObjectId();
      const milestone = await Milestone.create({
        title: 'Other Milestone',
        date: new Date('2023-01-01'),
        category: 'romantic',
        relationshipId: otherRelationshipId,
        createdBy: new mongoose.Types.ObjectId()
      });

      await request(app)
        .put(`/api/milestones/${milestone._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Hacked' })
        .expect(403);
    });
  });

  describe('DELETE /api/milestones/:id', () => {
    test('should delete milestone by creator', async () => {
      const milestone = await Milestone.create({
        title: 'To Delete',
        date: new Date('2023-01-01'),
        category: 'romantic',
        relationshipId,
        createdBy: userId
      });

      await request(app)
        .delete(`/api/milestones/${milestone._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const deletedMilestone = await Milestone.findById(milestone._id);
      expect(deletedMilestone).toBeNull();
    });

    test('should return 404 for non-existent milestone', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      await request(app)
        .delete(`/api/milestones/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    test('should return 403 for unauthorized deletion', async () => {
      const otherRelationshipId = new mongoose.Types.ObjectId();
      const milestone = await Milestone.create({
        title: 'Protected Milestone',
        date: new Date('2023-01-01'),
        category: 'romantic',
        relationshipId: otherRelationshipId,
        createdBy: new mongoose.Types.ObjectId()
      });

      await request(app)
        .delete(`/api/milestones/${milestone._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(403);
    });
  });

  describe('GET /api/milestones/stats', () => {
    test('should return milestone statistics', async () => {
      await Milestone.create([
        {
          title: 'Romantic 1',
          category: 'romantic',
          date: new Date('2023-01-01'),
          relationshipId,
          createdBy: userId
        },
        {
          title: 'Romantic 2',
          category: 'romantic',
          date: new Date('2023-02-01'),
          relationshipId,
          createdBy: userId
        },
        {
          title: 'Achievement 1',
          category: 'achievement',
          date: new Date('2023-03-01'),
          relationshipId,
          createdBy: userId
        }
      ]);

      const response = await request(app)
        .get('/api/milestones/stats')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.total).toBe(3);
      expect(response.body.data.byCategory.romantic).toBe(2);
      expect(response.body.data.byCategory.achievement).toBe(1);
    });
  });

  describe('Error Handling', () => {
    test('should handle database connection errors', async () => {
      // Temporarily close database connection
      await mongoose.connection.close();

      const response = await request(app)
        .get('/api/milestones')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('database');

      // Reconnect for other tests
      await mongoose.connect(MONGODB_URI);
    });

    test('should handle invalid ObjectId format', async () => {
      await request(app)
        .get('/api/milestones/invalid-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);
    });
  });
});
