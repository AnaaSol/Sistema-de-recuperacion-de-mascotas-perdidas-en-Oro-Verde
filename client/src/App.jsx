import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GeoPage from "./pages/GeoPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/geo" element={<GeoPage />} />
      </Routes>
    </Router>
  );
}

export default App;

