import React from "react";

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-[#202020] text-white">
    <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
    <p className="mb-6">The page you are looking for does not exist.</p>
    <a href="/" className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700">Go Home</a>
  </div>
);

export default NotFound;
