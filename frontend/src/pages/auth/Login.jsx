import React, { useContext, useEffect, useState } from 'react';
import InputText from '../../components/common/InputText';
import { AuthContext } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import { validateEmail, validatePassword } from '../../utils/validation';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setErrorMessage(""); 
  
    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!validatePassword(password)) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    setLoading(true);
  
    try {
      await login(email, password, setErrorMessage); // Pass `setErrorMessage` to update UI
    } catch (error) {
      setErrorMessage(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="bg-gray-50 w-screen h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-md p-6 flex flex-col shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Welcome back</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-4">
            <InputText
              label="Email"
              name="email"
              type="email"
              value={email}
              handleOnChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              aria-label="Email"
              aria-describedby="email-error"
              required
            />
            <InputText
              label="Password"
              name="password"
              type="password"
              value={password}
              handleOnChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              aria-label="Password"
              aria-describedby="password-error"
              required
            />
            <Button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading} // Disable button during loading
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </div>
          {errorMessage && (
            <p id="login-error" className="text-red-500 text-sm mt-2">
              {errorMessage}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
