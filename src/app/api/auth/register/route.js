import { v2 as cloudinary } from 'cloudinary';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const POST = async (req) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }
  try {
    const formData = await req.formData();
    const files = formData.getAll('files');

    if (!files || files.length === 0) {
      return new Response(JSON.stringify({ error: 'No files provided' }), { status: 400 });
    }
    if (files.length > 6) {
      return new Response(JSON.stringify({ error: 'Maximum 6 images allowed' }), { status: 400 });
    }

    const uploadPromises = files.map(async (file) => {
      if (file.size > 2 * 1024 * 1024) throw new Error(`${file.name} exceeds 2MB limit`);
      const buffer = Buffer.from(await file.arrayBuffer());
      const dataUri = `data:${file.type};base64,${buffer.toString('base64')}`;
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: 'next-estate',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      });
      return result.secure_url;
    });

    const urls = await Promise.all(uploadPromises);
    return new Response(JSON.stringify({ urls }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Upload failed' }), { status: 500 });
  }
};
