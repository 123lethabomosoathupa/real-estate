import Listing from '@/lib/models/listing.model';
import { connect } from '@/lib/mongodb/mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export const POST = async (req) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }
  try {
    await connect();
    const data = await req.json();
    const newListing = await Listing.create({
      userRef: session.user.id,
      name: data.name,
      description: data.description,
      address: data.address,
      regularPrice: data.regularPrice,
      discountPrice: data.discountPrice,
      bathrooms: data.bathrooms,
      bedrooms: data.bedrooms,
      furnished: data.furnished,
      parking: data.parking,
      type: data.type,
      offer: data.offer,
      imageUrls: data.imageUrls,
    });
    await newListing.save();
    return new Response(JSON.stringify(newListing), { status: 200 });
  } catch (error) {
    console.log('Error creating listing:', error);
    return new Response('Error creating listing', { status: 500 });
  }
};
