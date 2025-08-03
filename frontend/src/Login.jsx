import React, { useState, useEffect } from 'react';
import Router_admin from './Router/Router_admin';
import Router_user1 from './Router/Router_user1';
import Router_user2 from './Router/Router_user2';
import Router_user3 from './Router/Router_user3';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');

    if (savedUser && savedToken) {
      axios
        .post('http://localhost:3000/api/verify-token', { token: savedToken })
        .then((res) => {
          if (res.data.valid) {
            setUser(JSON.parse(savedUser));
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('ກະລຸນາປ້ອນ username და password');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3000/api/login', {
        username,
        password,
      });

      setUser(res.data.user);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // ✅ บันทึกประวัติการ login
      const now = new Date().toLocaleString();
      const oldHistory = JSON.parse(localStorage.getItem('loginHistory')) || [];
      const newHistory = [...oldHistory, { username: res.data.user.username, time: now }];
      localStorage.setItem('loginHistory', JSON.stringify(newHistory));
    } catch (err) {
      setError(err.response?.data?.message || 'ເກີດຂໍ້ຜິດພາດ');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUsername('');
    setPassword('');
    setError('');
  };

  // Cute Walking Character Component
  const WalkingCharacter = ({ delay = 0 }) => (
    <div
      className="absolute animate-bounce"
      style={{
        animation: `walk 8s infinite linear ${delay}s, bounce 2s infinite ease-in-out ${delay}s`,
        animationDelay: `${delay}s`
      }}
    >
    </div>
  );

  // Floating Elements
  const FloatingElement = ({ emoji, delay = 0, duration = 6 }) => (
    <div
      className="absolute opacity-30 animate-ping"
      style={{
        animation: `float ${duration}s infinite ease-in-out ${delay}s`,
        animationDelay: `${delay}s`
      }}
    >
      <span className="text-xl">{emoji}</span>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 animate-bounce">⭐</div>
          <div className="absolute top-20 right-20 animate-pulse">✨</div>
          <div className="absolute bottom-20 left-20 animate-spin">🌟</div>
          <div className="absolute bottom-10 right-10 animate-bounce">💫</div>
        </div>

        {/* Loading Card */}
        <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl p-12 text-center animate-pulse border-4 border-yellow-300">
          <div className="flex justify-center mb-4">
            <div className="animate-spin text-4xl">🔄</div>
          </div>
          <p className="text-gray-700 text-2xl font-bold animate-bounce">ກຳລັງໂຫຼດ...</p>
          <div className="mt-4 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (user) {
    if (user.status === 'Admin') return <Router_admin onLogout={handleLogout} />;
    if (user.status === 'User1') return <Router_user1 onLogout={handleLogout} />;
    if (user.status === 'User2') return <Router_user2 onLogout={handleLogout} />;
    if (user.status === 'User3') return <Router_user3 onLogout={handleLogout} />;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-500 relative overflow-hidden">
        <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl p-8 text-center border-4 border-rainbow">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 animate-bounce">
            ຍິນດີຕ້ອນຮັບ {user.username} 🎉
          </h2>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Logout 👋
          </button>
          <p className="mt-4 text-red-500 font-semibold animate-pulse">ສະຖານະທີ່ບໍ່ຮູ້ຈັກ ❓</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-pink-300 to-purple-400 animate-pulse"></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-blue-300 via-green-300 to-yellow-300 opacity-70 animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Walking Characters */}
      <div className="absolute top-1/4 left-0 w-full h-16">
        <WalkingCharacter delay={0} />
        <WalkingCharacter delay={2} />
        <WalkingCharacter delay={4} />
      </div>

      {/* Floating Elements */}
      <FloatingElement emoji="🌈" delay={0} />
      <FloatingElement emoji="☁️" delay={1} />
      <FloatingElement emoji="🦋" delay={2} />
      <FloatingElement emoji="🌸" delay={3} />
      <FloatingElement emoji="⭐" delay={4} />

      {/* Login Form */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md mx-4 sm:mx-auto bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl px-4 py-6 sm:p-8 border-4 border-white/50 transform hover:scale-105 transition-all duration-300"
        style={{
          animation: 'float 6s ease-in-out infinite'
        }}
      >
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="text-5xl sm:text-6xl mb-3 sm:mb-4 animate-bounce">🔐</div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-yellow-500 to-pink-500 bg-clip-text text-transparent py-2 sm:py-3">
            ເຂົ້າລະບົບ
          </h2>
          <div className="flex justify-center mt-2 space-x-1 sm:space-x-2">
            <span className="animate-bounce text-lg sm:text-xl" style={{ animationDelay: '0s' }}>✨</span>
            <span className="animate-bounce text-lg sm:text-xl" style={{ animationDelay: '0.2s' }}>🌟</span>
            <span className="animate-bounce text-lg sm:text-xl" style={{ animationDelay: '0.1s' }}>✨</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 sm:p-4 bg-red-100 border-2 border-red-300 rounded-2xl animate-shake">
            <p className="text-red-600 text-center text-sm sm:text-base font-semibold flex items-center justify-center">
              <span className="mr-2">⚠️</span>{error}
            </p>
          </div>
        )}

        {/* Username */}
        <div className="mb-5 sm:mb-6">
          <label className="block mb-1 sm:mb-2 text-sm sm:text-base font-bold text-gray-700 flex items-center">
            <span className="mr-2">👤</span>ຊື່ຜູ້ໃຊ້
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-yellow-300 focus:border-yellow-500 transition-all duration-300 bg-white/80 text-sm sm:text-base"
            placeholder="ປ້ອນຊື່ຜູ້ໃຊ້..."
          />
        </div>

        {/* Password */}
        <div className="mb-6 sm:mb-8">
          <label className="block mb-1 sm:mb-2 text-sm sm:text-base font-bold text-gray-700 flex items-center">
            <span className="mr-2">🔒</span>ລະຫັດຜ່ານ
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-yellow-300 focus:border-yellow-500 transition-all duration-300 bg-white/80 text-sm sm:text-base"
            placeholder="ປ້ອນລະຫັດຜ່ານ..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-3 sm:py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center text-sm sm:text-base"
        >
          <span className="mr-2">🚀</span>ເຂົ້າລະບົບ<span className="ml-2">✨</span>
        </button>

        {/* Decorations */}
        <div className="flex justify-center mt-5 sm:mt-6 space-x-3 sm:space-x-4 text-xl sm:text-2xl">
          <div className="animate-spin-slow"></div>
          <div className="animate-pulse"></div>
          <div className="animate-spin-slow"></div>
        </div>
      </form>


      {/* CSS Animations */}
      <style jsx>{`   
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-20px); }
          75% { transform: translateX(3px); }
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}