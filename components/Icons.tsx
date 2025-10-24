import React from 'react';

export const UserLocationIcon = () => (
  <svg viewBox="0 0 100 100" className="w-6 h-6">
    <circle cx="50" cy="50" r="45" fill="blue" stroke="white" strokeWidth="5" opacity="0.5"/>
    <circle cx="50" cy="50" r="20" fill="blue" stroke="white" strokeWidth="5"/>
  </svg>
);

export const StationIcon = ({ status, isVan }: { status: string; isVan: boolean }) => {
  const color = status === 'Available' ? '#10B981' : status === 'Busy' ? '#F59E0B' : '#6B7280';
  return (
    <svg viewBox="0 0 24 24" fill={color} className="w-10 h-10 drop-shadow-lg">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      <path d="M0 0h24v24H0z" fill="none"/>
      {isVan ? 
        <path fill="white" d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11C5.84 5 5.28 5.42 5.08 6.01L3 12v8h2v-2h14v2h2v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/> :
        <path fill="white" d="M13 9h-2v2H9v2h2v2h2v-2h2v-2h-2V9zm-1-5c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5 5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z"/>
      }
    </svg>
  );
};

export const DeliveryVehicleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-blue-600 drop-shadow-lg">
      <path fillRule="evenodd" d="M5.478 5.558A1.5 1.5 0 0 1 6.912 4.5H9A.75.75 0 0 1 9.75 5.25v2.25a.75.75 0 0 1-1.5 0V6H6.912a.375.375 0 0 0-.34.212L4.96 9h4.29a.75.75 0 0 1 .743.648l.525 2.625A.75.75 0 0 1 9.75 13.5h-3a.75.75 0 0 1-.743-.648L5.48 10.225A.75.75 0 0 1 6.224 9h.036l1.07-2.675L6.088 5.79a.375.375 0 0 0-.34-.212L5.478 5.558ZM12.75 12a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-.75.75h-6a.75.75 0 0 1-.75-.75v-6Z" clipRule="evenodd" />
      <path d="M9.375 14.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0v-2.25a.75.75 0 0 1 .75-.75ZM11.25 18.75a.75.75 0 0 0-1.5 0v.75c0 .414.336.75.75.75h.001c.414 0 .749-.336.749-.75v-.75ZM3 15.75a.75.75 0 0 0-1.5 0v.75c0 .414.336.75.75.75H3a.75.75 0 0 0 .75-.75v-.75a.75.75 0 0 0-.75-.75Z" />
      <path fillRule="evenodd" d="M4.5 18.75a.75.75 0 0 1 .75-.75h.001a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.001a.75.75 0 0 1-.75-.75v-.75ZM15 15.75a.75.75 0 0 0-1.5 0v.75c0 .414.336.75.75.75h.001c.414 0 .749-.336.749-.75v-.75Z" clipRule="evenodd" />
      <path d="M7.5 15.75a.75.75 0 0 0-1.5 0v.75c0 .414.336.75.75.75H7.5a.75.75 0 0 0 .75-.75v-.75a.75.75 0 0 0-.75-.75Z" />
      <path fillRule="evenodd" d="M17.25 18.75a.75.75 0 0 1 .75-.75h.001a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.001a.75.75 0 0 1-.75-.75v-.75Z" clipRule="evenodd" />
    </svg>
);

export const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
  </svg>
);

export const BatteryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 011 1v10a1 1 0 01-1 1H6a3 3 0 01-3-3V6zm5 2.25a.75.75 0 01.75.75v2.5a.75.75 0 01-1.5 0v-2.5a.75.75 0 01.75-.75zm3.5.75a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5z" clipRule="evenodd" />
    </svg>
);

export const BookmarkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
);

export const BookmarkFilledIcon = () => (
    <svg xmlns="http://www.w3.