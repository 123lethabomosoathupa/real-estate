import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking } from 'react-icons/fa';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ListingActions from '@/components/ListingActions';

export default async function Listing({ params }) {
  const session = await getServerSession(authOptions);
  let listing = null;
  try {
    const result = await fetch(process.env.URL + '/api/listing/get', {
      method: 'POST',
      body: JSON.stringify({ listingId: params.id }),
      cache: 'no-store',
    });
    const data = await result.json();
    listing = data[0];
  } catch { listing = null; }

  if (!listing) return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
      <p className='text-gray-500 text-xl'>Listing not found</p>
    </div>
  );

  const isOwner = session?.user?.id === listing.userRef;

  return (
    <main className='min-h-screen bg-gray-100'>
      <img src={listing.imageUrls[0]} alt={listing.name} className='w-full h-[400px] object-cover' />
      <div className='max-w-4xl mx-auto p-6 my-8'>
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col gap-4'>
          <div className='flex items-start justify-between flex-wrap gap-2'>
            <h1 className='text-2xl font-semibold text-gray-800'>{listing.name}</h1>
            <p className='text-xl font-semibold text-gray-700'>
              R {(listing.offer ? listing.discountPrice : listing.regularPrice).toLocaleString('en-ZA')}
              {listing.type === 'rent' && <span className='text-sm font-normal text-gray-500'> / month</span>}
            </p>
          </div>
          <p className='flex items-center gap-2 text-gray-500 text-sm'>
            <FaMapMarkerAlt className='text-gray-400' />
            {listing.address}
          </p>
          <div className='flex gap-3 flex-wrap'>
            <span className='bg-gray-700 text-white text-sm px-3 py-1 rounded-md'>
              {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
            </span>
            {listing.offer && (
              <span className='bg-gray-500 text-white text-sm px-3 py-1 rounded-md'>
                R {(+listing.regularPrice - +listing.discountPrice).toLocaleString('en-ZA')} OFF
              </span>
            )}
          </div>
          <p className='text-gray-600 text-sm leading-relaxed'>
            <span className='font-semibold text-gray-700'>Description — </span>
            {listing.description}
          </p>
          <div className='flex flex-wrap gap-6 pt-2 border-t border-gray-100'>
            {[
              { icon: <FaBed />, label: `${listing.bedrooms} ${listing.bedrooms > 1 ? 'beds' : 'bed'}` },
              { icon: <FaBath />, label: `${listing.bathrooms} ${listing.bathrooms > 1 ? 'baths' : 'bath'}` },
              { icon: <FaParking />, label: listing.parking ? 'Parking' : 'No Parking' },
              { icon: <FaChair />, label: listing.furnished ? 'Furnished' : 'Unfurnished' },
            ].map(({ icon, label }) => (
              <div key={label} className='flex items-center gap-2 text-gray-500 text-sm'>
                <span className='text-gray-400'>{icon}</span>
                {label}
              </div>
            ))}
          </div>
          {isOwner && <ListingActions listingId={listing._id.toString()} />}
          {listing.imageUrls.length > 1 && (
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2'>
              {listing.imageUrls.slice(1).map((url, i) => (
                <img key={i} src={url} alt={`listing image ${i + 2}`} className='w-full h-40 object-cover rounded-lg' />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
