# Next Estate

A full-stack real estate listing app built with Next.js 15, NextAuth, MongoDB Atlas, and Cloudinary — all free, no third-party auth services needed.

## Tech Stack (all free tier)

| Layer          | Service                        | Free Allowance              |
|----------------|--------------------------------|-----------------------------|
| Framework      | Next.js 15 (App Router)        | —                           |
| Auth           | NextAuth.js (self-hosted)      | Unlimited, no restrictions  |
| Database       | MongoDB Atlas                  | 512 MB                      |
| Image Storage  | Cloudinary                     | 25 GB storage + bandwidth   |
| Hosting        | Render                         | 750 hrs/month               |

---

## Local Setup

### 1. Install dependencies
npm install

### 2. Set up MongoDB Atlas (free)
1. Create account at mongodb.com/atlas
2. Create a free M0 cluster
3. Under Database Access: add a user with a password
4. Under Network Access: add 0.0.0.0/0
5. Click Connect > Drivers > copy your connection string

### 3. Set up Cloudinary (free)
1. Create account at cloudinary.com
2. From your Dashboard copy: Cloud Name, API Key, API Secret

### 4. Generate a NextAuth secret
Run this in your terminal:
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
Copy the output as your NEXTAUTH_SECRET.

### 5. Configure environment variables
cp .env.example .env.local

Fill in .env.local:
  NEXTAUTH_URL=http://localhost:3000
  NEXTAUTH_SECRET=your-generated-secret
  MONGODB_URI=mongodb+srv://...
  CLOUDINARY_CLOUD_NAME=...
  CLOUDINARY_API_KEY=...
  CLOUDINARY_API_SECRET=...
  URL=http://localhost:3000

### 6. Run locally
npm run dev

---

## Deploying to Render

1. Push your code to GitHub
2. Go to render.com > New Web Service > connect your repo
3. Add all env vars from .env.example in the Render dashboard
4. Set NEXTAUTH_URL and URL to your live Render URL
5. Deploy!

---

## Project Structure

src/
  app/
    about/                    About page
    api/
      auth/
        [...nextauth]/        NextAuth handler (sign in)
        register/             POST: create new user account
      listing/
        create/               POST: create listing
        get/                  POST: search/get listings
        update/               POST: update listing
      upload/                 POST: Cloudinary image upload
    create-listing/           Create listing form
    listing/[id]/             Single listing detail view
    search/                   Search with filters
    sign-in/                  Email/password sign-in page
    sign-up/                  Registration page
    update-listing/[id]/      Edit listing form
  components/
    AuthProvider.jsx          NextAuth SessionProvider wrapper
    Header.jsx                Nav with sign in/out
    ListingItem.jsx           Listing card component
  lib/
    models/
      listing.model.js        Mongoose listing schema
      user.model.js           Mongoose user schema (with hashed password)
    mongodb/
      mongoose.js             DB connection singleton
