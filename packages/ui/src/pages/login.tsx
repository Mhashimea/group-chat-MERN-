import { Button, Input } from '@/components/ui';
import useSession from '@/lib/hooks/useSession';
import { LoginFormI } from '@/lib/models/login.model';
import { httpPost } from '@/lib/request';
import { Formik } from 'formik';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import * as yup from 'yup';

const loginValidation = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

function Login() {
  const { setInitialSession } = useSession();
  const navigate = useNavigate();

  const model: LoginFormI = {
    email: '',
    password: '',
  };
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: LoginFormI) => {
    setLoading(true);
    const response = await httpPost('/auth/login', values);
    setLoading(false);

    if (response.success) handleSuccess(response.data);
    else toast.error(response.message);
  };

  const handleSuccess = (data: any) => {
    const { user, token } = data;
    localStorage.setItem('token', token);
    toast.success(`Welcome back ${user.name} to fliki chat`);
    setInitialSession();

    navigate('/groups');
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="w-[400px] border rounded-xl shadow-md px-5 pb-5">
        <h1 className="text-2xl text-primary font-semibold uppercase mt-5">Login</h1>
        <p className="mb-8 text-sm text-gray-500">Login to the account with your email and password.</p>

        <Formik initialValues={model} validationSchema={loginValidation} onSubmit={onSubmit}>
          {({ submitCount, errors, values, handleChange, handleSubmit }) => (
            <>
              <div className="mb-5">
                <label htmlFor="email" className="mb-2 block text-gray-500 text-sm">
                  Email
                </label>
                <Input placeholder="Email address" id="email" value={values.email} onChange={handleChange} name="email" />
                {errors.email && submitCount > 0 && (
                  <span className="text-xs text-red-500 mt-1 transition-all duration-300 ease-in-out">{errors.email}</span>
                )}
              </div>

              <div className="mb-5">
                <label htmlFor="password" className="mb-2 block text-gray-500 text-sm">
                  Password
                </label>
                <Input placeholder="******" type="password" name="password" value={values.password} onChange={handleChange} />
                {errors.password && submitCount > 0 && (
                  <span className="text-xs text-red-500 mt-1 transition-all duration-300 ease-in-out">{errors.password}</span>
                )}
              </div>

              <div className="mb-8">
                <Button className="w-full" type="submit" onClick={() => handleSubmit()} disabled={loading}>
                  Login
                </Button>
              </div>
            </>
          )}
        </Formik>

        <div className="text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
