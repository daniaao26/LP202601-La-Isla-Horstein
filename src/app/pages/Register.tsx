import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Phone, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

export function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Por favor corrige los errores en el formulario');
      return;
    }

    setIsLoading(true);

    try {
      const success = await register(
        formData.name,
        formData.email,
        formData.password,
        formData.phone
      );

      if (success) {
        toast.success('¡Cuenta creada exitosamente!');
        navigate('/');
      } else {
        toast.error('Este email ya está registrado');
      }
    } catch (error) {
      toast.error('Error al crear la cuenta');
    } finally {
      setIsLoading(false);
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
            <h1 className="text-4xl font-bold text-neutral-900 mb-2">Crear Cuenta</h1>
            <p className="text-neutral-600">Regístrate para realizar pedidos</p>
          </div>

          {/* Register Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  <User size={16} className="inline mr-1" />
                  Nombre Completo
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-red-600 transition-colors ${
                    errors.name ? 'border-red-500' : 'border-neutral-200'
                  }`}
                  placeholder="Juan Pérez"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

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
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-red-600 transition-colors ${
                    errors.email ? 'border-red-500' : 'border-neutral-200'
                  }`}
                  placeholder="tu@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  <Phone size={16} className="inline mr-1" />
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-red-600 transition-colors ${
                    errors.phone ? 'border-red-500' : 'border-neutral-200'
                  }`}
                  placeholder="+56 9 1234 5678"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
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
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-red-600 transition-colors ${
                    errors.password ? 'border-red-500' : 'border-neutral-200'
                  }`}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  <Lock size={16} className="inline mr-1" />
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-red-600 transition-colors ${
                    errors.confirmPassword ? 'border-red-500' : 'border-neutral-200'
                  }`}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 text-white py-3 rounded-full hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UserPlus size={20} />
                {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-neutral-600">
                ¿Ya tienes cuenta?{' '}
                <Link
                  to="/login"
                  className="text-red-600 hover:text-red-700 font-semibold"
                >
                  Inicia sesión
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
