# 🏠 Roomly — Room Booking Platform

> **"Find your perfect stay, host your perfect space."**

Roomly is a full-stack room booking platform that connects guests, hosts, and administrators in a seamless property rental experience. It features role-based access control, an interactive booking calendar, secure international payments, and a comprehensive management dashboard for all user types.

---

## 🔗 Links

| | URL |
|---|---|
| 🌐 **Live Site** | [with-roomly.web.app](https://with-roomly.web.app) |
| ⚙️ **Live API** | [roomly-lac.vercel.app](https://roomly-lac.vercel.app) |
| 💻 **Frontend Repo** | [Click Here](https://github.com/ShafinRME/Roomly/tree/main/client) |
| 🖥️ **Backend Repo** | [Click Here](https://github.com/ShafinRME/Roomly/tree/main/server) |

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
- Manage guest bookings and cancel reservations when necessary
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
- Smart booking calendar that automatically blocks already-booked date ranges
- JWT-based authentication using secure HTTP-only cookies
- Automated booking confirmation emails sent to both guest and host via Nodemailer
- Reviews are only unlocked after a booking's end date — ensuring authentic feedback
- Password change and forgot password functionality supported via Firebase

---

## 🧰 Tech Stack

### Frontend
| Technology | Link |
|---|---|
| React 18 | [react.dev](https://react.dev) |
| React Router DOM v6 | [reactrouter.com](https://reactrouter.com) |
| Tailwind CSS v3 | [tailwindcss.com](https://tailwindcss.com) |
| Headless UI | [headlessui.com](https://headlessui.com) |
| Axios | [axios-http.com](https://axios-http.com) |
| TanStack React Query v5 | [tanstack.com/query](https://tanstack.com/query) |
| Stripe.js | [stripe.com/docs](https://stripe.com/docs) |
| React Date Range | [npmjs.com/package/react-date-range](https://www.npmjs.com/package/react-date-range) |
| React Google Charts | [react-google-charts.com](https://www.react-google-charts.com) |
| React Hot Toast | [react-hot-toast.com](https://react-hot-toast.com) |
| React Helmet Async | [npmjs.com/package/react-helmet-async](https://www.npmjs.com/package/react-helmet-async) |
| React Icons | [react-icons.github.io](https://react-icons.github.io/react-icons) |
| date-fns | [date-fns.org](https://date-fns.org) |

### Backend
| Technology | Link |
|---|---|
| Node.js | [nodejs.org](https://nodejs.org) |
| Express.js v4 | [expressjs.com](https://expressjs.com) |
| JSON Web Token (JWT) | [jwt.io](https://jwt.io) |
| Nodemailer | [nodemailer.com](https://nodemailer.com) |
| Cookie Parser | [npmjs.com/package/cookie-parser](https://www.npmjs.com/package/cookie-parser) |
| date-fns | [date-fns.org](https://date-fns.org) |
| Stripe | [stripe.com](https://stripe.com) |
| Nodemon | [nodemon.io](https://nodemon.io) |

### Database
| Technology | Link |
|---|---|
| MongoDB Atlas | [mongodb.com](https://www.mongodb.com) |

### Others
| Technology | Link |
|---|---|
| Firebase Auth | [firebase.google.com](https://firebase.google.com) |
| ImgBB | [imgbb.com](https://imgbb.com) |
| Firebase Hosting | [firebase.google.com/docs/hosting](https://firebase.google.com/docs/hosting) |
| Vercel | [vercel.com](https://vercel.com) |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/jwt` | Public | Generate JWT token and set cookie |
| GET | `/logout` | Public | Clear JWT cookie and logout |

### Users
| Method | Endpoint | Access | Description |
|---|---|---|---|
| PUT | `/user` | Public | Create or update user |
| GET | `/user/:email` | Public | Get user info by email |
| GET | `/users` | Admin | Get all users |
| PATCH | `/users/update/:email` | Public | Update user role or status |

### Rooms
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/rooms` | Public | Get all rooms with pagination and category filter |
| GET | `/room/:id` | Public | Get single room details |
| GET | `/room/:id/booked-dates` | Public | Get booked date ranges for a room |
| GET | `/room/:id/availability` | Public | Get room availability status |
| GET | `/my-listings/:email` | Host | Get all listings by host |
| POST | `/room` | Host | Create a new room listing |
| PUT | `/room/update/:id` | Host | Update room details |
| DELETE | `/room/:id` | Host | Delete a room listing |

### Bookings
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/booking` | Auth | Create a new booking with date validation |
| GET | `/my-bookings/:email` | Auth | Get all bookings for a guest |
| GET | `/manage-bookings/:email` | Host | Get all bookings for a host |
| DELETE | `/booking/:id` | Auth | Cancel a booking |
| PATCH | `/booking/reviewed/:id` | Auth | Mark a booking as reviewed |

### Categories
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/categories` | Public | Get all room categories |
| POST | `/category` | Admin | Add a new category |
| DELETE | `/category/:id` | Admin | Delete a category |

### Reviews
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/review` | Auth | Submit a room review |
| GET | `/popular-rooms` | Public | Get top rated rooms |

### Payments
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/create-payment-intent` | Auth | Create Stripe payment intent |

### Statistics
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/admin-stat` | Admin | Get admin dashboard statistics |
| GET | `/host-stat` | Host | Get host dashboard statistics |
| GET | `/guest-stat` | Auth | Get guest dashboard statistics |

---

## 🗂️ Project Structure (Monorepo)

```
Room_Booking/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── routes/
│   │   └── firebase/
│   ├── .env.local
│   └── package.json
│
└── server/                  # Express backend
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
- Gmail account with App Password enabled

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

Add to `server/.env`:
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

Add to `client/.env.local`:
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
# Vercel auto-deploys on every push
```

### Frontend → Firebase Hosting
```bash
cd client
npm run build
firebase deploy
```

---

## 🧩 Problems Solved

- Secure international payments via Stripe integration
- Smart booking calendar that automatically blocks booked date ranges — no double bookings possible
- Server-side date overlap validation prevents booking conflicts even without the UI
- Review system locked until booking end date — ensures only genuine reviews
- Guests can cancel bookings before the check-in date
- Automated confirmation emails sent to both guest and host on every booking
- Full forgot password and password reset flow via Firebase

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

## 👨‍💻 Author

**Md. Shafin Ahmed**
- GitHub: [@ShafinRME](https://github.com/ShafinRME)
- Live Project: [with-roomly.web.app](https://with-roomly.web.app)
