import { useState } from 'react';
import Input from '../../components/Inputs/Input';
import AuthLayout from '../../components/layouts/AuthLayout';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  // handle login submit
  const handleLogin = (e) => {
    e.preventDefault();
  };
  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Please enter your details to log in
        </p>
      </div>

      {/* form */}
      <form onSubmit={handleLogin}>
        <Input
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          label="Email Address"
          placeholder="you@example.com"
          type="text"
        />
      </form>
    </AuthLayout>
  );
};

export default Login;
