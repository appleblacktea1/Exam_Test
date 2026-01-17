import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { GlobalStateProvider } from '@/state/GlobalState';
import ScrollToTop from '@/components/ScrollToTop';
import MainLayout from '@/layouts/MainLayout';
import FloatingHelpBtn from './components/FloatingHelpBtn';
import Home from '@/pages/Home';
import Quiz from '@/pages/Quiz';
import PracticeQuiz from '@/pages/PracticeQuiz';
import Arena from '@/pages/Arena';
import Academy from '@/pages/Academy';
import Shop from '@/pages/Shop';
import Classification from '@/pages/Classification';
import Profile from '@/pages/Profile';
import Setting from '@/pages/Setting';
import FavoritesPage from '@/pages/FavoritePage';
import HistoryPage from '@/pages/HistoryPage';
import HistoryDetailPage from '@/pages/HistoryDetaolPage';
import ContentPage from '@/pages/content';

import AdminLayout from '@/layouts/AdminLayout';
import AdminDashboard from '@/pages/admin/Dashboard';
import QuestionBank from '@/pages/admin/QuestionBank';
import QuestionEditor from '@/pages/admin/QuestionEditor';
import UserList from '@/pages/admin/UserList';
import Settings from '@/pages/admin/Settings';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import QuizAnalysis from '@/pages/QuizAnalysis';
import PracticeQuizAnalysis from '@/pages/PracticeQuizAnalysis';
import ChallengeMap from '@/pages/ChallengeMap';
import Practive from '@/pages/Practice';
import CategoryDetail from '@/pages/CategoryDetail';
import NewsList from '@/pages/NewsList';
import NewsDetail from '@/pages/NewsDetail';
import Battle from '@/pages/Battle';
import CoursePlayer from '@/pages/CoursePlayer';

function App() {
  return (
    <Router>
      <GlobalStateProvider>
      <ScrollToTop />
      <FloatingHelpBtn />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/resetPassword" element={<ResetPassword />} />

        {/* App Client Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="classification" element={<Classification />} />
          <Route path="arena" element={<Arena />} />
          <Route path="academy" element={<Academy />} />
          <Route path="shop" element={<Shop />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Setting />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="history/:id" element={<HistoryDetailPage />} />
          <Route path="content" element={<ContentPage />} />
        </Route>

        {/* Fullscreen pages without bottom nav */}
        <Route path="/category/:id" element={<CategoryDetail />} />
        <Route path="/practice/:id" element={<Practive />} />
        <Route path="/news" element={<NewsList />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/battle/:id" element={<Battle />} />
        <Route path="/challenge/:id" element={<ChallengeMap />} />
        <Route path="/quiz/:id" element={<Quiz />} />
        <Route path="/practicequiz/:id" element={<PracticeQuiz />} />
        <Route path="/quiz/:id/analysis" element={<QuizAnalysis />} />
        <Route path="/practicequiz/:id/analysis" element={<PracticeQuizAnalysis />} />
        <Route path="/course/:id/learn" element={<CoursePlayer />} />

        {/* Admin Dashboard Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="questions" element={<QuestionBank />} />
          <Route path="questions/:id" element={<QuestionEditor />} />
          <Route path="users" element={<UserList />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
      </GlobalStateProvider>
    </Router>
  );
}

export default App;
