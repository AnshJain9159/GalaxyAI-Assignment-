
# 🎬 VideoTransform — AI-Powered Video Transformation Tool

A full-stack Next.js application that enables users to transform videos using the **Hunyuan-Video Model (via Fal API)**. Built with modern tools like Clerk for authentication, ShadCN / V0 for UI/UX, MongoDB for history tracking, Uploadcare + Cloudinary for uploads, ImageKit for optimized delivery and NGORK for local webhook testing.
✨ **Transform your video content with AI magic – directly in your browser!**

## 📽️Youtube Demo URL : https://youtu.be/cit_Uyr9ptM
## 🔗Deployed Link : https://galaxy-ai-assignment.vercel.app

---

## 🔧 Key Features

✅ **AI Video-to-Video Transformation** using [Fal Hunyuan-Video API](https://fal.ai/)  
✅ **Secure Authentication** via [Clerk](https://clerk.dev)  
✅ **Video Uploads** handled by Uploadcare ➝ Transferred to Cloudinary  
✅ **Optimized Delivery** using ImageKit  
✅ **User History Tracking** with MongoDB  
✅ **Responsive UI** built with Tailwind CSS & ShadCN components  
✅ **Vercel-ready Deployment**  

---

## 📁 Project Structure

```
galaxyasg/
├── web/                     # Next.js app
│   ├── src/
│   │   ├── app/
│   │   │   ├── (root)/      # Landing page
│   │   │   ├── video-to-video/
│   │   │   ├── history/
│   │   ├── api/
│   │   │   ├── fal/
│   │   │   │   ├── proxy/route.ts
│   │   │   ├── generate-fal-video/route.ts
│   │   │   ├── upload-to-cloudinary/route.ts
│   │   │   ├── generate-fal-video/route.ts
│   │   │   ├── fal-webhook/route.ts
│   │   │   ├── history/route.ts
│   │   ├── components/      # Reusable UI components
│   │   ├── lib/dbConnect.ts # MongoDB connection utility
│   │   ├── models/          # Mongoose models
│   │   │   └── VideoHistory.ts
│   │   ├── app/
│   │   │   └── layout.tsx
│   │   │   └── globals.css
│   │   └── middleware.ts    # Clerk auth protection
│   ├── .env                 # Environment variables
│   ├── next.config.js
│   └── ...
├── README.md
└── ...
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/AnshJain9159/GalaxyAI-Assignment-
cd GalaxyAI-Assignment-/web
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `web/` directory:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NODE_ENV=development
MONGODB_URI="mongodb://localhost:27017/galaxy"
NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY=your_uploadcare_public_key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NEXT_FAL_KEY=your_fal_api_key
NEXT_PUBLIC_IMAGEKIT_URL=https://ik.imagekit.io/your_imagekit_id/
NEXT_PUBLIC_BASE_URL=https://...ngrok-free.app
```

> 🔒 Replace all `your_*` values with your actual keys from the respective services.

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 5. Run the Ngrok Server

```bash
npx ngrok http 3000
```

Copy the HTTPS URL provided by ngrok and set it as your `NEXT_PUBLIC_BASE_URL` in the `.env` file.

---

## 🔄 Main Flows

### 🎞️ Video Transformation Flow

1. User uploads video via Uploadcare
2. File is transferred to Cloudinary for processing
3. User sets transformation parameters
4. Backend calls [Fal AI](https://fal.ai) to apply Hunyuan model
5. Resulting video delivered via ImageKit and stored in MongoDB

### 🕓 History Management

Each transformation is logged in MongoDB with:
- User ID
- Input video URL
- Output video URL
- Timestamp
- Parameters used

Accessible at `/history` (auth protected).

### 🔐 Authentication

Handled via [Clerk](https://clerk.dev):
- Protects `/video-to-video`, `/history`, and `/api/*` routes
- Public landing page accessible at `/`

---

## 🛡️ Security Best Practices

- All sensitive API keys are stored in `.env` and not exposed publicly
- Clerk handles user sessions securely
- Middleware protects access to private pages
- Sensitive database logic is server-side only

---

## ☁️ Deployment

Ready for deployment on [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import into Vercel
3. Add environment variables in the dashboard
4. Deploy ✅

---

## 💖 Credits & Tech Stack

- [Next.js 14](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [ShadCN UI Components](https://ui.shadcn.com)
- [Clerk](https://clerk.dev) – Authentication
- [MongoDB](https://mongodb.com) – Database
- [Cloudinary](https://cloudinary.com) – Media storage
- [Uploadcare](https://uploadcare.com) – Upload widget
- [ImageKit](https://imagekit.io) – Optimized media delivery
- [Fal AI](https://fal.ai) – Hunyuan Video Model backend
- [V0](https://v0.dev) – V0 for UI/UX
- [NGROK](https://ngrok.com) – NGROK for local webhook testing
- [Vercel](https://vercel.com) – Deployment platform
---

## ❤️ Author

Built  by **Ansh Jain**  
📧 anshjain9159@gmail.com  
🌐 [@Ansh Jain](https://twitter.com/https://x.com/whoanshjain) on Twitter & [@Ansh Jain](https://www.linkedin.com/in/ansh-jain-78986b242/) on LinkedIn

---
