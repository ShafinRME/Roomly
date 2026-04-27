# 🏠 Roomly — Room Booking Platform

> **"Find your perfect stay, host your perfect space."**

Roomly is a full-stack room booking platform that connects guests, hosts, and administrators in a seamless property rental experience. It features role-based access control, an interactive booking calendar, secure international payments, and a comprehensive management dashboard for all user types.

---

## 🔗 Links

| | URL |
|---|---|
| 🌐 **Live Site** | [with-roomly.web.app](https://with-roomly.web.app) |
| ⚙️ **Live API** | [roomly-lac.vercel.app](https://roomly-lac.vercel.app) |
| 💻 **Frontend Repo** | [github.com/ShafinRME/Room_Booking/client](https://github.com/ShafinRME/Room_Booking/tree/main/client) |
| 🖥️ **Backend Repo** | [github.com/ShafinRME/Room_Booking/server](https://github.com/ShafinRME/Room_Booking/tree/main/server) |

---

## ✨ Key Features

### 👤 Guest Role
- Register via name, profile image, email/password, or Google Sign-In
- Browse rooms publicly; room details and booking require authentication
- Request to become a Host by clicking the **"Host Your Home"** button
- Book rooms by selecting available dates from an interactive calendar, then pay securely via **Stripe**
- Access a personal dashboard with statistics (total spend, total bookings, member since date)
- Cancel bookings before the check-in date
- Submit a room review only after the booking end date — preventing fake reviews
- Update profile information at any time

### 🏡 Host Role
- Hosts are activated by Admin approval of a guest's host request
- Toggle between Guest and Host views seamlessly from the same account
- View host statistics: total sales, total bookings, total listings, and member since date
- Add new room listings via a detailed form supporting up to **5 images**
- View, update, and delete listings from the **My Listings** section
- Manage guest bookings and cancel reservations when necessary from the **Manage Bookings** section
- Update profile information at any time

### 🛠️ Admin Role
- Approve or reject guest requests to become a Host
- Promote or demote any user to Admin, Host, or Guest role
- View platform-wide statistics: total sales, total users, total bookings, and total rooms
- Manage all user roles from the **Manage Users** section
- Add or delete room categories from the **Manage Categories** section
- Update profile information at any time

### 🌍 General Features
- Fully role-based protected routing (Guest / Host / Admin dashboards)
- Smart booking calendar that automatically blocks already-booked date ranges — preventing double bookings
- Reviews are only unlocked after a booking's end date — ensuring authentic feedback
- Guests can cancel bookings before the check-in date
- Password change and forgot password functionality supported via Firebase

---

## 🧰 Tech Stack

### Frontend
| Technology | Link |
|---|---|
| React | [react.dev](https://react.dev) |
| React Router | [reactrouter.com](https://reactrouter.com) |
| Tailwind CSS | [tailwindcss.com](https://tailwindcss.com) |
| Axios | [axios-http.com](https://axios-http.com) |
| TanStack React Query | [tanstack.com/query](https://tanstack.com/query) |
| Stripe.js | [stripe.com/docs](https://stripe.com/docs) |
| React Hook Form | [react-hook-form.com](https://react-hook-form.com) |
| React Date Range | [npmjs.com/package/react-date-range](https://www.npmjs.com/package/react-date-range) |
| Recharts | [recharts.org](https://recharts.org) |

### Backend
| Technology | Link |
|---|---|
| Node.js | [nodejs.org](https://nodejs.org) |
| Express.js | [expressjs.com](https://expressjs.com) |
| JSON Web Token (JWT) | [jwt.io](https://jwt.io) |
| Nodemailer | [nodemailer.com](https://nodemailer.com) |
| date-fns | [date-fns.org](https://date-fns.org) |

### Database
| Technology | Link |
|---|---|
| MongoDB Atlas | [mongodb.com](https://www.mongodb.com) |

### Others
| Technology | Link |
|---|---|
| Firebase Auth | [firebase.google.com](https://firebase.google.com) |
| Stripe API | [stripe.com](https://stripe.com) |
| ImgBB | [imgbb.com](https://imgbb.com) |
| Firebase Hosting | [firebase.google.com/docs/hosting](https://firebase.google.com/docs/hosting) |
| Vercel | [vercel.com](https://vercel.com) |

---

## 🗂️ Project Structure (Monorepo)

```
Room_Booking/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── routes/
│   │   └── firebase/
│   ├── .env.local
│   └── package.json
│
└── server/          # Express backend
    ├── index.js
    ├── vercel.json
    ├── .env
    └── package.json
```

---

## ⚙️ Run Locally

### Prerequisites
- Node.js installed
- MongoDB Atlas account
- Firebase project
- Stripe account

---

### 🖥️ Backend Setup

```bash
# Navigate to server folder
cd server

# Install dependencies
npm install

# Create .env file
touch .env
```

Add the following to `server/.env`:
```env
DB_USER=your_mongodb_username
DB_PASS=your_mongodb_password
ACCESS_TOKEN_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
TRANSPORTER_EMAIL=your_gmail_address
TRANSPORTER_PASS=your_gmail_app_password
NODE_ENV=development
PORT=8000
```

```bash
# Start the server
npm run dev
```
Server runs at `http://localhost:8000`

---

### 💻 Frontend Setup

```bash
# Navigate to client folder
cd client

# Install dependencies
npm install

# Create .env.local file
touch .env.local
```

Add the following to `client/.env.local`:
```env
VITE_API_URL=http://localhost:8000

VITE_apiKey=your_firebase_api_key
VITE_authDomain=your_firebase_auth_domain
VITE_projectId=your_firebase_project_id
VITE_storageBucket=your_firebase_storage_bucket
VITE_messagingSenderId=your_firebase_messaging_sender_id
VITE_appId=your_firebase_app_id

VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_IMGBB_API_KEY=your_imgbb_api_key
```

```bash
# Start the frontend
npm run dev
```
Frontend runs at `http://localhost:5173`

---

## 🚀 Deployment

### Backend → Vercel
```bash
cd server
git add .
git commit -m "deploy: update server"
git push origin main
# Vercel auto-deploys on push
```

### Frontend → Firebase Hosting
```bash
cd client
npm run build
firebase deploy
```

---

## 🔮 Future Improvements

- Add a reviews section on the landing page
- Integration with Bangladeshi payment gateways (bKash, Nagad)
- OTP-based user verification
- Favourite rooms section for guests
- More detailed room information on the room details page
- Real-time chat between guest and host
- Push notifications for booking updates

---

## 🧩 Problems Solved

- Secure international payments via Stripe integration
- Smart calendar that automatically blocks booked date ranges — no double bookings possible
- Review system locked until booking end date — ensures only genuine reviews
- Guests can cancel bookings before check-in date
- Full forgot password and password reset flow via Firebase

---

## 👨‍💻 Author

**Md. Shafin Ahmed**
- GitHub: [@ShafinRME](https://github.com/ShafinRME)
- Live Project: [Visit](https://with-roomly.web.app)
