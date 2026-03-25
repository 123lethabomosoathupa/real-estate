'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ firstName: formData.firstName, lastName: formData.lastName, email: formData.email, password: formData.password }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Something went wrong'); setLoading(false); return; }
      router.push('/sign-in?registered=true');
    } catch { setError('Something went wrong. Please try again.'); setLoading(false); }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4'>
      <div className='max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8'>
        <div className='text-center mb-8'>
          <h1 className='text-2xl font-bold text-gray-700'><span className='text-gray-500'>Sahand</span>Estate</h1>
          <p className='text-gray-500 mt-2 text-sm'>Create your account</p>
        </div>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div className='flex gap-3'>
            <div className='flex-1'><label className='block text-sm font-medium text-gray-600 mb-1'>First Name</label><input type='text' id='firstName' placeholder='John' className='border border-gray-300 p-3 rounded-lg w-full text-gray-800 bg-white' value={formData.firstName} onChange={handleChange} required /></div>
            <div className='flex-1'><label className='block text-sm font-medium text-gray-600 mb-1'>Last Name</label><input type='text' id='lastName' placeholder='Doe' className='border border-gray-300 p-3 rounded-lg w-full text-gray-800 bg-white' value={formData.lastName} onChange={handleChange} required /></div>
          </div>
          <div><label className='block text-sm font-medium text-gray-600 mb-1'>Email</label><input type='email' id='email' placeholder='you@example.com' className='border border-gray-300 p-3 rounded-lg w-full text-gray-800 bg-white' value={formData.email} onChange={handleChange} required /></div>
          <div><label className='block text-sm font-medium text-gray-600 mb-1'>Password</label><input type='password' id='password' placeholder='Min. 6 characters' className='border border-gray-300 p-3 rounded-lg w-full text-gray-800 bg-white' value={formData.password} onChange={handleChange} required minLength={6} /></div>
          <div><label className='block text-sm font-medium text-gray-600 mb-1'>Confirm Password</label><input type='password' id='confirmPassword' placeholder='Repeat your password' className='border border-gray-300 p-3 rounded-lg w-full text-gray-800 bg-white' value={formData.confirmPassword} onChange={handleChange} required /></div>
          {error && <p className='text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg p-3'>{error}</p>}
          <button type='submit' disabled={loading} className='bg-gray-700 text-white p-3 rounded-lg font-semibold hover:bg-gray-600 disabled:opacity-70 transition-colors mt-2'>{loading ? 'Creating account...' : 'Create Account'}</button>
        </form>
        <p className='text-center text-gray-500 text-sm mt-6'>Already have an account?{' '}<Link href='/sign-in' className='text-gray-700 font-semibold hover:underline'>Sign in</Link></p>
      </div>
    </div>
  );
}
