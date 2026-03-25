import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaTag } from 'react-icons/fa';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ListingActions from '@/components/ListingActions';

export default async function ListingPage({ params }) {
  const session = await getServerSession(authOptions);
  let listing = null;

  try {
    const result = await fetch(process.env.URL + '/api/listing/get', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listingId: params.id }),
      cache: 'no-store',
    });
    const data = await result.json();
    listing = Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch (e) {
    console.error('Failed to fetch listing:', e);
    listing = null;
  }

  if (!listing) {
    return (
      <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
        <p className='text-gray-500 text-xl'>Listing not found</p>
      </div>
    );
  }

  const isOwner = session?.user?.id === listing.userRef;

  // Price logic:
  // - If offer: show discountPrice (with savings badge)
  // - If sale (no offer): show regularPrice
  // - If rent: show regularPrice / month
  const displayPrice = listing.offer
    ? Number(listing.discountPrice)
    : Number(listing.regularPrice);

  const savings = listing.offer
    ? Number(listing.regularPrice) - Number(listing.discountPrice)
    : 0;

  return (
    <main className='min-h-screen bg-gray-100'>
      {/* Cover image */}
      <div className='w-full h-[400px] overflow-hidden'>
        <img
          src={listing.imageUrls?.[0]}
          alt={listing.name}
          className='w-full h-full object-cover'
        />
      </div>

      <div className='max-w-4xl mx-auto p-4 sm:p-6 my-8'>
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col gap-5'>

          {/* Title + Price */}
          <div className='flex items-start justify-between flex-wrap gap-3'>
            <h1 className='text-2xl font-bold text-gray-800'>{listing.name}</h1>
            <div className='text-right'>
              <p className='text-2xl font-bold text-gray-700'>
                R {displayPrice.toLocaleString('en-ZA')}
                {listing.type === 'rent' && (
                  <span className='text-sm font-normal text-gray-500'> / month</span>
                )}
              </p>
              {listing.offer && savings > 0 && (
                <p className='text-sm text-green-600 font-medium'>
                  Save R {savings.toLocaleString('en-ZA')}
                  <span className='text-gray-400 ml-1'>(was R {Number(listing.regularPrice).toLocaleString('en-ZA')})</span>
                </p>
              )}
            </div>
          </div>

          {/* Address */}
          <p className='flex items-center gap-2 text-gray-500 text-sm'>
            <FaMapMarkerAlt className='text-gray-400 shrink-0' />
            {listing.address}
          </p>

          {/* Type + Offer badges */}
          <div className='flex gap-3 flex-wrap'>
            <span className='bg-gray-700 text-white text-sm px-3 py-1 rounded-md font-medium'>
              {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
            </span>
            {listing.offer && (
              <span className='bg-green-600 text-white text-sm px-3 py-1 rounded-md font-medium flex items-center gap-1'>
                <FaTag className='text-xs' />
                Special Offer
              </span>
            )}
          </div>

          {/* Description */}
          <div className='border-t border-gray-100 pt-4'>
            <p className='text-sm font-semibold text-gray-700 mb-1'>Description</p>
            <p className='text-gray-600 text-sm leading-relaxed'>{listing.description}</p>
          </div>

          {/* Features */}
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-gray-100 pt-4'>
            <div className='flex flex-col items-center gap-1 bg-gray-50 rounded-lg p-3'>
              <FaBed className='text-gray-400 text-lg' />
              <p className='text-sm font-semibold text-gray-700'>{listing.bedrooms}</p>
              <p className='text-xs text-gray-400'>{listing.bedrooms > 1 ? 'Bedrooms' : 'Bedroom'}</p>
            </div>
            <div className='flex flex-col items-center gap-1 bg-gray-50 rounded-lg p-3'>
              <FaBath className='text-gray-400 text-lg' />
              <p className='text-sm font-semibold text-gray-700'>{listing.bathrooms}</p>
              <p className='text-xs text-gray-400'>{listing.bathrooms > 1 ? 'Bathrooms' : 'Bathroom'}</p>
            </div>
            <div className='flex flex-col items-center gap-1 bg-gray-50 rounded-lg p-3'>
              <FaParking className='text-gray-400 text-lg' />
              <p className='text-sm font-semibold text-gray-700'>{listing.parking ? 'Yes' : 'No'}</p>
              <p className='text-xs text-gray-400'>Parking</p>
            </div>
            <div className='flex flex-col items-center gap-1 bg-gray-50 rounded-lg p-3'>
              <FaChair className='text-gray-400 text-lg' />
              <p className='text-sm font-semibold text-gray-700'>{listing.furnished ? 'Yes' : 'No'}</p>
              <p className='text-xs text-gray-400'>Furnished</p>
            </div>
          </div>

          {/* Owner actions */}
          {isOwner && <ListingActions listingId={listing._id.toString()} />}

          {/* Additional images */}
          {listing.imageUrls?.length > 1 && (
            <div className='border-t border-gray-100 pt-4'>
              <p className='text-sm font-semibold text-gray-700 mb-3'>More Photos</p>
              <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                {listing.imageUrls.slice(1).map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`listing photo ${i + 2}`}
                    className='w-full h-40 object-cover rounded-lg border border-gray-100'
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
