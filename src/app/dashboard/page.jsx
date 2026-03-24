'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaEdit, FaTrash, FaPlus, FaMapMarkerAlt, FaBed, FaBath } from 'react-icons/fa';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/sign-in'); return; }
    if (status === 'authenticated') fetchMyListings();
  }, [status]);

  const fetchMyListings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/listing/get', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.user.id }),
      });
      const data = await res.json();
      setListings(Array.isArray(data) ? data : []);
    } catch { setError('Failed to load your listings.'); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    setError('');
    try {
      const res = await fetch('/api/listing/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId: deleteId }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to delete listing.'); }
      else {
        setListings((prev) => prev.filter((l) => l._id !== deleteId));
        setSuccessMsg('Listing deleted successfully.');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch { setError('Something went wrong.'); }
    finally { setDeleting(false); setDeleteId(null); }
  };

  if (status === 'loading') return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
      <p className='text-gray-500'>Loading...</p>
    </div>
  );

  return (
    <div className='min-h-screen bg-gray-100'>
      <div className='max-w-5xl mx-auto px-4 py-10'>
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-2xl font-bold text-gray-700'>My Dashboard</h1>
            <p className='text-gray-500 text-sm mt-1'>Welcome back, {session?.user?.name}</p>
          </div>
          <Link href='/create-listing' className='flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-600 transition-colors'>
            <FaPlus className='text-xs' /> New Listing
          </Link>
        </div>

        {error && <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm'>{error}</div>}
        {successMsg && <div className='mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm'>{successMsg}</div>}

        <div className='grid grid-cols-3 gap-4 mb-8'>
          {[
            { label: 'Total Listings', value: listings.length },
            { label: 'For Rent', value: listings.filter((l) => l.type === 'rent').length },
            { label: 'For Sale', value: listings.filter((l) => l.type === 'sale').length },
          ].map(({ label, value }) => (
            <div key={label} className='bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm'>
              <p className='text-2xl font-bold text-gray-700'>{value}</p>
              <p className='text-sm text-gray-500 mt-1'>{label}</p>
            </div>
          ))}
        </div>

        <div className='bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden'>
          <div className='px-6 py-4 border-b border-gray-100'>
            <h2 className='text-base font-semibold text-gray-700'>Your Listings</h2>
          </div>
          {loading ? (
            <div className='p-12 text-center text-gray-400'>Loading your listings...</div>
          ) : listings.length === 0 ? (
            <div className='p-12 text-center'>
              <p className='text-gray-400 mb-4'>You haven&apos;t created any listings yet.</p>
              <Link href='/create-listing' className='inline-flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-600 transition-colors'>
                <FaPlus className='text-xs' /> Create your first listing
              </Link>
            </div>
          ) : (
            <div className='divide-y divide-gray-100'>
              {listings.map((listing) => (
                <div key={listing._id} className='flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors'>
                  <Link href={`/listing/${listing._id}`} className='shrink-0'>
                    <img src={listing.imageUrls?.[0] || 'https://via.placeholder.com/80'} alt={listing.name} className='w-16 h-16 object-cover rounded-lg border border-gray-200' />
                  </Link>
                  <div className='flex-1 min-w-0'>
                    <Link href={`/listing/${listing._id}`}>
                      <p className='font-semibold text-gray-800 truncate hover:underline'>{listing.name}</p>
                    </Link>
                    <p className='flex items-center gap-1 text-xs text-gray-400 mt-1 truncate'>
                      <FaMapMarkerAlt className='shrink-0' />{listing.address}
                    </p>
                    <div className='flex items-center gap-3 mt-1'>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${listing.type === 'rent' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                        {listing.type === 'rent' ? 'Rent' : 'Sale'}
                      </span>
                      {listing.offer && <span className='text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600 font-medium'>Offer</span>}
                      <span className='flex items-center gap-1 text-xs text-gray-400'><FaBed /> {listing.bedrooms}</span>
                      <span className='flex items-center gap-1 text-xs text-gray-400'><FaBath /> {listing.bathrooms}</span>
                    </div>
                  </div>
                  <div className='hidden sm:block text-right shrink-0'>
                    <p className='font-semibold text-gray-700 text-sm'>
                      R {(listing.offer ? listing.discountPrice : listing.regularPrice).toLocaleString('en-ZA')}
                    </p>
                    {listing.type === 'rent' && <p className='text-xs text-gray-400'>/ month</p>}
                  </div>
                  <div className='flex items-center gap-2 shrink-0'>
                    <Link href={`/update-listing/${listing._id}`} className='p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors' title='Edit'>
                      <FaEdit />
                    </Link>
                    <button onClick={() => setDeleteId(listing._id)} className='p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors' title='Delete'>
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {deleteId && (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4'>
          <div className='bg-white rounded-xl shadow-lg p-6 max-w-sm w-full'>
            <h3 className='text-lg font-semibold text-gray-800 mb-2'>Delete Listing</h3>
            <p className='text-gray-500 text-sm mb-6'>Are you sure? This cannot be undone.</p>
            <div className='flex gap-3'>
              <button onClick={() => setDeleteId(null)} disabled={deleting} className='flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50'>Cancel</button>
              <button onClick={handleDelete} disabled={deleting} className='flex-1 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 disabled:opacity-50'>
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
