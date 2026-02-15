import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { 
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate("/dashboard");
        } catch (err) {
            if(err instanceof Error) {
                 setError(err.message);
            } else {
                setError('Login failed.Please try again.')
            }
           
        } finally {
            setLoading(false);
        }
      
    };
  return (
    
    <div className="min-h-screen bg-blue-500 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shawdow-lg w-96">
            <h1 className="text-2xl font-bold mb-6">Login</h1>
            { error && (
                <div className="bg-red=50 border-l-4 boder-red-500 p-3 rounded mb-4">
                    <p className="text-red-700 text-sm">{error}</p>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" required 
                     className="w-full px-4 py-2 border rounded-lg"/>
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" required 
                     className="w-full px-4 py-2 border rounded-lg"/>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
            {/* Register Link */}
            <p className="text-center text-sm text-gray-600 mt-4">
                Don't have an account? {' '} 
                <a href="/register" className="text-blue-600 hover:underline">Register here</a>
            </p>
        </div>
    </div>
  );
}