import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'cliente' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuarios de ejemplo (en producción esto vendría de una base de datos)
const DEMO_USERS = [
  {
    id: 'admin-1',
    name: 'Administrador',
    email: 'admin@sushimaster.cl',
    password: 'admin123',
    role: 'admin' as UserRole,
    phone: '+56 9 1111 1111',
  },
  {
    id: 'cliente-1',
    name: 'Cliente Demo',
    email: 'cliente@ejemplo.cl',
    password: 'cliente123',
    role: 'cliente' as UserRole,
    phone: '+56 9 8765 4321',
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Cargar usuario desde localStorage al iniciar
    const savedUser = localStorage.getItem('sushi-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Guardar usuario en localStorage cada vez que cambie
  useEffect(() => {
    if (user) {
      localStorage.setItem('sushi-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('sushi-user');
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Buscar en usuarios demo
    const demoUser = DEMO_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (demoUser) {
      const { password: _, ...userWithoutPassword } = demoUser;
      setUser(userWithoutPassword);
      return true;
    }

    // Buscar en usuarios registrados
    const registeredUsers = JSON.parse(localStorage.getItem('sushi-registered-users') || '[]');
    const registeredUser = registeredUsers.find(
      (u: any) => u.email === email && u.password === password
    );

    if (registeredUser) {
      const { password: _, ...userWithoutPassword } = registeredUser;
      setUser(userWithoutPassword);
      return true;
    }

    return false;
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    phone: string
  ): Promise<boolean> => {
    // Verificar si el email ya existe
    const registeredUsers = JSON.parse(localStorage.getItem('sushi-registered-users') || '[]');
    const emailExists =
      DEMO_USERS.some((u) => u.email === email) ||
      registeredUsers.some((u: any) => u.email === email);

    if (emailExists) {
      return false;
    }

    // Crear nuevo usuario
    const newUser = {
      id: `cliente-${Date.now()}`,
      name,
      email,
      password,
      role: 'cliente' as UserRole,
      phone,
    };

    registeredUsers.push(newUser);
    localStorage.setItem('sushi-registered-users', JSON.stringify(registeredUsers));

    // Auto-login después del registro
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);

    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
