import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DefenseProvider } from './contexts/DefenseContext';
import ScrollToTop from './components/ScrollToTop';
import { initializeAnalytics } from './services/analytics';
import ProtectedRoute from './components/ProtectedRoute';

// Initialize analytics service
initializeAnalytics();

// Lazy loading components
const Home = lazy(() => import('./pages/Home'));
const UploadDefense = lazy(() => import('./pages/UploadDefense'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const About = lazy(() => import('./pages/About'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const CreditSuccess = lazy(() => import('./pages/CreditSuccess'));
const Pricing = lazy(() => import('./pages/Pricing'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const Help = lazy(() => import('./pages/Help'));
const EmailConfirmation = lazy(() => import('./pages/EmailConfirmation'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const InfractionPage = lazy(() => import('./pages/InfractionPage'));
const AllInfractionsPage = lazy(() => import('./pages/AllInfractionsPage'));
const BlogIndex = lazy(() => import('./pages/BlogIndex'));
const ArticlePage = lazy(() => import('./pages/ArticlePage'));
const Tools = lazy(() => import('./pages/Tools'));
const ScoreCalculator = lazy(() => import('./pages/ScoreCalculator'));
const PrescriptionCalculator = lazy(() => import('./pages/PrescriptionCalculator'));
const AdsLandingPage = lazy(() => import('./pages/AdsLandingPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
  </div>
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <DefenseProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/credit-success" element={<CreditSuccess />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/email-confirmation" element={<EmailConfirmation />} />
              
              {/* Rotas Protegidas para o fluxo de passos */}
              <Route path="/upload" element={<ProtectedRoute><UploadDefense /></ProtectedRoute>} />
              <Route path="/upload/:step" element={<ProtectedRoute><UploadDefense /></ProtectedRoute>} />
              
              {/* Páginas de Conteúdo */}
              <Route path="/motorista-app" element={<ArticlePage customSlug="motorista-app" />} />
              <Route path="/caminhoneiro" element={<ArticlePage customSlug="caminhoneiro" />} />
              <Route path="/motoqueiro" element={<ArticlePage customSlug="motoqueiro" />} />
              <Route path="/ppd" element={<ArticlePage customSlug="perda-ppd" />} />
              <Route path="/artigo/:slug" element={<ArticlePage />} />
              <Route path="/guia" element={<BlogIndex />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/calculadora-pontos" element={<ScoreCalculator />} />
              <Route path="/calculadora-prescricao" element={<PrescriptionCalculator />} />
              
              {/* Páginas de Infração (Legado/Landing Pages Específicas) */}
              <Route path="/lp/:slug" element={<AdsLandingPage />} />
              <Route path="/recursos" element={<AllInfractionsPage />} />
              <Route path="/recorrer/:slug" element={<InfractionPage />} />

              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/about" element={<About />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/help" element={<Help />} />
              
              {/* Rota 404 - Deve ser sempre a última */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </DefenseProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
