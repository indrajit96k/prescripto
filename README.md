🩺 Prescripto – Doctor Appointment Booking Website

Prescripto is a full-stack doctor appointment booking platform where patients can seamlessly book appointments with doctors, make secure payments, and manage their bookings. The project also includes an admin panel to manage doctors and appointments.

✨ Key Features

📱 Mobile-responsive UI – works smoothly on all devices

👨‍⚕️ Doctor management – add, edit, and manage doctors via the admin panel

📅 Appointment booking – patients can view doctors, select slots, and book appointments

💳 Razorpay integration – secure online payments for bookings

✅ Form validations – client & server-side validations for error-free booking

🔐 Authentication – secure login & registration system for patients and admins

🛠️ Tech Stack

Frontend: React.js (mobile responsive UI)

Backend: Node.js, Express.js

Database: MongoDB

Payment Gateway: Razorpay

Other Tools: JWT authentication, bcrypt, Cloudinary (if you added file uploads)

📂 Project Structure

prescripto/
│── backend/        # Express backend (APIs, DB, Auth, Payments)
│── frontend/       # React frontend (UI)
│── admin/          # Admin panel for doctors & appointments
│── .gitignore
│── README.md


🚀 How to Run Locally

Clone the repository

git clone https://github.com/your-username/prescripto.git
cd prescripto


Install dependencies

cd backend && npm install
cd ../frontend && npm install


Setup environment variables (.env file in backend & frontend)

MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
RAZORPAY_KEY=your_key
RAZORPAY_SECRET=your_secret


Start backend

cd backend
npm start


Start frontend

cd frontend
npm start


Open in browser → http://localhost:4000
