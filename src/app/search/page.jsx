'use client';
import { useEffect, useState, Suspense } from 'react';
import ListingItem from '@/components/ListingItem';
import { useRouter, useSearchParams } from 'next/navigation';

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sidebardata, setSidebardata] = useState({ searchTerm: '', type: 'all', parking: false, furnished: false, offer: false, sort: 'created_at', order: 'desc' });
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(searchParams);
    setSidebardata({
      searchTerm: urlParams.get('searchTerm') || '',
      type: urlParams.get('type') || 'all',
      parking: urlParams.get('parking') === 'true',
      furnished: urlParams.get('furnished') === 'true',
      offer: urlParams.get('offer') === 'true',
      sort: urlParams.get('sort') || 'created_at',
      order: urlParams.get('order') || 'desc',
    });
    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const res = await fetch('/api/listing/get', {
        method: 'POST',
        body: JSON.stringify({ searchTerm: urlParams.get('searchTerm') || '', type: urlParams.get('type') || 'all', parking: urlParams.get('parking') === 'true', furnished: urlParams.get('furnished') === 'true', offer: urlParams.get('offer') === 'true', sort: urlParams.get('sort') || 'created_at', order: urlParams.get('order') || 'desc' }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      setShowMore(data.length > 8);
      setListings(data);
      setLoading(false);
    };
    fetchListings();
  }, [searchParams]);

  const handleChange = (e) => {
    if (['all', 'rent', 'sale'].includes(e.target.id)) setSidebardata({ ...sidebardata, type: e.target.id });
    else if (e.target.id === 'searchTerm') setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    else if (['parking', 'furnished', 'offer'].includes(e.target.id)) setSidebardata({ ...sidebardata, [e.target.id]: e.target.checked });
    else if (e.target.id === 'sort_order') { const [sort, order] = e.target.value.split('_'); setSidebardata({ ...sidebardata, sort: sort || 'created_at', order: order || 'desc' }); }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    Object.entries(sidebardata).forEach(([k, v]) => urlParams.set(k, v));
    router.push(`/search?${urlParams.toString()}`);
  };

  const onShowMoreClick = async () => {
    const res = await fetch('/api/listing/get', { method: 'POST', body: JSON.stringify({ ...sidebardata, startIndex: listings.length }), headers: { 'Content-Type': 'application/json' } });
    const data = await res.json();
    if (data.length < 9) setShowMore(false);
    setListings([...listings, ...data]);
  };

  return (
    <div className='flex flex-col md:flex-row min-h-screen bg-gray-100'>
      <div className='p-6 bg-white border-b md:border-b-0 md:border-r border-gray-200 md:min-h-screen md:w-72 shrink-0'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
          <div>
            <label className='block text-sm font-medium text-gray-600 mb-1'>Search Term</label>
            <input type='text' id='searchTerm' placeholder='Search...' className='border border-gray-300 rounded-lg p-2 w-full text-sm text-gray-800 bg-white' value={sidebardata.searchTerm} onChange={handleChange} />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-600 mb-2'>Type</label>
            <div className='flex flex-col gap-2'>
              {[['all', 'Rent & Sale'], ['rent', 'Rent'], ['sale', 'Sale']].map(([id, label]) => (
                <label key={id} className='flex items-center gap-2 text-sm text-gray-600 cursor-pointer'>
                  <input type='checkbox' id={id} className='w-4 h-4 accent-gray-600' onChange={handleChange} checked={sidebardata.type === id} readOnly />
                  {label}
                </label>
              ))}
              <label className='flex items-center gap-2 text-sm text-gray-600 cursor-pointer'>
                <input type='checkbox' id='offer' className='w-4 h-4 accent-gray-600' onChange={handleChange} checked={sidebardata.offer} readOnly />
                Offer
              </label>
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-600 mb-2'>Amenities</label>
            <div className='flex flex-col gap-2'>
              {[['parking', 'Parking'], ['furnished', 'Furnished']].map(([id, label]) => (
                <label key={id} className='flex items-center gap-2 text-sm text-gray-600 cursor-pointer'>
                  <input type='checkbox' id={id} className='w-4 h-4 accent-gray-600' onChange={handleChange} checked={sidebardata[id]} readOnly />
                  {label}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-600 mb-1'>Sort</label>
            <select onChange={handleChange} defaultValue='createdAt_desc' id='sort_order' className='border border-gray-300 rounded-lg p-2 w-full text-sm text-gray-800 bg-white'>
              <option value='regularPrice_desc'>Price high to low</option>
              <option value='regularPrice_asc'>Price low to high</option>
              <option value='createdAt_desc'>Latest</option>
              <option value='createdAt_asc'>Oldest</option>
            </select>
          </div>
          <button className='bg-gray-700 text-white p-2 rounded-lg text-sm font-semibold hover:bg-gray-600 transition-colors'>Search</button>
        </form>
      </div>
      <div className='flex-1 p-6'>
        <h1 className='text-xl font-semibold text-gray-700 mb-6 pb-3 border-b border-gray-200'>Listing results</h1>
        <div className='flex flex-wrap gap-4'>
          {!loading && listings.length === 0 && <p className='text-gray-500'>No listings found.</p>}
          {loading && <p className='text-gray-500 w-full text-center'>Loading...</p>}
          {!loading && listings.map((listing) => <ListingItem key={listing._id} listing={listing} />)}
          {showMore && (<button onClick={onShowMoreClick} className='text-gray-600 hover:text-gray-800 hover:underline p-4 text-center w-full text-sm'>Show more</button>)}
        </div>
      </div>
    </div>
  );
}

export default function Search() {
  return (
    <Suspense fallback={<div className='min-h-screen bg-gray-100 flex items-center justify-center'><p className='text-gray-500'>Loading...</p></div>}>
      <SearchContent />
    </Suspense>
  );
}
