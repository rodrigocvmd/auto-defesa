import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, Home, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const isHome = location.pathname === '/';

  async function handleLogout() {
    try {
        await logout();
        navigate('/login');
    } catch (error) {
        console.error("Erro ao sair", error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* Header Responsivo */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo Area */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-700 transition-colors">
                <Shield size={24} className="text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">
                Auto<span className="text-blue-600">Defesa</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {!isHome && (
                <Link to="/" className="text-gray-500 hover:text-blue-600 font-medium transition-colors flex items-center gap-2">
                  <Home size={18} /> Início
                </Link>
              )}

              <div className="h-6 w-px bg-gray-200 mx-2"></div>

              {currentUser ? (
                 <div className="flex items-center gap-4">
                    <Link to="/profile" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors group">
                        <div className="bg-gray-100 p-1.5 rounded-full group-hover:bg-blue-50 transition-colors">
                            <User size={18} />
                        </div>
                        <span className="text-sm font-medium truncate max-w-[150px]">
                            {currentUser.displayName || currentUser.email}
                        </span>
                    </Link>
                    <div className="h-4 w-px bg-gray-300"></div>
                    <button 
                        onClick={handleLogout}
                        className="text-gray-500 hover:text-red-600 font-medium transition-colors flex items-center gap-2 text-sm"
                        title="Sair"
                    >
                        <LogOut size={18} />
                    </button>
                 </div>
              ) : (
                <div className="flex items-center gap-4">
                    <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                        Entrar
                    </Link>
                    <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                        Criar conta
                    </Link>
                </div>
              )}
            </nav>

            {/* Mobile Action (simplificado) */}
            <div className="md:hidden flex items-center gap-4">
                {currentUser ? (
                     <button onClick={handleLogout} className="text-gray-600">
                        <LogOut size={20} />
                     </button>
                ) : (
                    <Link to="/login" className="text-blue-600 font-medium">Entrar</Link>
                )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer Responsivo */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; 2026 Auto Defesa MVP.</p>
          <div className="flex gap-4">
            <Link to="/terms" className="hover:text-blue-600">Termos de Uso</Link>
            <Link to="/privacy" className="hover:text-blue-600">Privacidade</Link>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default MainLayout;