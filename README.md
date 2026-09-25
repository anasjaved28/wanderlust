# Wanderlust 🌍

A full-stack property listings web application inspired by Airbnb, built with **Node.js**, **Express**, **MongoDB**, and **EJS**. Wanderlust allows users to create, view, edit, and delete travel accommodation listings through a clean, server-rendered interface.

## Features

- 📋 **Browse Listings** — View all available property listings
- ➕ **Create Listings** — Add new listings with details
- ✏️ **Edit Listings** — Update existing listing information
- 🗑️ **Delete Listings** — Remove listings you no longer need
- 🎨 **Server-Side Rendering** — Fast, SEO-friendly pages using EJS templates with `ejs-mate` for layout support

## Tech Stack

| Category | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB (via Mongoose) |
| Templating | EJS + EJS-Mate |
| Other | Method-Override (for PUT/DELETE forms), dotenv (env config) |

## Project Structure

```
wanderlust/
├── models/
│   └── listing.js       # Mongoose schema for listings
├── views/
│   └── listings/         # EJS templates (index, show, new, edit)
├── public/               # Static assets (CSS, JS, images)
├── app.js                # Main server file
├── .env                  # Environment variables (not committed)
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB running locally or a MongoDB Atlas connection string

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/<your-username>/wanderlust.git
   cd wanderlust
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory
   ```
   ATLASDB_URL=your_mongodb_connection_url_here
   PORT=3000
   ```

4. Start the server
   ```bash
   node app.js
   ```

5. Visit `http://localhost:3000/listings` in your browser

## Routes

| Method | Route | Description |
|---|---|---|
| GET | `/listings` | View all listings |
| GET | `/listings/new` | Form to create a new listing |
| POST | `/listings` | Create a new listing |
| GET | `/listings/:id` | View a single listing |
| GET | `/listings/:id/edit` | Form to edit a listing |
| PUT | `/listings/:id` | Update a listing |
| DELETE | `/listings/:id` | Delete a listing |

## Future Improvements

- User authentication and authorization
- Image uploads for listings
- Search and filter functionality
- Reviews and ratings

## License

This project is open source and available for educational purposes.
