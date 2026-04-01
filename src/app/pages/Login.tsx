import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, User } from 'lucide-react';
import { toast } from 'sonner';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(formData.email, formData.password);

      if (success) {
        toast.success('¡Bienvenido!');
        navigate('/');
      } else {
        toast.error('Email o contraseña incorrectos');
      }
    } catch (error) {
      toast.error('Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (role: 'admin' | 'cliente') => {
    if (role === 'admin') {
      setFormData({
        email: 'admin@sushimaster.cl',
        password: 'admin123',
      });
    } else {
      setFormData({
        email: 'cliente@ejemplo.cl',
        password: 'cliente123',
      });
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-br from-red-50 to-neutral-50">
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center gap-2 mb-4">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white text-3xl">🍣</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-neutral-900 mb-2">Sushi Master</h1>
            <p className="text-neutral-600">Inicia sesión en tu cuenta</p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  <Mail size={16} className="inline mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-red-600 transition-colors"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  <Lock size={16} className="inline mr-1" />
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-red-600 transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 text-white py-3 rounded-full hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogIn size={20} />
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 pt-6 border-t border-neutral-200">
              <p className="text-sm text-neutral-600 mb-3 text-center">
                Credenciales de prueba:
              </p>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('admin')}
                  className="w-full px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors text-sm"
                >
                  admin@sushimaster.cl / admin123
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('cliente')}
                  className="w-full px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors text-sm"
                >
                  cliente@ejemplo.cl / cliente123
                </button>
              </div>
            </div>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-neutral-600">
                ¿No tienes cuenta?{' '}
                <Link
                  to="/register"
                  className="text-red-600 hover:text-red-700 font-semibold"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>

            {/* Back to Home */}
            <div className="mt-4 text-center">
              <Link
                to="/"
                className="text-neutral-500 hover:text-neutral-700 text-sm"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}