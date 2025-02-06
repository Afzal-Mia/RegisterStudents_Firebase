import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast"
import Login from "./pages/Login";
import Students from "./pages/Students";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/students" element={<PrivateRoute><Students /></PrivateRoute>} />
        </Routes>
        <Toaster
          position="top-right"
          reverseOrder={false}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;