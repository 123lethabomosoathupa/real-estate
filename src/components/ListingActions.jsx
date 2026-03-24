'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function ListingActions({ listingId }) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setDeleting(true);
    setError('');
    try {
      const res = await fetch('/api/listing/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to delete.');
        setDeleting(false);
        return;
      }
      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Something went wrong.');
      setDeleting(false);
    }
  };

  return (
    <>
      <div className='flex gap-3 pt-2 border-t border-gray-100'>
        <Link
          href={`/update-listing/${listingId}`}
          className='flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg text-sm font-semibold hover:bg-gray-600 transition-colors'
        >
          <FaEdit /> Edit Listing
        </Link>
        <button
          onClick={() => setShowConfirm(true)}
          className='flex items-center gap-2 px-4 py-2 border border-red-300 text-red-500 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors'
        >
          <FaTrash /> Delete Listing
        </button>
      </div>

      {error && <p className='text-red-500 text-sm'>{error}</p>}

      {/* Confirm modal */}
      {showConfirm && (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4'>
          <div className='bg-white rounded-xl shadow-lg p-6 max-w-sm w-full'>
            <h3 className='text-lg font-semibold text-gray-800 mb-2'>Delete Listing</h3>
            <p className='text-gray-500 text-sm mb-6'>
              Are you sure? This cannot be undone.
            </p>
            <div className='flex gap-3'>
              <button
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
                className='flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50'
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className='flex-1 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50'
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
