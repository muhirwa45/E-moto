# 🚲⚡ E-Moto Battery Swap Rwanda

This is a smart logistics and mapping application designed to help electric motorcycle (e-moto) owners in Rwanda locate nearby battery stations and request instant battery delivery or swaps. The interface is clean, map-centered, and built for a seamless mobile experience, inspired by modern ride-sharing and delivery apps.

## 🌷 Core Concept

The primary goal is to solve the "range anxiety" for e-moto riders. The app provides a real-time map of all available battery swap stations and mobile delivery vans. With a few taps, a rider can request a fresh battery to be delivered directly to their location, ensuring they are never stranded.

## 🔋 Key Features

- **📍 Interactive Map View**: Utilizes Leaflet and OpenStreetMap to display a fully interactive map of Kigali. Users can pan, zoom, and explore.
- **🗺️ Switchable Map Layers**: Easily toggle between a detailed **Street View** and a high-resolution **Satellite View**.
- **🛰️ Real-time Geolocation**: Automatically detects the user's current location to find the nearest services.
- **🏪 Station Discovery**: Displays all nearby battery stations and mobile vans with color-coded status indicators (Available, Busy, Offline).
- **⭐ Favorite Stations**: Users can bookmark their favorite or most-used stations for quick access.
- **⚡ Instant Battery Request**: Select a station, view available battery types (e.g., 60V, 72V) with pricing, and request a delivery with one tap.
- **🚚 Live Delivery Tracking**: Once a request is confirmed, track the delivery vehicle in real-time as it travels to your location.
- **🆘 SOS Emergency Delivery**: A dedicated SOS button automatically finds the nearest available station and dispatches a battery for emergency situations.
- **📱 Responsive Design**: A mobile-first interface built with Tailwind CSS that is clean, intuitive, and easy to use on the go.

## 🧩 Tech Stack

This project is a frontend prototype built with modern web technologies:

- **Framework**: [React](https://reactjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Mapping**: [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Geolocation**: Browser Geolocation API

## 🚀 Getting Started

This application is designed to run in a modern web browser. No complex setup is required.

1.  Open the `index.html` file in a web browser.
2.  **Allow Location Access**: When prompted, grant the browser permission to access your location. This is essential for the app to function correctly.
3.  Explore the map, select a station, and simulate a battery request.

## 📂 File Structure

The project is organized into logical modules for maintainability:

```
/
├── components/         # Reusable React components (Map, ActionPanel, Icons, etc.)
├── hooks/              # Custom React hooks (e.g., useGeolocation)
├── App.tsx             # Main application component, manages state
├── constants.ts        # Mock data and fixed values (stations, coordinates)
├── index.html          # The main HTML entry point
├── index.tsx           # React application entry point
├── types.ts            # Shared TypeScript type definitions
├── utils.ts            # Utility functions (e.g., distance calculation)
└── README.md           # This file
```

## 🔧 Future Enhancements

This prototype lays the groundwork for a full-featured production application. Future development could include:

- **Backend Integration**: Develop a robust backend (e.g., with Node.js or Python) to manage real data, user accounts, and order processing.
- **Database**: Integrate a database like Firebase or PostgreSQL to store user data, station inventory, and delivery logs.
- **User Authentication**: Allow riders and station owners to sign up and log in.
- **💰 Payment Integration**: Integrate with Rwandan mobile money APIs (MTN MoMo, Airtel Money) for seamless in-app payments.
- **🏪 Station Management Dashboard**: A separate web interface for station owners to manage their battery inventory, view incoming orders, and track revenue.
- **🔔 Push Notifications**: Use a service like Firebase Cloud Messaging to send real-time updates ("Delivery on the way," "Your battery has arrived").
