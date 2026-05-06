import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { LogIn, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      toast.success('Welcome back!');
      navigate('/');
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  // Quick fill demo credentials
  const fillAdmin = () => {
    setEmail('admin@shopease.com');
    setPassword('admin123');
  };

  const fillUser = () => {
    setEmail('john@test.com');
    setPassword('john123');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-100 p-8 sm:p-10">
        <div className="flex justify-center mb-6">
          <div className="bg-indigo-100 p-3 rounded-xl">
            <LogIn className="h-7 w-7 text-indigo-600" />
          </div>
        </div>

        <h2 className="text-2xl font-extrabold text-center text-gray-900 mb-1">Welcome Back</h2>
        <p className="text-center text-gray-400 mb-8">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p className="text-xs font-bold text-gray-500 uppercase mb-2">Demo Accounts</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={fillAdmin}
              className="flex-1 text-xs bg-indigo-50 text-indigo-600 font-medium py-2 px-3 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              Admin Login
            </button>
            <button
              type="button"
              onClick={fillUser}
              className="flex-1 text-xs bg-gray-100 text-gray-600 font-medium py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              User Login
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-gray-500 text-sm">
          Don't have an account? <Link to="/register" className="text-indigo-600 font-bold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
