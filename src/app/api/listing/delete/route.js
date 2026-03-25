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
    const { listingId } = await req.json();

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return new Response(JSON.stringify({ error: 'Listing not found' }), { status: 404 });
    }

    // Compare as strings — userRef is stored as a string, session.user.id is also a string
    if (listing.userRef.toString() !== session.user.id.toString()) {
      return new Response(JSON.stringify({ error: 'Unauthorized — you do not own this listing' }), { status: 403 });
    }

    await Listing.findByIdAndDelete(listingId);
    return new Response(JSON.stringify({ message: 'Listing deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting listing:', error);
    return new Response(JSON.stringify({ error: 'Error deleting listing' }), { status: 500 });
  }
};
