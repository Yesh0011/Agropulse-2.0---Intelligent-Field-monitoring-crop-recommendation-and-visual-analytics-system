import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Recommendations from "./pages/Recommendations";

// Create a green theme to match the dashboard
const theme = createTheme({
  palette: {
    primary: {
      main: "#16a34a", // Green color from dashboard CSS
    },
    secondary: {
      main: "#166534", // Darker green
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* 🔥 DEFAULT ROUTE */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* PUBLIC ROUTES */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recommendations" element={<Recommendations />} />
          {/* ✅ HOME (NEW) */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* ANALYTICS */}
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <AnalyticsDashboard />
              </ProtectedRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;