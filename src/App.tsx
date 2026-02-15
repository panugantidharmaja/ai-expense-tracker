import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './context/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import Expenses from './pages/Expenses';
import Analytics from './pages/Analytics';
import supabase from './config/supabaseClient';
import Register from './pages/Register';

supabase.from('expenses').select('*').then(({ data, error }) => {
  if (error) {
    console.error('Error fetching expenses:', error);
  } else {
    console.log('Expenses data:', data);
  }
}); 

function App() {
  return (
    <AuthProvider>
       <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path='/register' element={<Register/>}/>
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
          <Route path="/expenses" element={
          <ProtectedRoute>
            <Expenses />
          </ProtectedRoute>
        } />
         <Route path="/analytics" element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
    </AuthProvider>
   
  );
}

export default App;