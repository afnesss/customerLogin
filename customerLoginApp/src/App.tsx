import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import { createTokenId } from "./api/tokenQuery";
import { getCookie } from "./api/clientConfig";
import ProfilePage from "./components/ProfilePage";

const ProtectedRoute = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <ProfilePage />;
};

function App() {
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const existingToken = getCookie("carecloud_token");

        if (!existingToken) {
          await createTokenId();
        }

        const savedUser = localStorage.getItem("auth_user");
        setIsLoggedIn(Boolean(savedUser));
      } finally {
        setIsBootstrapping(false);
      }
    };

    void bootstrap();
  }, []);

  if (isBootstrapping) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/login"
        element={
          isLoggedIn ? (
            <Navigate to="/profile" replace />
          ) : (
            <main className="relative flex min-h-screen items-center justify-center px-4 py-8">
              <LoginForm setIsLoggedIn={setIsLoggedIn} />
            </main>
          )
        }
      />
      <Route
        path="/profile"
        element={<ProtectedRoute isLoggedIn={isLoggedIn} />}
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
