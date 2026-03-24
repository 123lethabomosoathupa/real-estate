import Link from 'next/link';
import { MdLocationOn } from 'react-icons/md';
import { FaBed, FaBath } from 'react-icons/fa';

export default function ListingItem({ listing }) {
  return (
    <div className='bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px] border border-gray-200'>
      <Link href={`/listing/${listing._id}`}>
        <img
          src={
            listing.imageUrls[0] ||
            'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
          }
          alt='listing cover'
          className='h-[200px] w-full object-cover hover:scale-105 transition-transform duration-300'
        />
        <div className='p-4 flex flex-col gap-2'>
          <p className='truncate text-base font-semibold text-gray-800'>{listing.name}</p>
          <div className='flex items-center gap-1'>
            <MdLocationOn className='h-4 w-4 text-gray-500 shrink-0' />
            <p className='text-sm text-gray-500 truncate'>{listing.address}</p>
          </div>
          <p className='text-sm text-gray-500 line-clamp-2'>{listing.description}</p>
          <p className='text-gray-700 mt-1 font-semibold'>
            R{' '}
            {listing.offer
              ? listing.discountPrice.toLocaleString('en-ZA')
              : listing.regularPrice.toLocaleString('en-ZA')}
            {listing.type === 'rent' && (
              <span className='text-sm font-normal text-gray-500'> / month</span>
            )}
          </p>
          <div className='flex gap-4 text-gray-500 text-xs mt-1'>
            <div className='flex items-center gap-1'>
              <FaBed className='text-gray-400' />
              <span>{listing.bedrooms} {listing.bedrooms > 1 ? 'beds' : 'bed'}</span>
            </div>
            <div className='flex items-center gap-1'>
              <FaBath className='text-gray-400' />
              <span>{listing.bathrooms} {listing.bathrooms > 1 ? 'baths' : 'bath'}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
