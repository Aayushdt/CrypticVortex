import React, { useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { AUTH_ENDPOINTS } from '../config/constants';
import { setToken } from '../utils/auth';
import AuthLayout from './layouts/AuthLayout';
import FormInput from './common/FormInput';
import SocialLogin from './common/SocialLogin';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await axios.post(AUTH_ENDPOINTS.LOGIN, formData);

      if (response.data.status === 'success') {
        toast.success('Login successful!');
        setToken(response.data.token);
        window.location.href = '/webpage/index1.html';
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
    <>
      <Toaster position="top-right" />
      <AuthLayout
        title="Welcome Back,"
        subtitle="Sign In to Continue"
        currentStep={2}
      >
        <div className="flex justify-end mb-8">
          <a href="#" className="text-gray-600 bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200 transition-colors">
            Back to website
          </a>
        </div>

        <h2 className="text-4xl font-bold text-gray-900 mb-4">Sign In</h2>
        <p className="text-gray-600 mb-8">
          Don't have an account?{' '}
          <a href="/signup" className="text-emerald-600 hover:text-emerald-500">
            Sign up
          </a>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <FormInput
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            required
            icon={eyeIcon}
          />

          <div className="flex justify-end">
            <a href="#" className="text-sm text-emerald-600 hover:text-emerald-500">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-emerald-500 text-white rounded-lg p-3 font-medium hover:bg-emerald-600 transition-colors ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <SocialLogin type="login" />
        </form>
      </AuthLayout>
    </>
  );
};

export default Login; 