/**
 * Love Journey - Register Page
 * 
 * Beautiful registration page for couples to start their love journey
 * with comprehensive form validation and romantic design.
 * 
 * Created: 2025-06-25
 * Version: 1.0.0
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Mail, Lock, Eye, EyeOff, User, Calendar, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [step, setStep] = useState(1); // 1: Personal Info, 2: Relationship Info, 3: Account Setup
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    
    // Relationship Info
    partnerEmail: '',
    relationshipStartDate: '',
    coupleName: '',
    
    // Account Setup
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};

    if (stepNumber === 1) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    }

    if (stepNumber === 2) {
      if (!formData.partnerEmail) {
        newErrors.partnerEmail = 'Partner email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.partnerEmail)) {
        newErrors.partnerEmail = 'Please enter a valid email address';
      } else if (formData.partnerEmail === formData.email) {
        newErrors.partnerEmail = 'Partner email must be different from your email';
      }
      if (!formData.relationshipStartDate) newErrors.relationshipStartDate = 'Relationship start date is required';
      if (!formData.coupleName) newErrors.coupleName = 'Couple name is required';
    }

    if (stepNumber === 3) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) return;

    setLoading(true);
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (error) {
      setErrors({
        submit: error.message || 'Registration failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-neutral-50 to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        {/* Logo and Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-2xl mb-4">
            <Heart className="w-8 h-8 text-white fill-current" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Start Your Journey
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create your love story together
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  stepNumber <= step 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    stepNumber < step 
                      ? 'bg-primary-500' 
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span>Personal</span>
            <span>Relationship</span>
            <span>Account</span>
          </div>
        </motion.div>

        {/* Registration Form */}
        <motion.div variants={itemVariants}>
          <Card variant="glass" className="backdrop-blur-md">
            <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
              <motion.div
                key={step}
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                {/* Step 1: Personal Information */}
                {step === 1 && (
                  <>
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Tell us about yourself
                      </h2>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        error={errors.firstName}
                        placeholder="Your first name"
                      />
                      <Input
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        error={errors.lastName}
                        placeholder="Your last name"
                      />
                    </div>

                    <Input
                      label="Email Address"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                      leftIcon={<Mail className="w-4 h-4" />}
                      placeholder="your.email@example.com"
                    />

                    <Input
                      label="Date of Birth"
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      error={errors.dateOfBirth}
                      leftIcon={<Calendar className="w-4 h-4" />}
                    />
                  </>
                )}

                {/* Step 2: Relationship Information */}
                {step === 2 && (
                  <>
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        About your relationship
                      </h2>
                    </div>

                    <Input
                      label="Partner's Email"
                      type="email"
                      name="partnerEmail"
                      value={formData.partnerEmail}
                      onChange={handleChange}
                      error={errors.partnerEmail}
                      leftIcon={<Mail className="w-4 h-4" />}
                      placeholder="partner@example.com"
                      helperText="We'll send them an invitation to join"
                    />

                    <Input
                      label="When did you start dating?"
                      type="date"
                      name="relationshipStartDate"
                      value={formData.relationshipStartDate}
                      onChange={handleChange}
                      error={errors.relationshipStartDate}
                      leftIcon={<Heart className="w-4 h-4" />}
                    />

                    <Input
                      label="Couple Name"
                      name="coupleName"
                      value={formData.coupleName}
                      onChange={handleChange}
                      error={errors.coupleName}
                      leftIcon={<User className="w-4 h-4" />}
                      placeholder="e.g., Sarah & John"
                      helperText="How would you like to be known as a couple?"
                    />
                  </>
                )}

                {/* Step 3: Account Setup */}
                {step === 3 && (
                  <>
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Secure your account
                      </h2>
                    </div>

                    <Input
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      error={errors.password}
                      leftIcon={<Lock className="w-4 h-4" />}
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      }
                      placeholder="Create a strong password"
                      helperText="At least 8 characters with uppercase, lowercase, and number"
                    />

                    <Input
                      label="Confirm Password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      error={errors.confirmPassword}
                      leftIcon={<Lock className="w-4 h-4" />}
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      }
                      placeholder="Confirm your password"
                    />

                    {/* Submit Error */}
                    {errors.submit && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg"
                      >
                        <p className="text-sm text-error-600 dark:text-error-400">
                          {errors.submit}
                        </p>
                      </motion.div>
                    )}
                  </>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between space-x-4">
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleBack}
                      disabled={loading}
                    >
                      Back
                    </Button>
                  )}
                  
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth={step === 1}
                    loading={step === 3 && loading}
                    disabled={loading}
                    rightIcon={!loading && <ArrowRight className="w-4 h-4" />}
                  >
                    {step === 3 ? (loading ? 'Creating Account...' : 'Create Account') : 'Continue'}
                  </Button>
                </div>
              </motion.div>
            </form>
          </Card>
        </motion.div>

        {/* Sign In Link */}
        <motion.div variants={itemVariants} className="text-center mt-6">
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
