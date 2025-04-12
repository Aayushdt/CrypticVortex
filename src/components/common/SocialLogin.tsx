import React from 'react';
import GoogleIcon from '../../assets/google.svg';
import AppleIcon from '../../assets/apple.svg';

interface SocialLoginProps {
  type: 'login' | 'signup';
}

const SocialLogin: React.FC<SocialLoginProps> = ({ type }) => {
  return (
    <>
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">
            Or {type} with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          className="flex items-center justify-center gap-2 bg-gray-50 text-gray-700 rounded-lg p-3 hover:bg-gray-100 transition-colors border border-gray-200"
        >
          <img src={GoogleIcon} alt="Google" className="w-5 h-5" />
          Google
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 bg-gray-50 text-gray-700 rounded-lg p-3 hover:bg-gray-100 transition-colors border border-gray-200"
        >
          <img src={AppleIcon} alt="Apple" className="w-5 h-5" />
          Apple
        </button>
      </div>
    </>
  );
};

export default SocialLogin; 