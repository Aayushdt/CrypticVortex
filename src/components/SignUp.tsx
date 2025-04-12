import React, { useState } from 'react';

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    agreeToTerms: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="flex">
      {/* Left side with background image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-purple-900">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 to-purple-900/30">
          <img
            src="/desert-night.jpg"
            alt="Desert at night"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 p-12 flex flex-col justify-between min-h-[600px]">
          <div>
            <h1 className="text-2xl font-bold text-white">AMU</h1>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white">
              Capturing Moments,<br />
              Creating Memories
            </h2>
            <div className="flex gap-2 mt-4">
              <div className="w-8 h-2 bg-gray-500 rounded"></div>
              <div className="w-8 h-2 bg-gray-500 rounded"></div>
              <div className="w-8 h-2 bg-white rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side with form */}
      <div className="flex-1 p-8 lg:p-12">
        <div className="max-w-md mx-auto">
          <div className="flex justify-end mb-8">
            <a href="#" className="text-white bg-purple-700/20 px-4 py-2 rounded-full hover:bg-purple-700/30 transition-colors">
              Back to website
            </a>
          </div>

          <h2 className="text-4xl font-bold text-white mb-4">Create an account</h2>
          <p className="text-gray-400 mb-8">
            Already have an account?{' '}
            <a href="#" className="text-purple-400 hover:text-purple-300">
              Log in
            </a>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                className="bg-gray-900 text-white rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={formData.firstName}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                className="bg-gray-900 text-white rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="bg-gray-900 text-white rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData.email}
              onChange={handleInputChange}
            />

            <div className="relative">
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="bg-gray-900 text-white rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={formData.password}
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
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
              </button>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="agreeToTerms"
                id="agreeToTerms"
                className="rounded bg-gray-900 border-gray-700 text-purple-500 focus:ring-purple-500"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
              />
              <label htmlFor="agreeToTerms" className="ml-2 text-gray-400">
                I agree to the{' '}
                <a href="#" className="text-purple-400 hover:text-purple-300">
                  Terms & Conditions
                </a>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white rounded-lg p-3 font-medium hover:bg-purple-500 transition-colors"
            >
              Create account
            </button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">Or register with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center gap-2 bg-gray-900 text-white rounded-lg p-3 hover:bg-gray-700 transition-colors"
              >
                <img src="/google.svg" alt="Google" className="w-5 h-5" />
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 bg-gray-900 text-white rounded-lg p-3 hover:bg-gray-700 transition-colors"
              >
                <img src="/apple.svg" alt="Apple" className="w-5 h-5" />
                Apple
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp; 