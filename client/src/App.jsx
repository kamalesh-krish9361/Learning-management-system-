import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Pages
import { Home } from './pages/Home';
import { Marketplace } from './pages/Marketplace';
import { CourseDetails } from './pages/CourseDetails';
import { LearnPlayer } from './pages/LearnPlayer';
import { QuizPage } from './pages/QuizPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { InstructorDashboard } from './pages/InstructorDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';

const AppLayout = ({ children }) => {
  const location = useLocation();
  // Hide standard Navbar/Footer on immersive distraction-free learning player & quiz player
  const isImmersivePlayer = location.pathname.startsWith('/learn/') || location.pathname.startsWith('/quiz/');

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      {!isImmersivePlayer && <Navbar />}
      <div className="flex-1">
        {children}
      </div>
      {!isImmersivePlayer && <Footer />}
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Marketplace />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/learn/:id" element={<LearnPlayer />} />
            <Route path="/quiz/:courseId" element={<QuizPage />} />
            
            {/* Dashboards */}
            <Route path="/dashboard/student" element={<StudentDashboard />} />
            <Route path="/dashboard/instructor" element={<InstructorDashboard />} />
            <Route path="/dashboard/admin" element={<AdminDashboard />} />

            {/* Auth & Settings */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />

            {/* Fallback */}
            <Route path="*" element={<Home />} />
          </Routes>
        </AppLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;
