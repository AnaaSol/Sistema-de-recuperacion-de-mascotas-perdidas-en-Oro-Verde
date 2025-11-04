import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import GeoPage from "./pages/GeoPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/geo" replace />} />
        <Route path="/geo" element={<GeoPage />} />
      </Routes>
    </Router>
  );
}

export default App;

