import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Jornadas from './pages/Jornadas';
import JornadaDetail from './pages/JornadaDetail';
import MatchDetail from './pages/MatchDetail';
import Posiciones from './pages/Posiciones';
import Goleo from './pages/Goleo';
import Equipos from './pages/Equipos';
import EquipoDetail from './pages/EquipoDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminTeams from './pages/AdminTeams';
import AdminPlayers from './pages/AdminPlayers';
import AdminCreateMatchday from './pages/AdminCreateMatchday';
import AdminMatches from './pages/AdminMatches';
import AdminMatchResult from './pages/AdminMatchResult';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Public Routes with Navbar */}
          <Route element={<><Navbar /><Outlet /></>}>
            <Route path="/" element={<Home />} />
            <Route path="/jornadas" element={<Jornadas />} />
            <Route path="/jornadas/:id" element={<JornadaDetail />} />
            <Route path="/match/:id" element={<MatchDetail />} />
            <Route path="/posiciones" element={<Posiciones />} />
            <Route path="/goleo" element={<Goleo />} />
            <Route path="/equipos" element={<Equipos />} />
            <Route path="/equipo/:id" element={<EquipoDetail />} />
          </Route>

          {/* Admin Routes (No Navbar) */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/equipos" element={<AdminTeams />} />
          <Route path="/admin/equipos/:id/jugadores" element={<AdminPlayers />} />
          <Route path="/admin/crear-jornada" element={<AdminCreateMatchday />} />
          <Route path="/admin/partidos" element={<AdminMatches />} />
          <Route path="/admin/partidos/:id/resultado" element={<AdminMatchResult />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App
