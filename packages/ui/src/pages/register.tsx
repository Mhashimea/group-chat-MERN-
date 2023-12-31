import { Button, Input } from '@/components/ui';
import { RegisterFormI } from '@/lib/models/register.model';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { Formik } from 'formik';
import { httpPost } from '@/lib/request';
import { toast } from 'sonner';

const registerValidation = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
  name: yup.string().required('Name is required'),
});

function Register() {
  const navigate = useNavigate();

  const model: RegisterFormI = {
    email: '',
    password: '',
    name: '',
  };
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: RegisterFormI) => {
    setLoading(true);
    const response = await httpPost('/auth/register', values);
    setLoading(false);
    if (response.success) {
      toast.success('Register success');
      navigate('/');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="w-[400px] border rounded-xl shadow-md px-5 pb-5">
        <h1 className="text-2xl text-primary font-semibold uppercase mt-5">Register</h1>
        <p className="mb-8 text-sm text-gray-500">Register to the account with your email and password.</p>

        <Formik initialValues={model} validationSchema={registerValidation} onSubmit={onSubmit}>
          {({ submitCount, errors, values, handleChange, handleSubmit }) => (
            <>
              <div className="mb-5">
                <label htmlFor="name" className="mb-2 block text-gray-500 text-sm">
                  Name
                </label>
                <Input placeholder="Your name" id="name" value={values.name} onChange={handleChange} />
                {errors.name && submitCount > 0 && (
                  <span className="text-xs text-red-500 mt-1 transition-all duration-300 ease-in-out">{errors.name}</span>
                )}
              </div>

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
                <Input placeholder="******" type="password" id="password" name="password" value={values.password} onChange={handleChange} />
                {errors.password && submitCount > 0 && (
                  <span className="text-xs text-red-500 mt-1 transition-all duration-300 ease-in-out">{errors.password}</span>
                )}
              </div>

              <div className="mb-8">
                <Button className="w-full" type="submit" onClick={() => handleSubmit()} disabled={loading}>
                  Register
                </Button>
              </div>
            </>
          )}
        </Formik>

        <div className="text-sm">
          Already have an account?{' '}
          <Link to="/" className="underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
