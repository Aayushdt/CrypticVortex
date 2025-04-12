import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { AUTH_ENDPOINTS } from '../config/constants';
import { getToken, removeToken } from '../utils/auth';

const Welcome: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch user data
    const fetchUserData = async () => {
      try {
        const response = await axios.get(AUTH_ENDPOINTS.ME, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.status === 'success') {
          setUser(response.data.data.user);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user data');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-900 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-[800px] bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 shadow-xl p-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Evenly</h1>
            <p className="text-xl text-gray-600 mb-8">
              Hello, {user?.firstName} {user?.lastName}!
            </p>
            <div className="bg-emerald-50 p-6 rounded-lg mb-8">
              <p className="text-gray-700">
                You have successfully logged in to your account.
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-emerald-500 text-white rounded-lg px-6 py-3 font-medium hover:bg-emerald-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Welcome; 