import { useState } from "react";
import { useNavigate } from "react-router";
import supabase from "../config/supabaseClient";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password
            });
            if (error) throw error;
            setSuccess(true);
        } catch(err) {
            if(err instanceof Error) {
                 setError(err.message);
            } else {
                setError('Registration failed. Please try again.')
            }
        } finally {
            setLoading(false);
        }
    };
    if(success) {
        return (
            <div className="min-h-screen bg-blue-500 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
                    <h2 className="text-2xl font-bold text-gren-600 mb-4">Account Created</h2>
                    <p className="text-gray-600 mb-6">Check your email to verify your account, then login.</p>
                    <button onClick={() => navigate('/login')}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Go to Login</button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-blue-500 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h1 className="text-2xl font-bold mb-6">Create Account</h1>
                { error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded mb-4">
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Enter email"
                            required
                        />
                    </div>
                    <div className='mb-6'>
                        <label className="block text-sm font-medium mb-2">Password</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Enter password"
                            required
                        />
                    </div>
                    <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
                        {loading? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>
                <p className="text-center mt-4 text-sm text-gray-600">
                    Already have an account? <button className="text-blue-500 hover:underline" onClick={() => navigate('/login')}>Login</button>
                </p>
            </div>

        </div>
    );
}

export default Register;