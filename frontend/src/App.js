import './App.css';
import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/landing.jsx";
import Authentication from "./pages/authentication.jsx";
import VideoMeetComponent from "./pages/videoMeet";
import HomeComponent from "./pages/home.jsx";
import History from "./pages/history.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<Authentication />} />
      <Route path="/home" element={<HomeComponent />} />
      <Route path="/history" element={<History />} />
      <Route path="/:url" element={<VideoMeetComponent />} />
    </Routes>
  );
}

export default App;
