import ListingItem from '@/components/ListingItem';
import Link from 'next/link';

export default async function Home() {
  let rentListings = null;
  let saleListings = null;
  let offerListings = null;

  try {
    const r = await fetch(process.env.URL + '/api/listing/get', { method: 'POST', body: JSON.stringify({ type: 'rent', limit: 4, order: 'asc' }), cache: 'no-store' });
    rentListings = await r.json();
  } catch { rentListings = []; }

  try {
    const r = await fetch(process.env.URL + '/api/listing/get', { method: 'POST', body: JSON.stringify({ type: 'sale', limit: 4, order: 'asc' }), cache: 'no-store' });
    saleListings = await r.json();
  } catch { saleListings = []; }

  try {
    const r = await fetch(process.env.URL + '/api/listing/get', { method: 'POST', body: JSON.stringify({ limit: 4, order: 'asc', offer: true }), cache: 'no-store' });
    offerListings = await r.json();
  } catch { offerListings = []; }

  return (
    <div className='min-h-screen bg-gray-100'>
      {/* Hero */}
      <div className='max-w-6xl mx-auto px-4 py-16 flex flex-col gap-6'>
        <h1 className='text-gray-700 font-bold text-3xl lg:text-5xl'>
          Find your next <span className='text-gray-500'>perfect</span>
          <br />place with ease
        </h1>
        <p className='text-gray-500 text-sm sm:text-base max-w-xl'>
          Sahand Estate is the best place to find your next perfect place to live.
          We have a wide range of properties for you to choose from.
        </p>
        <Link href='/search' className='text-sm text-gray-600 font-semibold hover:text-gray-800 underline underline-offset-4'>
          Let&apos;s get started...
        </Link>
      </div>

      {/* Hero Image */}
      <img
        src='https://firebasestorage.googleapis.com/v0/b/mern-auth-1c4ae.appspot.com/o/1693307829089home%203.jpeg?alt=media&token=8dcc9a22-a8d3-4737-b27f-7c77b417a7d0'
        className='w-full h-[480px] object-cover'
        alt='hero'
      />

      {/* Listings */}
      <div className='max-w-6xl mx-auto px-4 py-12 flex flex-col gap-12'>
        {offerListings && offerListings.length > 0 && (
          <section>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-semibold text-gray-700'>Recent Offers</h2>
              <Link className='text-sm text-gray-500 hover:text-gray-700 hover:underline' href='/search?offer=true'>Show more</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing) => <ListingItem listing={listing} key={listing._id} />)}
            </div>
          </section>
        )}
        {rentListings && rentListings.length > 0 && (
          <section>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-semibold text-gray-700'>Recent places for rent</h2>
              <Link className='text-sm text-gray-500 hover:text-gray-700 hover:underline' href='/search?type=rent'>Show more</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing) => <ListingItem listing={listing} key={listing._id} />)}
            </div>
          </section>
        )}
        {saleListings && saleListings.length > 0 && (
          <section>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-semibold text-gray-700'>Recent places for sale</h2>
              <Link className='text-sm text-gray-500 hover:text-gray-700 hover:underline' href='/search?type=sale'>Show more</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing) => <ListingItem listing={listing} key={listing._id} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
