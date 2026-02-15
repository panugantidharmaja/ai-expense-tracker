import { type ReactNode, useState } from 'react'; 
import { useNavigate, Link } from 'react-router-dom';
import AddExpenseModal from '../AddExpenseModal'; 
import { useAuth } from '../../context/useAuth';

interface MainLayoutProps {
  children: ReactNode;
  onExpenseAdded?: () => void; // ← New prop for callback
}

const MainLayout = ({ children, onExpenseAdded }: MainLayoutProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);  

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleExpenseAdded = () => {
    setIsModalOpen(false);
    if(onExpenseAdded) onExpenseAdded(); // ← Call parent callback
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">AI Expense Tracker</h1>
            </div>

            {/* Navigation Links */}
            <div className="flex space-x-8">
              <Link 
                to="/dashboard" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                📊 Dashboard
              </Link>
              <Link 
                to="/expenses" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                💰 Expenses
              </Link>
              <Link 
                to="/analytics" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                📈 Analytics
              </Link>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Floating Add Button */}
      <button 
        onClick={() => setIsModalOpen(true)}  // ← Add onClick
        className="fixed bottom-8 right-8 bg-blue-600 text-white w-16 h-16 rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center text-3xl"
      >
        +
      </button>

      {/* Add Expense Modal */}
      <AddExpenseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onExpensedAdded={handleExpenseAdded}
      />
    </div>
  );
};

export default MainLayout;