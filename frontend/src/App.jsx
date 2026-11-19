import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';

export default function App() {
  const { session } = useAuth();
  return session ? <ChatPage /> : <LoginPage />;
}