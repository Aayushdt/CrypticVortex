import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { AUTH_ENDPOINTS } from '../config/constants';
import { setToken } from '../utils/auth';
import AuthLayout from './layouts/AuthLayout';
import FormInput from './common/FormInput';
import SocialLogin from './common/SocialLogin';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(AUTH_ENDPOINTS.SIGNUP, formData);
      setToken(response.data.token);
      toast.success('Sign up successful!');
      navigate('/welcome');
    } catch (error) {
      toast.error('Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const eyeIcon = (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );

  return (
    <AuthLayout
      title="Split Expenses"
      subtitle="Easily"
      currentStep={3}
    >
      <div className="flex justify-end mb-8">
        <a href="#" className="text-gray-600 bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200 transition-colors">
          Back to website
        </a>
      </div>

      <h2 className="text-4xl font-bold text-gray-900 mb-4">Create Account</h2>
      <p className="text-gray-600 mb-8">
        Already have an account?{' '}
        <a href="/login" className="text-emerald-600 hover:text-emerald-500">
          Sign in
        </a>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <FormInput
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <FormInput
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <FormInput
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
          icon={eyeIcon}
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-emerald-500 text-white rounded-lg p-3 font-medium hover:bg-emerald-600 transition-colors ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        <SocialLogin type="signup" />
      </form>
    </AuthLayout>
  );
};

export default SignUp; 