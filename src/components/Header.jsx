'use client';

import { FaSearch, FaPlus } from 'react-icons/fa';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function Header() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(searchParams);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) setSearchTerm(searchTermFromUrl);
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(searchParams);
    urlParams.set('searchTerm', searchTerm);
    router.push(`/search?${urlParams.toString()}`);
  };

  useEffect(() => {
    const close = () => setMenuOpen(false);
    if (menuOpen) document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [menuOpen]);

  return (
    <header className='bg-gray-700 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-4'>
        {/* Logo */}
        <Link href='/'>
          <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-gray-300'>Sahand</span>
            <span className='text-white'>Estate</span>
          </h1>
        </Link>

        {/* Search */}
        <form className='bg-gray-600 p-2 rounded-lg flex items-center gap-2' onSubmit={handleSubmit}>
          <input
            type='text'
            placeholder='Search...'
            className='bg-transparent focus:outline-none w-24 sm:w-48 text-white placeholder-gray-400 !bg-transparent'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type='submit'>
            <FaSearch className='text-gray-300 hover:text-white' />
          </button>
        </form>

        {/* Nav links */}
        <ul className='flex gap-5 items-center'>
          {session && (
            <Link href='/dashboard'>
              <li className='hidden md:inline text-gray-300 hover:text-white transition-colors text-sm'>
                Dashboard
              </li>
            </Link>
          )}
          <Link href='/'>
            <li className='hidden md:inline text-gray-300 hover:text-white transition-colors text-sm'>
              Home
            </li>
          </Link>
          <Link href='/about'>
            <li className='hidden md:inline text-gray-300 hover:text-white transition-colors text-sm'>
              About
            </li>
          </Link>
          {session && (
            <Link
              href='/create-listing'
              className='hidden md:flex items-center gap-1.5 bg-gray-500 hover:bg-gray-400 text-white text-sm px-3 py-1.5 rounded-lg transition-colors'
            >
              <FaPlus className='text-xs' />
              Create Listing
            </Link>
          )}

          {session ? (
            <div className='relative' onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setMenuOpen(!menuOpen)}>
                <div className='w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white text-sm font-semibold hover:bg-gray-400 transition-colors'>
                  {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              </button>
              {menuOpen && (
                <div className='absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg py-1 z-50 border border-gray-200'>
                  <div className='px-4 py-2 border-b border-gray-100'>
                    <p className='text-xs font-semibold text-gray-700 truncate'>{session.user?.name}</p>
                    <p className='text-xs text-gray-400 truncate'>{session.user?.email}</p>
                  </div>
                  <Link href='/dashboard' className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors' onClick={() => setMenuOpen(false)}>
                    My Listings
                  </Link>
                  <Link href='/create-listing' className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors md:hidden' onClick={() => setMenuOpen(false)}>
                    Create Listing
                  </Link>
                  <div className='border-t border-gray-100 mt-1'>
                    <button
                      onClick={() => { setMenuOpen(false); signOut({ callbackUrl: '/' }); }}
                      className='block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors'
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href='/sign-in'>
              <li className='text-gray-300 hover:text-white transition-colors text-sm'>Sign In</li>
            </Link>
          )}
        </ul>
      </div>
    </header>
  );
}
