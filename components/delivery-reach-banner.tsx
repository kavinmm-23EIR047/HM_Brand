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

/* Custom Vector Landmark Art for each State */
function StateLandmarkIcon({ stateId }: { stateId: string }) {
  switch (stateId) {
    case "tamil-nadu":
      // Red Dravidian Gopuram Tower
      return (
        <svg viewBox="0 0 40 40" className="h-8 w-8 text-[#9E1830]" fill="currentColor">
          <path d="M20 2L15 7h10l-5-5zm-5 6l-2 5h14l-2-5H15zm-3 6l-2 5h18l-2-5H12zm-3 6l-2 6h22l-2-6H9zm-2 7l-2 6h26l-2-6H7zm6 7v6h14v-6H13zm2 2h4v4h-4v-4zm6 0h4v4h-4v-4z" />
        </svg>
      );
    case "kerala":
      // Tropical Palm Trees & Backwaters
      return (
        <svg viewBox="0 0 40 40" className="h-8 w-8 text-[#2F855A]" fill="currentColor">
          <path d="M19 4c2 3 5 4 8 3-1 3-3 5-6 6 4 1 7 0 9-2-1 4-4 6-8 6 3 3 7 3 10 2-2 3-5 4-9 4v10h-2V17c-4 0-7-1-9-4 3 1 7 1 10-2-4 0-7-2-8-6 2 2 5 3 9 2-3-1-5-3-6-6 3 1 6 0 8-3zm-13 25l3-3h16l3 3-2 3H8l-2-3zm8-2h6v2h-6v-2z" />
        </svg>
      );
    case "andhra-pradesh":
      // Golden Tirupati Temple
      return (
        <svg viewBox="0 0 40 40" className="h-8 w-8 text-[#D97706]" fill="currentColor">
          <path d="M20 3l-6 6h12l-6-6zm-7 7l-2 4h18l-2-4H13zm-3 5l-2 5h22l-2-5H10zm-3 6l-2 6h28l-2-6H7zm6 7v6h14v-6H13zm2 2h4v4h-4v-4zm6 0h4v4h-4v-4z" />
        </svg>
      );
    case "karnataka":
      // Ancient Stone Chariot / Temple
      return (
        <svg viewBox="0 0 40 40" className="h-8 w-8 text-[#854D0E]" fill="currentColor">
          <path d="M20 4l-4 5h8l-4-5zm-8 6l-2 4h20l-2-4H12zm-4 5v14h4v-3h16v3h4V15H8zm5 3h3v5h-3v-5zm6 0h4v5h-4v-5zm7 0h3v5h-3v-5zm-14 8h16v3H12v-3zm-4 4h4v3H8v-3zm20 0h4v3h-4v-3z" />
        </svg>
      );
    case "telangana":
      // Charminar with 4 Minarets
      return (
        <svg viewBox="0 0 40 40" className="h-8 w-8 text-[#B45309]" fill="currentColor">
          <path d="M7 6l2-2 2 2v7H7V6zm22 0l2-2 2 2v7h-4V6zM9 14h22v2H9v-2zm-2 3h5v15H7V17zm21 0h5v15h-5V17zm-14 2h10v5a5 5 0 01-10 0v-5zm2 7a3 3 0 006 0v6H16v-6z" />
        </svg>
      );
    case "puducherry":
      // French Promenade Dome Monument
      return (
        <svg viewBox="0 0 40 40" className="h-8 w-8 text-[#0D9488]" fill="currentColor">
          <path d="M20 4a9 9 0 00-9 9v2h18v-2a9 9 0 00-9-9zm-10 12h20v2H10v-2zm2 3h3v11h-3V19zm5 0h6v11h-6V19zm8 0h3v11h-3V19zM8 31h24v3H8v-3z" />
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
    <section aria-labelledby="delivery-reach-heading" className="relative w-full bg-[#FAF7EE] py-12 sm:py-16 border-y border-[#F6C84C]/35 font-sans overflow-hidden">
      
      {/* Soft Ambient Radial Corner Accents */}
      <div className="pointer-events-none absolute -left-12 -top-12 w-52 h-52 rounded-full bg-[#3F7D45]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 -top-12 w-52 h-52 rounded-full bg-[#F6C84C]/15 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] px-4 sm:px-6 lg:px-8">
        
        {/* Unified Editorial 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Organic Scenic Landscape with South India Map */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-[500px] aspect-[1/1.1] rounded-3xl overflow-hidden shadow-xl border-2 border-[#F6C84C]/60 bg-gradient-to-b from-[#FFFDF8] via-[#FFF9ED] to-[#FFF3DC] group">
              
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
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#173B3A]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#9E1830] text-white">
                    <Truck size={11} />
                  </span>
                  <span>100+ Districts Connected</span>
                </div>
                <span className="text-[10px] font-bold text-[#3F7D45] bg-[#3F7D45]/10 px-2 py-0.5 rounded-full">
                  Direct from Coimbatore
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Heading, Trust Badges, Tip Bar & 6 State Cards */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Eyebrow */}
            <div className="flex items-center gap-2">
              <span className="font-brand text-xs sm:text-sm font-bold tracking-[0.24em] text-[#9E1830] uppercase">
                OUR REACH
              </span>
              <span className="text-[#F47A20] text-sm">🪷</span>
            </div>

            {/* Title & Description */}
            <div>
              <h2
                id="delivery-reach-heading"
                className="font-brand text-xl sm:text-2xl lg:text-3xl font-bold tracking-wide text-[#111827] leading-tight uppercase"
              >
                Connecting Fragrance to{" "}
                <span className="text-[#9E1830]">100+ Districts</span>
              </h2>
              <p className="mt-2 font-sans text-xs sm:text-sm leading-relaxed text-[#374151] font-normal">
                Delivering the divine aroma of HM BRAND across Tamil Nadu, Kerala, Andhra Pradesh,
                Karnataka, Telangana, and Puducherry with safe, reliable and doorstep delivery.
              </p>
            </div>

            {/* Two Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              
              {/* Badge 1: 100+ Districts Connected */}
              <div className="flex items-center gap-3 rounded-2xl border border-[#3F7D45]/25 bg-[#EFF7ED] p-3 shadow-2xs">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3F7D45]/15 text-[#3F7D45] shrink-0">
                  <Truck size={18} />
                </div>
                <div className="min-w-0">
                  <span className="block text-xs font-bold text-[#173B3A] truncate">
                    100+ Districts Connected
                  </span>
                  <span className="block text-[11px] text-[#173B3A]/70 truncate">
                    Reliable and wide delivery network
                  </span>
                </div>
              </div>

              {/* Badge 2: Direct from Coimbatore */}
              <div className="flex items-center gap-3 rounded-2xl border border-[#F47A20]/25 bg-[#FFF6EA] p-3 shadow-2xs">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F47A20]/15 text-[#F47A20] shrink-0">
                  <Leaf size={18} />
                </div>
                <div className="min-w-0">
                  <span className="block text-xs font-bold text-[#173B3A] truncate">
                    Direct from Coimbatore
                  </span>
                  <span className="block text-[11px] text-[#173B3A]/70 truncate">
                    Freshly packed from our home to yours
                  </span>
                </div>
              </div>

            </div>

            {/* Tip Box Bar */}
            <div className="rounded-full bg-[#FFF8E7] px-4 py-2 text-xs text-[#173B3A]/80 border border-[#F6C84C]/50 flex items-center gap-2 shadow-2xs">
              <span className="text-base leading-none">💡</span>
              <span className="text-[11px] sm:text-xs">
                <strong>Tip:</strong> Click on any state card to view district reach and estimated delivery timelines.
              </span>
            </div>

            {/* State Selection Header */}
            <div className="flex items-center justify-between pt-1">
              <span className="font-space text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#173B3A]/80">
                SELECT YOUR STATE TO VIEW DISTRICT REACH
              </span>
              <span className="font-space text-xs font-bold text-[#9E1830]">
                6 States &amp; UTs
              </span>
            </div>

            {/* 6 Interactive State Cards Grid (2 cols x 3 rows) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SOUTH_INDIA_STATES.map((state) => (
                <button
                  key={state.id}
                  type="button"
                  onClick={() => {
                    setSelectedState(state);
                    setDistrictSearch("");
                  }}
                  className="group relative flex items-center justify-between gap-3 rounded-2xl border border-[#E8DFC9] bg-white p-3 text-left shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-[#9E1830] hover:shadow-md active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#FAF7EE] border border-[#F6C84C]/40 shadow-2xs group-hover:scale-105 transition-transform">
                      <StateLandmarkIcon stateId={state.id} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-playfair text-sm sm:text-base font-bold text-[#173B3A] group-hover:text-[#9E1830] transition leading-snug truncate">
                        {state.name}
                      </h3>
                      <p className="text-[11px] font-semibold text-[#173B3A]/75">
                        {state.districtsCount} Districts Covered
                      </p>
                      <span className="text-[10px] text-[#2F855A] font-bold flex items-center gap-1 mt-0.5">
                        <Truck size={11} className="shrink-0" />
                        <span>{state.dispatchTime}</span>
                      </span>
                    </div>
                  </div>

                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#9E1830] text-white shadow-xs transition-transform group-hover:translate-x-0.5 group-hover:scale-110">
                    <ArrowRight size={13} />
                  </span>
                </button>
              ))}
            </div>

          </div>

        </div>

      </div>

      {/* State District Explorer Modal */}
      {selectedState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg max-h-[85vh] overflow-hidden rounded-3xl border-2 border-[#F6C84C] bg-[#FFFDF8] p-6 shadow-2xl flex flex-col space-y-4">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#F6C84C]/40 pb-3">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#FFF8E7] border border-[#F6C84C]/60 shadow-xs">
                  <StateLandmarkIcon stateId={selectedState.id} />
                </div>
                <div>
                  <h3 className="font-playfair text-xl font-bold text-[#173B3A]">
                    {selectedState.name} Delivery Reach
                  </h3>
                  <p className="text-xs font-semibold text-[#173B3A]/70">
                    {selectedState.districtsCount} Districts • {selectedState.dispatchTime}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedState(null)}
                aria-label="Close modal"
                className="rounded-full p-1.5 text-[#173B3A] hover:bg-[#9E1830] hover:text-white transition"
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
                className="w-full rounded-full border border-[#F6C84C]/70 bg-white py-2 pl-9 pr-4 text-xs font-semibold text-[#173B3A] placeholder:text-[#292524]/50 focus:border-[#9E1830] focus:outline-none"
              />
              <Search size={14} className="pointer-events-none absolute left-3 top-2.5 text-[#9E1830]" />
              {districtSearch && (
                <button
                  type="button"
                  onClick={() => setDistrictSearch("")}
                  className="absolute right-3 top-2.5 text-xs text-[#292524]/60 hover:text-black"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Districts List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[300px]">
              {filteredDistricts.length === 0 ? (
                <p className="py-6 text-center text-xs font-bold text-[#6B4226]/70">
                  No district found matching &quot;{districtSearch}&quot;. All pincodes in{" "}
                  {selectedState.name} are covered by our courier network.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {filteredDistricts.map((district) => (
                    <div
                      key={district}
                      className="flex items-center gap-1.5 rounded-xl border border-[#F6C84C]/40 bg-white p-2 text-xs font-bold text-[#173B3A]"
                    >
                      <CheckCircle size={13} className="text-[#2F855A] shrink-0" />
                      <span className="truncate">{district}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer CTA */}
            <div className="border-t border-[#F6C84C]/40 pt-3 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-[#173B3A]/70">
                Safe transit &amp; doorstep delivery guaranteed.
              </span>
              <Link
                href="/shop"
                onClick={() => setSelectedState(null)}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#9E1830] hover:bg-[#F47A20] px-4 py-2 text-xs font-bold text-white shadow-md transition"
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
