import Listing from '@/lib/models/listing.model';
import { connect } from '@/lib/mongodb/mongoose';
import mongoose from 'mongoose';

export const POST = async (req) => {
  await connect();
  const data = await req.json();
  try {
    const startIndex = parseInt(data.startIndex) || 0;
    const limit = data.userId ? 100 : (parseInt(data.limit) || 9);
    const sortDirection = data.order === 'asc' ? 1 : -1;

    let offer = data.offer;
    if (offer === undefined || offer === 'false') offer = { $in: [false, true] };

    let furnished = data.furnished;
    if (furnished === undefined || furnished === 'false') furnished = { $in: [false, true] };

    let parking = data.parking;
    if (parking === undefined || parking === 'false') parking = { $in: [false, true] };

    let type = data.type;
    if (type === undefined || type === 'all') type = { $in: ['sale', 'rent'] };

    // Build the filter object
    const filter = {
      offer,
      furnished,
      parking,
      type,
    };

    // Handle listingId — cast to ObjectId safely
    if (data.listingId) {
      try {
        filter._id = new mongoose.Types.ObjectId(data.listingId);
      } catch {
        return new Response(JSON.stringify([]), { status: 200 });
      }
    }

    // Filter by owner
    if (data.userId) {
      filter.userRef = data.userId;
    }

    // Search term across name and description
    if (data.searchTerm) {
      filter.$or = [
        { name: { $regex: data.searchTerm, $options: 'i' } },
        { description: { $regex: data.searchTerm, $options: 'i' } },
        { address: { $regex: data.searchTerm, $options: 'i' } },
      ];
    }

    const listings = await Listing.find(filter)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    return new Response(JSON.stringify(listings), { status: 200 });
  } catch (error) {
    console.error('Error getting listings:', error);
    return new Response(JSON.stringify({ error: 'Error fetching listings' }), { status: 500 });
  }
};
