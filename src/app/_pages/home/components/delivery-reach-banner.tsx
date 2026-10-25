"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Truck,
  Leaf,
  CheckCircle,
  Search,
  X,
  ArrowRight,
} from "lucide-react";

interface StateCoverage {
  id: string;
  name: string;
  tagline: string;
  districtsCount: number;
  dispatchTime: string;
  sampleDistricts: string[];
  allDistricts: string[];
}

const SOUTH_INDIA_STATES: StateCoverage[] = [
  {
    id: "tamil-nadu",
    name: "Tamil Nadu",
    tagline: "Home of Sacred Gopurams & Coimbatore Hub",
    districtsCount: 38,
    dispatchTime: "1–2 days from dispatch",
    sampleDistricts: ["Coimbatore", "Chennai", "Madurai", "Salem", "Trichy", "Tirunelveli"],
    allDistricts: [
      "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri",
      "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur",
      "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris",
      "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga",
      "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli",
      "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore",
      "Viluppuram", "Virudhunagar"
    ],
  },
  {
    id: "kerala",
    name: "Kerala",
    tagline: "God's Own Country & Sacred Backwaters",
    districtsCount: 14,
    dispatchTime: "2–3 days express courier",
    sampleDistricts: ["Kochi / Ernakulam", "Thiruvananthapuram", "Kozhikode", "Thrissur", "Palakkad"],
    allDistricts: [
      "Alappuzha", "Ernakulam (Kochi)", "Idukki", "Kannur", "Kasaragod", "Kollam",
      "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta",
      "Thiruvananthapuram", "Thrissur", "Wayanad"
    ],
  },
  {
    id: "andhra-pradesh",
    name: "Andhra Pradesh",
    tagline: "Land of Tirupati Balaji & Amaravati",
    districtsCount: 26,
    dispatchTime: "2–3 days direct delivery",
    sampleDistricts: ["Tirupati", "Visakhapatnam", "Vijayawada", "Guntur", "Kurnool"],
    allDistricts: [
      "Alluri Sitharama Raju", "Anakapalli", "Ananthapuramu", "Annamayya", "Bapatla",
      "Chittoor", "Dr. B.R. Ambedkar Konaseema", "East Godavari", "Eluru", "Guntur",
      "Kakinada", "Krishna", "Kurnool", "Nandyal", "NTR (Vijayawada)", "Palnadu",
      "Parvathipuram Manyam", "Prakasam", "Sri Potti Sriramulu Nellore", "Sri Sathya Sai",
      "Srikakulam", "Tirupati", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"
    ],
  },
  {
    id: "karnataka",
    name: "Karnataka",
    tagline: "Silicon Valley & Mysore Sandal Heritage",
    districtsCount: 31,
    dispatchTime: "2–3 days express shipping",
    sampleDistricts: ["Bengaluru", "Mysuru", "Hubballi-Dharwad", "Mangaluru", "Belagavi"],
    allDistricts: [
      "Bagalkote", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar",
      "Chamarajanagara", "Chikkaballapura", "Chikkamagaluru", "Chitradurga",
      "Dakshina Kannada (Mangaluru)", "Davanagere", "Dharwad (Hubballi)", "Gadag", "Hassan",
      "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur",
      "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayanagara",
      "Vijayapura", "Yadgir"
    ],
  },
  {
    id: "telangana",
    name: "Telangana",
    tagline: "City of Pearls & Charminar Traditions",
    districtsCount: 33,
    dispatchTime: "2–3 days tracked delivery",
    sampleDistricts: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"],
    allDistricts: [
      "Adilabad", "Bhadradri Kothagudem", "Hanumakonda", "Hyderabad", "Jagtial", "Jangaon",
      "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam",
      "Kumuram Bheem Asifabad", "Mahabubabad", "Mahabubnagar", "Mancherial", "Medak",
      "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda", "Narayanpet", "Nirmal",
      "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Ranga Reddy", "Sangareddy", "Siddipet",
      "Suryapet", "Vikarabad", "Wanaparthy", "Warangal", "Yadadri Bhuvanagiri"
    ],
  },
  {
    id: "puducherry",
    name: "Puducherry",
    tagline: "French Heritage & Auroville Coastal Sanctuary",
    districtsCount: 4,
    dispatchTime: "1–2 days safe transit",
    sampleDistricts: ["Puducherry", "Karaikal", "Mahe", "Yanam"],
    allDistricts: ["Puducherry", "Karaikal", "Mahe", "Yanam"],
  },
];

/* Custom Vector Landmark Art for each State - Authentic Architectural Heritage */
function StateLandmarkIcon({ stateId, className = "h-8 w-8" }: { stateId: string; className?: string }) {
  switch (stateId) {
    case "tamil-nadu":
      // Grand Dravidian Temple Gopuram (Brihadisvara / Meenakshi Amman)
      return (
        <svg viewBox="0 0 48 48" className={`shrink-0 ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Top 5 Golden Kalasams (Sacred Temple Stupas) */}
          <rect x="17" y="6" width="14" height="1.8" rx="0.9" fill="#D4AF37" />
          <circle cx="24" cy="4" r="1.5" fill="#F59E0B" stroke="#B45309" strokeWidth="0.5" />
          <circle cx="20.5" cy="4.8" r="1.2" fill="#F59E0B" stroke="#B45309" strokeWidth="0.5" />
          <circle cx="27.5" cy="4.8" r="1.2" fill="#F59E0B" stroke="#B45309" strokeWidth="0.5" />
          <circle cx="17.5" cy="5.4" r="1" fill="#D97706" />
          <circle cx="30.5" cy="5.4" r="1" fill="#D97706" />

          {/* Tier 1 (Apex Shikhara) */}
          <path d="M18 8 L30 8 L32 14 L16 14 Z" fill="#9E1830" stroke="#780E22" strokeWidth="0.8" />
          <path d="M22 10.5 Q24 9 26 10.5 L26 13 L22 13 Z" fill="#FDE68A" />

          {/* Tier 2 (Upper Stepped Gopuram Tiers) */}
          <rect x="14.5" y="14" width="19" height="1.5" rx="0.5" fill="#D4AF37" />
          <path d="M15 15.5 L33 15.5 L35 22 L13 22 Z" fill="#B91C1C" stroke="#780E22" strokeWidth="0.8" />
          {/* Ornamental Kudus / Arches */}
          <rect x="16" y="17" width="3" height="4" rx="1.5" fill="#FEF3C7" stroke="#9E1830" strokeWidth="0.5" />
          <rect x="22.5" y="17" width="3" height="4" rx="1.5" fill="#FBBF24" stroke="#9E1830" strokeWidth="0.5" />
          <rect x="29" y="17" width="3" height="4" rx="1.5" fill="#FEF3C7" stroke="#9E1830" strokeWidth="0.5" />

          {/* Tier 3 (Middle Gopuram) */}
          <rect x="11.5" y="22" width="25" height="1.8" rx="0.6" fill="#D4AF37" />
          <path d="M12 23.8 L36 23.8 L38 31 L10 31 Z" fill="#9E1830" stroke="#780E22" strokeWidth="0.8" />
          {/* Carved Pilasters */}
          <line x1="13" y1="24" x2="13" y2="30" stroke="#FDE68A" strokeWidth="1.2" />
          <line x1="17" y1="24" x2="17" y2="30" stroke="#FDE68A" strokeWidth="1.2" />
          <line x1="31" y1="24" x2="31" y2="30" stroke="#FDE68A" strokeWidth="1.2" />
          <line x1="35" y1="24" x2="35" y2="30" stroke="#FDE68A" strokeWidth="1.2" />
          {/* Central Tier Niche */}
          <path d="M21.5 25.5 Q24 24 26.5 25.5 L26.5 30 L21.5 30 Z" fill="#FBBF24" />

          {/* Tier 4 (Mandapam Base & Grand Sanctum Entrance) */}
          <rect x="8.5" y="31" width="31" height="2" rx="0.5" fill="#D4AF37" />
          <rect x="7" y="33" width="34" height="10" rx="1" fill="#780E22" stroke="#580A18" strokeWidth="0.8" />
          {/* Base Pillars */}
          <rect x="9" y="34" width="2.5" height="8" rx="0.5" fill="#FDE68A" />
          <rect x="14" y="34" width="2" height="8" rx="0.5" fill="#FDE68A" />
          <rect x="32" y="34" width="2" height="8" rx="0.5" fill="#FDE68A" />
          <rect x="36.5" y="34" width="2.5" height="8" rx="0.5" fill="#FDE68A" />

          {/* Main Sanctum Doorway (Garbhagriha Gateway) */}
          <path d="M19 43 L19 36 C19 33 29 33 29 36 L29 43 Z" fill="#2E040B" />
          <path d="M18.5 43 L18.5 36 C18.5 32 29.5 32 29.5 36 L29.5 43" stroke="#F59E0B" strokeWidth="1" fill="none" />
          {/* Inner Temple Diya Flame */}
          <circle cx="24" cy="38.5" r="1.6" fill="#EF4444" />
          <circle cx="24" cy="38" r="0.9" fill="#FDE047" />

          {/* Plinth Foundation Steps */}
          <rect x="5" y="43" width="38" height="2" rx="0.8" fill="#D4AF37" />
        </svg>
      );

    case "kerala":
      // Traditional Kettuvallam (Houseboat) gliding through Backwaters framed by Coconut Palms
      return (
        <svg viewBox="0 0 48 48" className={`shrink-0 ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Tropical Morning Sun */}
          <circle cx="36" cy="12" r="5" fill="#FEF08A" opacity="0.9" />
          <circle cx="36" cy="12" r="7" stroke="#FDE047" strokeWidth="0.7" strokeDasharray="2 2" opacity="0.5" fill="none" />

          {/* Gentle Backwater Ripples */}
          <path d="M4 41 Q10 39.5 16 41 T28 41 T40 41 T46 41" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M8 43.5 Q14 42.5 20 43.5 T32 43.5 T42 43.5" stroke="#0284C7" strokeWidth="1" strokeLinecap="round" opacity="0.6" />

          {/* Graceful Coconut Palm Tree */}
          <path d="M11 41 Q8 26 14 13" stroke="#78350F" strokeWidth="2.4" strokeLinecap="round" />
          {/* Coconuts cluster */}
          <circle cx="13" cy="13.5" r="1.4" fill="#713F12" />
          <circle cx="15" cy="14" r="1.2" fill="#854D0E" />
          {/* Tropical Curved Palm Leaves */}
          <path d="M14 12 Q22 7 27 11" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />
          <path d="M14 12 Q19 3 20 0" stroke="#16A34A" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M14 12 Q6 5 2 10" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />
          <path d="M14 12 Q5 12 3 18" stroke="#16A34A" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M14 12 Q17 17 23 18" stroke="#22C55E" strokeWidth="1.6" strokeLinecap="round" />

          {/* Kettuvallam Houseboat Wooden Hull */}
          <path d="M12 39 Q25 43 38 39 L36 34 L14 34 Z" fill="#854D0E" stroke="#5C3405" strokeWidth="0.8" />
          {/* Curved Prow Detail */}
          <path d="M37 39 Q42 37 43 33 Q41.5 32 39 33.5" stroke="#854D0E" strokeWidth="1.2" fill="none" strokeLinecap="round" />

          {/* Arched Thatched Bamboo Canopy Roof */}
          <path d="M15 34 C15 25 35 25 35 34 Z" fill="#D97706" stroke="#92400E" strokeWidth="0.8" />
          {/* Thatched Rib Arches */}
          <path d="M19 34 C19 28 31 28 31 34" stroke="#B45309" strokeWidth="0.7" fill="none" />
          <path d="M23 34 C23 29.5 27 29.5 27 34" stroke="#B45309" strokeWidth="0.7" fill="none" />

          {/* Passenger Cabin Window / Amber Lantern Glow */}
          <rect x="23" y="30.5" width="4" height="2.8" rx="0.6" fill="#FEF3C7" stroke="#92400E" strokeWidth="0.5" />
        </svg>
      );

    case "andhra-pradesh":
      // Sacred Tirumala Tirupati Ananda Nilayam Golden Temple Vimana
      return (
        <svg viewBox="0 0 48 48" className={`shrink-0 ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Golden Pinnacle Spire & Kalasha */}
          <path d="M24 3 L25.5 6 L22.5 6 Z" fill="#F59E0B" />
          <circle cx="24" cy="7.5" r="2" fill="#D97706" stroke="#F59E0B" strokeWidth="0.6" />

          {/* Golden Shikhara Dome */}
          <path d="M17 13 C17 8 31 8 31 13 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="0.8" />
          <path d="M20.5 13 C20.5 9.5 27.5 9.5 27.5 13" stroke="#FEF3C7" strokeWidth="0.8" fill="none" />

          {/* Upper Golden Tier */}
          <rect x="14.5" y="13" width="19" height="1.6" rx="0.5" fill="#D97706" />
          <path d="M15 14.6 L33 14.6 L35 21 L13 21 Z" fill="#FBBF24" stroke="#B45309" strokeWidth="0.8" />
          {/* Sacred Tirumala Vaishnavite Namam (Lord Venkateswara's holy mark) */}
          <path d="M21.5 15.5 L21.5 19 Q24 20.5 26.5 19 L26.5 15.5" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" fill="none" />
          <line x1="24" y1="15" x2="24" y2="19.5" stroke="#DC2626" strokeWidth="1.1" strokeLinecap="round" />

          {/* Middle Golden Tier with Ornate Kudus */}
          <rect x="11.5" y="21" width="25" height="1.8" rx="0.5" fill="#D97706" />
          <path d="M12 22.8 L36 22.8 L38 31 L10 31 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="0.8" />
          <rect x="13.5" y="24.5" width="4" height="5" rx="2" fill="#FEF3C7" stroke="#B45309" strokeWidth="0.5" />
          <rect x="22" y="24.5" width="4" height="5" rx="2" fill="#FEF3C7" stroke="#B45309" strokeWidth="0.5" />
          <rect x="30.5" y="24.5" width="4" height="5" rx="2" fill="#FEF3C7" stroke="#B45309" strokeWidth="0.5" />

          {/* Plinth Mandapam Foundation */}
          <rect x="8.5" y="31" width="31" height="2" rx="0.5" fill="#D97706" />
          <rect x="7" y="33" width="34" height="9.5" rx="1" fill="#EA580C" stroke="#9A3412" strokeWidth="0.8" />
          {/* Pillars */}
          <line x1="11" y1="34" x2="11" y2="41.5" stroke="#FDE68A" strokeWidth="1.5" />
          <line x1="16" y1="34" x2="16" y2="41.5" stroke="#FDE68A" strokeWidth="1.5" />
          <line x1="32" y1="34" x2="32" y2="41.5" stroke="#FDE68A" strokeWidth="1.5" />
          <line x1="37" y1="34" x2="37" y2="41.5" stroke="#FDE68A" strokeWidth="1.5" />

          {/* Sacred Sanctum Doorway with Divine Glow */}
          <path d="M20.5 42.5 L20.5 36.5 C20.5 34.5 27.5 34.5 27.5 36.5 L27.5 42.5 Z" fill="#7C2D12" />
          <circle cx="24" cy="38" r="1.8" fill="#FEF08A" />

          {/* Stepped Stone Plinth */}
          <rect x="5" y="42.5" width="38" height="2" rx="0.5" fill="#F59E0B" />
        </svg>
      );

    case "karnataka":
      // World Heritage Hampi Stone Chariot (Vijayanagara)
      return (
        <svg viewBox="0 0 48 48" className={`shrink-0 ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Top Golden Kalasha */}
          <path d="M24 4 L25.2 7 L22.8 7 Z" fill="#D97706" />

          {/* Stepped Granite Shikhara Tower */}
          <path d="M19 7 L29 7 L31 13 L17 13 Z" fill="#92400E" stroke="#713F12" strokeWidth="0.7" />
          <path d="M15 13 L33 13 L35 19 L13 19 Z" fill="#B45309" stroke="#713F12" strokeWidth="0.7" />
          {/* Stone relief niches */}
          <rect x="17" y="14.5" width="3.5" height="3.5" rx="0.5" fill="#FDE68A" />
          <rect x="27.5" y="14.5" width="3.5" height="3.5" rx="0.5" fill="#FDE68A" />

          {/* Molded Stone Cornice */}
          <rect x="12" y="19" width="24" height="2" rx="0.5" fill="#D97706" />

          {/* Chariot Mandapa Chamber */}
          <rect x="11" y="21" width="26" height="11" rx="1" fill="#78350F" stroke="#451A03" strokeWidth="0.8" />
          {/* Carved stone pillars */}
          <rect x="13" y="22" width="2" height="9" fill="#F59E0B" />
          <rect x="33" y="22" width="2" height="9" fill="#F59E0B" />
          {/* Inner Shrine Arch */}
          <path d="M19.5 32 L19.5 24.5 C19.5 23 28.5 23 28.5 24.5 L28.5 32 Z" fill="#451A03" />
          <circle cx="24" cy="26.5" r="1.5" fill="#FDE047" />

          {/* Chariot Plinth Platform */}
          <rect x="8.5" y="32" width="31" height="2.5" rx="0.5" fill="#D97706" />

          {/* Left Carved Stone Wheel */}
          <g>
            <circle cx="14" cy="38" r="5" fill="#B45309" stroke="#78350F" strokeWidth="1" />
            <circle cx="14" cy="38" r="2.2" fill="#FDE68A" stroke="#78350F" strokeWidth="0.7" />
            <circle cx="14" cy="38" r="0.9" fill="#451A03" />
            {/* Spokes */}
            <line x1="14" y1="33.5" x2="14" y2="42.5" stroke="#78350F" strokeWidth="0.7" />
            <line x1="9.5" y1="38" x2="18.5" y2="38" stroke="#78350F" strokeWidth="0.7" />
          </g>

          {/* Right Carved Stone Wheel */}
          <g>
            <circle cx="34" cy="38" r="5" fill="#B45309" stroke="#78350F" strokeWidth="1" />
            <circle cx="34" cy="38" r="2.2" fill="#FDE68A" stroke="#78350F" strokeWidth="0.7" />
            <circle cx="34" cy="38" r="0.9" fill="#451A03" />
            {/* Spokes */}
            <line x1="34" y1="33.5" x2="34" y2="42.5" stroke="#78350F" strokeWidth="0.7" />
            <line x1="29.5" y1="38" x2="38.5" y2="38" stroke="#78350F" strokeWidth="0.7" />
          </g>

          {/* Elephant guard silhouette / draw-harness prow */}
          <path d="M22 35 L26 35 L25.5 39 L22.5 39 Z" fill="#92400E" />

          {/* Stone courtyard pavement */}
          <line x1="5" y1="43.5" x2="43" y2="43.5" stroke="#B45309" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );

    case "telangana":
      // The Grand Charminar of Hyderabad (Four Soaring Minarets & Monumental Arch)
      return (
        <svg viewBox="0 0 48 48" className={`shrink-0 ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Inner rear minarets rising in perspective */}
          <line x1="19" y1="16" x2="19" y2="9" stroke="#D97706" strokeWidth="1.6" />
          <line x1="29" y1="16" x2="29" y2="9" stroke="#D97706" strokeWidth="1.6" />
          <circle cx="19" cy="8.5" r="1.3" fill="#FDE68A" stroke="#B45309" strokeWidth="0.5" />
          <circle cx="29" cy="8.5" r="1.3" fill="#FDE68A" stroke="#B45309" strokeWidth="0.5" />

          {/* Left Soaring Minaret */}
          <rect x="5.5" y="7" width="4" height="35" fill="#D97706" stroke="#92400E" strokeWidth="0.7" />
          {/* Balconies */}
          <rect x="4.5" y="13" width="6" height="1.6" rx="0.5" fill="#FBBF24" />
          <rect x="4.5" y="23" width="6" height="1.6" rx="0.5" fill="#FBBF24" />
          {/* Fluted Bulbous Dome */}
          <path d="M5.5 7 C5.5 3.5 9.5 3.5 9.5 7 Z" fill="#FDE68A" stroke="#92400E" strokeWidth="0.7" />
          <line x1="7.5" y1="3.5" x2="7.5" y2="1.5" stroke="#B45309" strokeWidth="0.9" strokeLinecap="round" />

          {/* Right Soaring Minaret */}
          <rect x="38.5" y="7" width="4" height="35" fill="#D97706" stroke="#92400E" strokeWidth="0.7" />
          {/* Balconies */}
          <rect x="37.5" y="13" width="6" height="1.6" rx="0.5" fill="#FBBF24" />
          <rect x="37.5" y="23" width="6" height="1.6" rx="0.5" fill="#FBBF24" />
          {/* Fluted Bulbous Dome */}
          <path d="M38.5 7 C38.5 3.5 42.5 3.5 42.5 7 Z" fill="#FDE68A" stroke="#92400E" strokeWidth="0.7" />
          <line x1="40.5" y1="3.5" x2="40.5" y2="1.5" stroke="#B45309" strokeWidth="0.9" strokeLinecap="round" />

          {/* Upper Gallery & Ornate Parapet */}
          <rect x="9.5" y="15" width="29" height="11.5" rx="0.5" fill="#B45309" stroke="#78350F" strokeWidth="0.8" />
          {/* Arched Jharokhas */}
          <path d="M12.5 21 L12.5 17 Q14.5 15.5 16.5 17 L16.5 21 Z" fill="#FEF3C7" />
          <path d="M18.5 21 L18.5 17 Q20.5 15.5 22.5 17 L22.5 21 Z" fill="#FEF3C7" />
          <path d="M25.5 21 L25.5 17 Q27.5 15.5 29.5 17 L29.5 21 Z" fill="#FEF3C7" />
          <path d="M31.5 21 L31.5 17 Q33.5 15.5 35.5 17 L35.5 21 Z" fill="#FEF3C7" />
          {/* Stucco Cornice */}
          <rect x="9" y="26.5" width="30" height="1.5" fill="#FDE68A" />

          {/* Main Monument Gateway Facade */}
          <rect x="9.5" y="28" width="29" height="14" fill="#92400E" stroke="#78350F" strokeWidth="0.8" />
          {/* Grand Central Catenary Arch */}
          <path d="M16.5 42 L16.5 33.5 C16.5 27.5 31.5 27.5 31.5 33.5 L31.5 42 Z" fill="#451A03" />
          <path d="M15.5 42 L15.5 33.5 C15.5 26.5 32.5 26.5 32.5 33.5 L32.5 42" stroke="#FBBF24" strokeWidth="1.2" fill="none" />

          {/* Base Plinth Steps */}
          <rect x="4.5" y="42" width="39" height="2" rx="0.5" fill="#78350F" />
        </svg>
      );

    case "puducherry":
      // Aayi Mandapam (White Neoclassical Memorial Monument) & French Promenade Coastal Waves
      return (
        <svg viewBox="0 0 48 48" className={`shrink-0 ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Golden Finial Crest */}
          <path d="M24 3.5 L25 6 L23 6 Z" fill="#F59E0B" />
          <circle cx="24" cy="7" r="1.3" fill="#D97706" />

          {/* Central Neoclassical Cupola Dome */}
          <path d="M17 13.5 C17 7.5 31 7.5 31 13.5 Z" fill="#F8FAFC" stroke="#0D9488" strokeWidth="1" />
          <path d="M20 13.5 C20 9.5 28 9.5 28 13.5" stroke="#0F766E" strokeWidth="0.7" fill="none" />
          <rect x="15.5" y="13.5" width="17" height="1.8" rx="0.5" fill="#14B8A6" />

          {/* Triangular Greco-Roman Pediment */}
          <path d="M13 19.5 L24 14.5 L35 19.5 Z" fill="#F0FDFA" stroke="#0D9488" strokeWidth="1" />
          <circle cx="24" cy="17.5" r="1.2" fill="#0D9488" />
          {/* Architrave Beam */}
          <rect x="12" y="19.5" width="24" height="2" fill="#14B8A6" />

          {/* Classical Corinthian Fluted Columns */}
          <rect x="13.5" y="21.5" width="2.5" height="15" fill="#F8FAFC" stroke="#0F766E" strokeWidth="0.6" />
          <rect x="18.5" y="21.5" width="2.5" height="15" fill="#F8FAFC" stroke="#0F766E" strokeWidth="0.6" />
          <rect x="27" y="21.5" width="2.5" height="15" fill="#F8FAFC" stroke="#0F766E" strokeWidth="0.6" />
          <rect x="32" y="21.5" width="2.5" height="15" fill="#F8FAFC" stroke="#0F766E" strokeWidth="0.6" />
          {/* Capitals */}
          <rect x="12.5" y="21.5" width="4.5" height="1" fill="#0D9488" />
          <rect x="17.5" y="21.5" width="4.5" height="1" fill="#0D9488" />
          <rect x="26" y="21.5" width="4.5" height="1" fill="#0D9488" />
          <rect x="31" y="21.5" width="4.5" height="1" fill="#0D9488" />

          {/* Central Triumphal Arched Opening */}
          <path d="M21 36.5 L21 27.5 C21 24.5 27 24.5 27 27.5 L27 36.5 Z" fill="#042F2E" />
          <path d="M20.5 36.5 L20.5 27.5 C20.5 23.8 27.5 23.8 27.5 27.5 L27.5 36.5" stroke="#14B8A6" strokeWidth="0.9" fill="none" />
          {/* Sacred Aayi Water Fountain Urn */}
          <path d="M23 33.5 C23 31.5 25 31.5 25 33.5 L25 35.5 L23 35.5 Z" fill="#5EEAD4" />

          {/* Neoclassical Monument Plinth */}
          <rect x="10" y="36.5" width="28" height="2" rx="0.5" fill="#0D9488" />
          <rect x="8" y="38.5" width="32" height="2" rx="0.5" fill="#0F766E" />

          {/* Coromandel Promenade Ocean Waves */}
          <path d="M5 42.5 Q11 40.5 17 42.5 T29 42.5 T41 42.5" stroke="#38BDF8" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M9 44.5 Q15 43.5 21 44.5 T33 44.5 T43 44.5" stroke="#0284C7" strokeWidth="0.9" strokeLinecap="round" opacity="0.6" />
        </svg>
      );

    default:
      return null;
  }
}

export function DeliveryReachBanner() {
  const [selectedState, setSelectedState] = useState<StateCoverage | null>(null);
  const [districtSearch, setDistrictSearch] = useState("");

  const filteredDistricts = selectedState
    ? selectedState.allDistricts.filter((d) =>
        d.toLowerCase().includes(districtSearch.toLowerCase().trim())
      )
    : [];

  return (
    <section aria-labelledby="delivery-reach-heading" className="relative w-full bg-brand-surface-alt py-12 sm:py-16 border-y border-brand-accent/35 font-sans overflow-hidden">
      
      {/* Soft Ambient Radial Corner Accents */}
      <div className="pointer-events-none absolute -left-12 -top-12 w-52 h-52 rounded-full bg-brand-green/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 -top-12 w-52 h-52 rounded-full bg-brand-accent/15 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] px-4 sm:px-6 lg:px-8">
        
        {/* Unified Editorial 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Organic Scenic Landscape with South India Map */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-[500px] aspect-[1/1.1] rounded-3xl overflow-hidden shadow-xl border-2 border-brand-accent/60 bg-gradient-to-b from-brand-surface-bright via-[#FFF9ED] to-[#FFF3DC] group">
              
              {/* Scenic Landscape Backdrop with Road, Truck, Incense, and Temple */}
              <div className="absolute inset-0">
                <Image
                  src="/images/delivery_reach_scenic_bg.jpg"
                  alt="Scenic South India Western Ghats landscape with delivery truck and temple"
                  fill
                  className="object-cover object-bottom"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/40 pointer-events-none" />
              </div>

              {/* South India Map Layered Above */}
              <div className="relative z-10 w-full h-[90%] p-2 drop-shadow-2xl transition-transform duration-700 group-hover:scale-[1.03]">
                <Image
                  src="/images/South India Delivery Network Map.png"
                  alt="HM BRAND South India Delivery Network Map covering 100+ districts across Tamil Nadu, Kerala, Andhra Pradesh, Karnataka, Telangana and Puducherry"
                  fill
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-contain"
                  priority
                />
              </div>

              {/* Bottom Subtle Bar on Map Card */}
              <div className="absolute bottom-2 left-3 right-3 z-20 flex items-center justify-between gap-2 rounded-xl border border-white/80 bg-white/95 px-3 py-1.5 text-xs shadow-md backdrop-blur-xs">
                <div className="flex items-center gap-1.5 text-ui-11 font-bold text-brand-ink">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary text-white">
                    <Truck size={11} />
                  </span>
                  <span>100+ Districts Connected</span>
                </div>
                <span className="text-ui-10 font-bold text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-full">
                  Direct from Coimbatore
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Heading, Trust Badges, Tip Bar & 6 State Cards */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Eyebrow */}
            <div className="flex items-center gap-2">
              <span className="font-brand text-xs sm:text-sm font-bold tracking-[0.24em] text-brand-primary uppercase">
                OUR REACH
              </span>
              <span className="text-brand-orange text-sm">🪷</span>
            </div>

            {/* Title & Description */}
            <div>
              <h2
                id="delivery-reach-heading"
                className="font-brand text-xl sm:text-2xl lg:text-3xl font-bold tracking-wide text-brand-heading leading-tight uppercase"
              >
                Connecting Fragrance to{" "}
                <span className="text-brand-primary">100+ Districts</span>
              </h2>
              <p className="mt-2 font-sans text-xs sm:text-sm leading-relaxed text-brand-slate font-normal">
                Delivering the divine aroma of HM BRAND across Tamil Nadu, Kerala, Andhra Pradesh,
                Karnataka, Telangana, and Puducherry with safe, reliable and doorstep delivery.
              </p>
            </div>

            {/* Two Trust Badges - 2-Column Horizontal Grid on Mobile & Desktop */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3.5 pt-1">
              
              {/* Badge 1: 100+ Districts Connected */}
              <div className="flex items-center gap-2 sm:gap-2.5 rounded-2xl border border-emerald-600/30 bg-[#F0FDF4] p-2 sm:p-2.5 shadow-xs">
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-emerald-700/15 text-emerald-800 shrink-0">
                  <Truck size={16} className="stroke-[2.2]" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block truncate text-[11px] sm:text-xs font-extrabold text-emerald-950 leading-tight">
                    100+ Districts
                  </span>
                  <span className="block text-[10px] sm:text-ui-11 font-medium text-emerald-800/90 leading-tight truncate mt-0.5">
                    Doorstep Delivery
                  </span>
                </div>
              </div>

              {/* Badge 2: Direct from Coimbatore */}
              <div className="flex items-center gap-2 sm:gap-2.5 rounded-2xl border border-amber-600/30 bg-[#FFFBEB] p-2 sm:p-2.5 shadow-xs">
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-amber-700/15 text-amber-800 shrink-0">
                  <Leaf size={16} className="stroke-[2.2]" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block truncate text-[11px] sm:text-xs font-extrabold text-amber-950 leading-tight">
                    Direct Coimbatore
                  </span>
                  <span className="block text-[10px] sm:text-ui-11 font-medium text-amber-800/90 leading-tight truncate mt-0.5">
                    Fresh Dispatch
                  </span>
                </div>
              </div>

            </div>

            {/* Tip Box Bar - High-Contrast Visible Colors */}
            <div className="rounded-xl sm:rounded-full bg-[#FFF8E7] px-3.5 py-2 text-[11px] sm:text-xs text-[#4A3B32] border border-[#D4AF37]/50 flex items-center gap-2 shadow-2xs">
              <span className="text-sm shrink-0 leading-none">💡</span>
              <p className="leading-snug">
                <strong className="text-[#9E1830] font-bold">Tip:</strong> Tap any state card below to inspect full district reach &amp; transit timelines.
              </p>
            </div>

            {/* State Selection Header - High-Contrast Deep Ink & Crimson */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#173B3A] leading-tight">
                SELECT YOUR STATE TO VIEW DISTRICT REACH
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#9E1830] text-white text-[10px] sm:text-xs font-bold tracking-wide shadow-xs shrink-0 whitespace-nowrap">
                6 States &amp; UTs
              </span>
            </div>

            {/* 6 Interactive State Cards - Balanced 2-Column Grid on Mobile & Desktop */}
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
              {SOUTH_INDIA_STATES.map((state) => (
                <button
                  key={state.id}
                  type="button"
                  onClick={() => {
                    setSelectedState(state);
                    setDistrictSearch("");
                  }}
                  className="group relative flex flex-col justify-between rounded-2xl border border-[#DECDB3] bg-white hover:bg-[#FFFDF9] p-2.5 sm:p-3 text-left shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-[#9E1830] hover:shadow-md active:scale-[0.98] cursor-pointer"
                >
                  {/* Top Row: Landmark Icon on Left, Arrow CTA on Right */}
                  <div className="flex items-center justify-between w-full">
                    <div className="grid h-10 w-10 sm:h-11 sm:w-11 shrink-0 place-items-center rounded-xl bg-[#FFF9EC] border border-[#EADBBD] shadow-2xs group-hover:scale-105 transition-transform p-1">
                      <StateLandmarkIcon stateId={state.id} className="h-7 w-7 sm:h-8 sm:w-8" />
                    </div>

                    <span className="flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full bg-[#9E1830] text-white shadow-xs transition-transform group-hover:translate-x-0.5 group-hover:scale-110">
                      <ArrowRight size={12} />
                    </span>
                  </div>

                  {/* Bottom Content: Full Width Title & Details */}
                  <div className="mt-2 min-w-0 w-full">
                    <h3 className="font-playfair text-xs sm:text-sm font-bold text-[#173B3A] group-hover:text-[#9E1830] transition leading-tight truncate">
                      {state.name}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] font-semibold text-[#5D4A3E] mt-0.5 truncate">
                      {state.districtsCount} Districts
                    </p>
                    <span className="text-[9px] sm:text-[10px] text-[#0F5132] font-bold flex items-center gap-1 mt-0.5 truncate">
                      <Truck size={10} className="shrink-0 text-emerald-700" />
                      <span className="truncate">{state.dispatchTime.replace("express courier", "express").replace("express shipping", "express").replace("direct delivery", "direct").replace("tracked delivery", "tracked").replace("from dispatch", "")}</span>
                    </span>
                  </div>
                </button>
              ))}
            </div>

          </div>

        </div>

      </div>

      {/* State District Explorer Modal */}
      {selectedState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg max-h-[85vh] overflow-hidden rounded-3xl border-2 border-brand-accent bg-brand-surface-bright p-6 shadow-2xl flex flex-col space-y-4">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-brand-accent/40 pb-3">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-surface border border-brand-accent/60 shadow-xs">
                  <StateLandmarkIcon stateId={selectedState.id} />
                </div>
                <div>
                  <h3 className="font-playfair text-xl font-bold text-brand-ink">
                    {selectedState.name} Delivery Reach
                  </h3>
                  <p className="text-xs font-semibold text-brand-ink/70">
                    {selectedState.districtsCount} Districts • {selectedState.dispatchTime}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedState(null)}
                aria-label="Close modal"
                className="rounded-full p-1.5 text-brand-ink hover:bg-brand-primary hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* District Search Filter */}
            <div className="relative">
              <input
                type="text"
                value={districtSearch}
                onChange={(e) => setDistrictSearch(e.target.value)}
                placeholder={`Search districts in ${selectedState.name}...`}
                className="w-full rounded-full border border-brand-accent/70 bg-white py-2 pl-9 pr-4 text-xs font-semibold text-brand-ink placeholder:text-brand-charcoal/50 focus:border-brand-primary focus:outline-none"
              />
              <Search size={14} className="pointer-events-none absolute left-3 top-2.5 text-brand-primary" />
              {districtSearch && (
                <button
                  type="button"
                  onClick={() => setDistrictSearch("")}
                  className="absolute right-3 top-2.5 text-xs text-brand-charcoal/60 hover:text-black"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Districts List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[300px]">
              {filteredDistricts.length === 0 ? (
                <p className="py-6 text-center text-xs font-bold text-brand-brown/70">
                  No district found matching &quot;{districtSearch}&quot;. All pincodes in{" "}
                  {selectedState.name} are covered by our courier network.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {filteredDistricts.map((district) => (
                    <div
                      key={district}
                      className="flex items-center gap-1.5 rounded-xl border border-brand-accent/40 bg-white p-2 text-xs font-bold text-brand-ink"
                    >
                      <CheckCircle size={13} className="text-brand-green-deep shrink-0" />
                      <span className="break-words">{district}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer CTA */}
            <div className="border-t border-brand-accent/40 pt-3 flex flex-wrap items-center justify-between gap-2">
              <span className="text-ui-11 font-semibold text-brand-ink/70">
                Safe transit &amp; doorstep delivery guaranteed.
              </span>
              <Link
                href="/shop"
                onClick={() => setSelectedState(null)}
                className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary hover:bg-brand-orange px-4 py-2 text-xs font-bold text-white shadow-md transition"
              >
                <span>Shop Fragrances</span>
                <ArrowRight size={13} />
              </Link>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
