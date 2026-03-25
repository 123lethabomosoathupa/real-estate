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

    const listing = await Listing.findById(data.listingId);
    if (!listing) {
      return new Response(JSON.stringify({ error: 'Listing not found' }), { status: 404 });
    }

    // Compare as strings
    if (listing.userRef.toString() !== session.user.id.toString()) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 403 });
    }

    const updated = await Listing.findByIdAndUpdate(
      data.listingId,
      {
        $set: {
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
        },
      },
      { new: true }
    );
    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (error) {
    console.error('Error updating listing:', error);
    return new Response(JSON.stringify({ error: 'Error updating listing' }), { status: 500 });
  }
};
