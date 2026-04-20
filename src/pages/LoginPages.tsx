import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, Lock, LogIn, UserPlus } from 'lucide-react';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [error, setError] = useState('');
  const { login, registerCustomer } = useContext(AuthContext) as any;
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from location state, or default to appropriate page
  const from = location.state?.from?.pathname || null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const loggedInUser = login(email, password);
      if (loggedInUser) {
        handleRedirect(loggedInUser);
      } else {
        setError('Invalid email or password');
      }
    } else {
      if (!fullname || !email || !password) {
        setError('Please fill in all fields');
        return;
      }
      const registeredUser = registerCustomer({ fullname, email, password });
      handleRedirect(registeredUser);
    }
  };

  const handleRedirect = (user) => {
    if (from) {
      navigate(from);
    } else if (user.role === 'admin') {
      navigate('/dashboard');
    } else {
      navigate('/menu');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-gray-50/50">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md border overflow-hidden">
        <div className="flex border-b">
          <button 
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-4 font-bold text-sm uppercase tracking-widest transition-all ${isLogin ? 'text-primary bg-white' : 'text-gray-400 bg-gray-50 hover:bg-gray-100'}`}
          >
            Login
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-4 font-bold text-sm uppercase tracking-widest transition-all ${!isLogin ? 'text-primary bg-white' : 'text-gray-400 bg-gray-50 hover:bg-gray-100'}`}
          >
            Register
          </button>
        </div>

        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
              {isLogin ? <LogIn size={32} /> : <UserPlus size={32} />}
            </div>
            <h2 className="text-3xl font-bold text-dark tracking-tight">
              {isLogin ? 'Welcome Back' : 'Join Us'}
            </h2>
            <p className="text-gray-400 text-sm mt-2 text-center">
              {isLogin 
                ? 'Sign in to your account to continue your order' 
                : 'Create an account for a faster checkout experience'}
            </p>
          </div>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm font-medium border border-red-100 flex items-center gap-2"
            >
              <div className="w-1 h-1 bg-red-600 rounded-full animate-pulse"></div>
              {error}
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text" 
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-gray-50 border-none p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-gray-50 border-none p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">{isLogin ? 'Password' : 'Create Password'}</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border-none p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  required
                />
              </div>
            </div>
            
            <button type="submit" className="w-full bg-dark text-white py-4 rounded-2xl hover:bg-primary font-bold transition-all shadow-lg shadow-gray-200 mt-4 active:scale-95">
              {isLogin ? 'Sign In' : 'Register Now'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-dashed">
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em] mb-4 text-center">Initial Credentials</p>
            <div className="grid grid-cols-1 gap-2">
              <div className="bg-gray-50 p-3 rounded-xl flex items-center justify-between group hover:bg-gray-100 transition-colors">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Admin</span>
                <span className="text-[10px] font-mono text-gray-500 select-all">admin@store.com / admin123</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl flex items-center justify-between group hover:bg-gray-100 transition-colors">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Customer</span>
                <span className="text-[10px] font-mono text-gray-500 select-all">customer@store.com / customer123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;