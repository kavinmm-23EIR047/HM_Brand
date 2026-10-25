import React from "react";

export function Lotus({ className = "" }: { className?: string }) {
  return (
    <svg className={`pointer-events-none select-none ${className}`} viewBox="0 0 300 220" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="lotusPetal" x1="150" y1="26" x2="150" y2="166" gradientUnits="userSpaceOnUse"><stop stopColor="#F9B7C0"/><stop offset="1" stopColor="#C8385A"/></linearGradient>
        <linearGradient id="lotusInner" x1="150" y1="51" x2="150" y2="167" gradientUnits="userSpaceOnUse"><stop stopColor="#FFE1B0"/><stop offset="1" stopColor="#F28456"/></linearGradient>
      </defs>
      <path d="M145 175C106 139 74 131 30 139c20 35 61 51 115 44Zm10 0c39-36 71-44 115-36-20 35-61 51-115 44Z" fill="#3D8C58"/>
      <path d="M148 178C99 161 71 164 48 184c36 21 70 20 100 3Zm4 0c49-17 77-14 100 6-36 21-70 20-100 3Z" fill="#62A96A"/>
      <path d="M150 168C94 142 75 104 93 70c32 15 52 46 57 98Z" fill="url(#lotusPetal)" stroke="#A7294C" strokeWidth="3"/>
      <path d="M150 168c56-26 75-64 57-98-32 15-52 46-57 98Z" fill="url(#lotusPetal)" stroke="#A7294C" strokeWidth="3"/>
      <path d="M150 169c-34-39-38-82 0-128 38 46 34 89 0 128Z" fill="url(#lotusInner)" stroke="#B84754" strokeWidth="3"/>
      <path d="M150 166c-19-28-19-64 0-99 19 35 19 71 0 99Z" fill="#FFD65E" stroke="#C2743B" strokeWidth="2.5"/>
      <path d="M150 174c-42-24-74-25-106-4 29 31 69 41 106 19 37 22 77 12 106-19-32-21-64-20-106 4Z" fill="#D95369" stroke="#A7294C" strokeWidth="3"/>
      <path d="M150 176v29m-48-14 30 13m66-13-30 13" stroke="#3D8C58" strokeWidth="3" strokeLinecap="round"/>
      <path d="M150 163c-4 6-8 10-14 13m14-13c4 6 8 10 14 13" stroke="#FFF2C9" strokeWidth="2.5" strokeLinecap="round" opacity=".85"/>
      <circle cx="150" cy="166" r="7" fill="#F7C449" stroke="#B56735" strokeWidth="2"/>
      <path d="m68 151 42 18m122-18-42 18m-91 20 32 6m82-6-32 6" stroke="#D3E7AC" strokeWidth="2" strokeLinecap="round" opacity=".8"/>
    </svg>
  );
}
