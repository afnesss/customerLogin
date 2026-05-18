import { useEffect } from "react";
import LoginForm from "./components/LoginForm";
import { createTokenId } from "./api/tokenQuery";

function App() {
  useEffect(() => {
    createTokenId();
  }, []);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden  px-4 py-8">
      <LoginForm />
    </main>
  );
}

export default App;
