import Listing from '@/lib/models/listing.model';
import { connect } from '@/lib/mongodb/mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export const POST = async (req) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  try {
    await connect();
    const data = await req.json();
    const newListing = await Listing.create({
      userRef: session.user.id,
      name: data.name,
      description: data.description,
      address: data.address,
      regularPrice: Number(data.regularPrice),
      discountPrice: Number(data.discountPrice) || 0,
      bathrooms: Number(data.bathrooms),
      bedrooms: Number(data.bedrooms),
      furnished: data.furnished,
      parking: data.parking,
      type: data.type,
      offer: data.offer,
      imageUrls: data.imageUrls,
    });
    return new Response(JSON.stringify(newListing), { status: 200 });
  } catch (error) {
    console.error('Error creating listing:', error);
    return new Response(JSON.stringify({ error: 'Error creating listing' }), { status: 500 });
  }
};
