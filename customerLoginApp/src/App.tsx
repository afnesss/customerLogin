import { Navigate, Route, Routes } from "react-router-dom";
import LoginForm from "./pages/LoginForm";
import ProfilePage from "./pages/ProfilePage";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <ProfilePage />;
};

function App() {
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/profile" replace />
          ) : (
            <main className="relative flex min-h-screen items-center justify-center px-4 py-8">
              <LoginForm />
            </main>
          )
        }
      />
      <Route path="/profile" element={<ProtectedRoute />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
