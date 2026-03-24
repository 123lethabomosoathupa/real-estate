'use client';
import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function SignInForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await signIn('credentials', { email: formData.email, password: formData.password, redirect: false });
    setLoading(false);
    if (result?.error) { setError(result.error); }
    else { router.push('/'); router.refresh(); }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4'>
      <div className='max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8'>
        <div className='text-center mb-8'>
          <h1 className='text-2xl font-bold text-gray-700'>
            <span className='text-gray-500'>Sahand</span>Estate
          </h1>
          <p className='text-gray-500 mt-2 text-sm'>Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-600 mb-1'>Email</label>
            <input type='email' id='email' placeholder='you@example.com' className='border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-gray-400' value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-600 mb-1'>Password</label>
            <input type='password' id='password' placeholder='••••••••' className='border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-gray-400' value={formData.password} onChange={handleChange} required />
          </div>
          {error && <p className='text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg p-3'>{error}</p>}
          <button type='submit' disabled={loading} className='bg-gray-700 text-white p-3 rounded-lg font-semibold hover:bg-gray-600 disabled:opacity-70 transition-colors mt-2'>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className='text-center text-gray-500 text-sm mt-6'>
          Don&apos;t have an account?{' '}
          <Link href='/sign-up' className='text-gray-700 font-semibold hover:underline'>Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={<div className='min-h-screen bg-gray-100 flex items-center justify-center'><p className='text-gray-500'>Loading...</p></div>}>
      <SignInForm />
    </Suspense>
  );
}
