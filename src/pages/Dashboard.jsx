import React from 'react';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <div className="p-10 text-center text-2xl text-green-700">
        ✅ Bienvenido al Dashboard (aquí irá tu sistema)
      </div>
    </>
  );
}
