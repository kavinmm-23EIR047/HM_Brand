"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Truck,
  Package,
  CheckCircle,
  MapPin,
  Search,
  ChevronRight,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface StateCoverage {
  id: string;
  name: string;
  tagline: string;
  districtsCount: number;
  dispatchTime: string;
  accentColor: string;
  sampleDistricts: string[];
  allDistricts: string[];
}

const SOUTH_INDIA_STATES: StateCoverage[] = [
  {
    id: "tamil-nadu",
    name: "Tamil Nadu",
    tagline: "Home of Sacred Gopurams & Coimbatore Hub",
    districtsCount: 38,
    dispatchTime: "24-48 hrs fast dispatch",
    accentColor: "#9E1830",
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
    dispatchTime: "2-3 days express courier",
    accentColor: "#D97706",
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
    dispatchTime: "2-3 days direct delivery",
    accentColor: "#EA580C",
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
    dispatchTime: "24-48 hrs express shipping",
    accentColor: "#2F855A",
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
    dispatchTime: "2-3 days tracked delivery",
    accentColor: "#B45309",
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
    dispatchTime: "24-48 hrs safe transit",
    accentColor: "#0D9488",
    sampleDistricts: ["Puducherry", "Karaikal", "Mahe", "Yanam"],
    allDistricts: ["Puducherry", "Karaikal", "Mahe", "Yanam"],
  },
];

/* Custom SVG Icons reflecting the state landmark art in the banner */
function StateLandmarkIcon({ stateId }: { stateId: string }) {
  switch (stateId) {
    case "tamil-nadu":
      // Gopuram Temple Tower
      return (
        <svg viewBox="0 0 40 40" className="h-8 w-8 text-[#A90C35]" fill="currentColor">
          <path d="M20 2L15 8h10l-5-6zm-6 7l-2 5h16l-2-5H14zm-3 6l-2 6h22l-2-6H11zm-3 7l-3 8h29l-3-8H8zm6 9v7h12v-7H14zm2 2h3v5h-3v-5zm5 0h3v5h-3v-5z" opacity="0.95" />
        </svg>
      );
    case "kerala":
      // Coconut Palm & Backwaters Boat
      return (
        <svg viewBox="0 0 40 40" className="h-8 w-8 text-[#D97706]" fill="currentColor">
          <path d="M19 4c2 3 5 4 8 3-1 3-3 5-6 6 4 1 7 0 9-2-1 4-4 6-8 6 3 3 7 3 10 2-2 3-5 4-9 4v10h-2V17c-4 0-7-1-9-4 3 1 7 1 10-2-4 0-7-2-8-6 2 2 5 3 9 2-3-1-5-3-6-6 3 1 6 0 8-3zm-13 25l3-3h16l3 3-2 3H8l-2-3zm8-2h6v2h-6v-2z" opacity="0.95" />
        </svg>
      );
    case "andhra-pradesh":
      // Tirupati Temple Shrine
      return (
        <svg viewBox="0 0 40 40" className="h-8 w-8 text-[#EA580C]" fill="currentColor">
          <path d="M20 3l-6 6h12l-6-6zm-7 7l-2 4h18l-2-4H13zm-3 5l-2 5h22l-2-5H10zm-3 6l-2 6h28l-2-6H7zm6 7v6h14v-6H13zm2 2h4v4h-4v-4zm6 0h4v4h-4v-4z" opacity="0.95" />
        </svg>
      );
    case "karnataka":
      // Mysore Palace & Stone Chariot
      return (
        <svg viewBox="0 0 40 40" className="h-8 w-8 text-[#2F855A]" fill="currentColor">
          <path d="M20 4l-4 5h8l-4-5zm-8 6l-2 4h20l-2-4H12zm-4 5v14h4v-3h16v3h4V15H8zm5 3h3v5h-3v-5zm6 0h4v5h-4v-5zm7 0h3v5h-3v-5zm-14 8h16v3H12v-3zm-4 4h4v3H8v-3zm20 0h4v3h-4v-3z" opacity="0.95" />
        </svg>
      );
    case "telangana":
      // Charminar Arches & Minarets
      return (
        <svg viewBox="0 0 40 40" className="h-8 w-8 text-[#B45309]" fill="currentColor">
          <path d="M7 6l2-2 2 2v7H7V6zm22 0l2-2 2 2v7h-4V6zM9 14h22v2H9v-2zm-2 3h5v15H7V17zm21 0h5v15h-5V17zm-14 2h10v5a5 5 0 01-10 0v-5zm2 7a3 3 0 006 0v6H16v-6z" opacity="0.95" />
        </svg>
      );
    case "puducherry":
      // French Promenade Heritage Dome
      return (
        <svg viewBox="0 0 40 40" className="h-8 w-8 text-[#0D9488]" fill="currentColor">
          <path d="M20 4a9 9 0 00-9 9v2h18v-2a9 9 0 00-9-9zm-10 12h20v2H10v-2zm2 3h3v11h-3V19zm5 0h6v11h-6V19zm8 0h3v11h-3V19zM8 31h24v3H8v-3z" opacity="0.95" />
        </svg>
      );
    default:
      return <MapPin className="h-8 w-8 text-[#9E1830]" />;
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
    <section aria-labelledby="delivery-reach-heading" className="w-full bg-[#FFF4D6] py-8 sm:py-12">
      <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-8">
        
        {/* Main Banner Card with Traditional Borders & Background Glow */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-[#F6C84C]/70 bg-gradient-to-br from-[#FFFDF8] via-[#FFF9ED] to-[#FFF3DC] p-5 sm:p-8 lg:p-10 shadow-[0_15px_40px_-15px_rgba(107,66,38,0.2)]">
          
          {/* Subtle Golden Botanical Background Embellishments */}
          <div className="pointer-events-none absolute -left-12 -top-12 h-64 w-64 rounded-full bg-[#F6C84C]/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-[#9E1830]/15 blur-3xl" />

          {/* Side-by-Side Unified Delivery Reach Layout */}
          <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
            
            {/* Left Column: South India Delivery Network Map */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-full max-w-[460px] overflow-hidden rounded-3xl border-2 border-[#F6C84C]/80 bg-gradient-to-b from-[#FFFDF8] via-[#FFF9ED] to-[#FFF3DC] p-3 sm:p-4 shadow-xl group">
                
                {/* Glowing Aura behind Map */}
                <div className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-[#F6C84C]/25 blur-2xl" />
                <div className="pointer-events-none absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-[#9E1830]/20 blur-2xl" />

                <div className="relative aspect-[1167/1347] w-full overflow-hidden rounded-2xl bg-white/50 border border-[#F6C84C]/40 shadow-inner flex items-center justify-center">
                  <Image
                    src="/images/South India Delivery Network Map.png"
                    alt="HM BRAND South India Delivery Network Map covering 100+ districts across Tamil Nadu, Kerala, Andhra Pradesh, Karnataka, Telangana and Puducherry"
                    fill
                    sizes="(max-width: 1024px) 100vw, 460px"
                    className="object-contain object-center transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                </div>

                {/* Bottom Trust Ribbon on Map Card */}
                <div className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-[#F6C84C]/60 bg-white/95 px-3 py-2 text-xs shadow-2xs backdrop-blur-xs">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#9E1830] text-white shadow-xs">
                      <Truck size={14} />
                    </span>
                    <span className="font-extrabold text-[#173B3A] text-[11px] sm:text-xs">
                      100+ Districts Connected
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-[#3F7D45] bg-[#3F7D45]/10 px-2 py-0.5 rounded-full">
                    Direct from Coimbatore
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Heading, Trust Badges & 6 Interactive State Cards */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Traditional Eyebrow */}
              <div className="flex items-center gap-2">
                <span className="font-space text-xs font-black tracking-[.25em] text-[#9E1830] uppercase">
                  OUR REACH
                </span>
                <span className="inline-block h-px w-10 bg-[#C89B3C]" />
                <span className="text-xs">🪔</span>
              </div>

              {/* Title & Description */}
              <div>
                <h2
                  id="delivery-reach-heading"
                  className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#173B3A] leading-tight"
                >
                  Connecting Fragrance to{" "}
                  <span className="text-[#9E1830] underline decoration-[#F6C84C] decoration-wavy decoration-2">
                    100+ Districts
                  </span>
                </h2>
                <p className="mt-2 font-sans text-xs sm:text-sm leading-relaxed text-[#292524]/80">
                  Delivering the divine aroma of HM BRAND across Tamil Nadu, Kerala, Andhra Pradesh,
                  Karnataka, Telangana, and Puducherry directly to your doorstep.
                </p>
              </div>

              {/* Delivery Guarantees Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <div className="flex items-center gap-2.5 rounded-xl border border-[#F6C84C]/60 bg-white/95 p-2.5 shadow-2xs">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#9E1830]/10 text-[#9E1830] shrink-0">
                    <Truck size={17} />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-black text-[#173B3A] truncate">
                      100+ Districts Connected
                    </span>
                    <span className="block text-[10px] font-semibold text-[#6B4226] truncate">
                      Reliable Postal &amp; Courier Network
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 rounded-xl border border-[#F6C84C]/60 bg-white/95 p-2.5 shadow-2xs">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3F7D45]/10 text-[#3F7D45] shrink-0">
                    <Package size={17} />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-black text-[#173B3A] truncate">
                      Direct from Coimbatore
                    </span>
                    <span className="block text-[10px] font-semibold text-[#3F7D45] truncate">
                      Freshly Packed &amp; Fragrance-Sealed
                    </span>
                  </div>
                </div>
              </div>

              {/* Tip Box */}
              <div className="rounded-xl bg-[#FFF8E7] px-3 py-2 text-[11px] text-[#6B4226] border border-[#C89B3C]/30 flex items-center gap-2">
                <ShieldCheck size={15} className="text-[#9E1830] shrink-0" />
                <span>
                  <strong>Tip:</strong> Click on any state card to inspect the full list of covered
                  districts and verified courier pincodes.
                </span>
              </div>

              {/* State Selection Header */}
              <div className="flex items-center justify-between pt-1">
                <span className="font-space text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#6B4226]">
                  SELECT YOUR STATE TO VIEW DISTRICT REACH
                </span>
                <span className="text-[11px] font-bold text-[#9E1830]">
                  6 States &amp; UTs
                </span>
              </div>

              {/* 6 Interactive State Pills Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SOUTH_INDIA_STATES.map((state) => (
                  <button
                    key={state.id}
                    type="button"
                    onClick={() => {
                      setSelectedState(state);
                      setDistrictSearch("");
                    }}
                    className="group relative flex items-center justify-between gap-3 rounded-2xl border-2 border-[#F6C84C]/50 bg-white/95 p-3 text-left shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-[#9E1830] hover:shadow-md active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#FFF8E7] border border-[#F6C84C]/50 shadow-2xs group-hover:scale-110 transition-transform">
                        <StateLandmarkIcon stateId={state.id} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-heading text-sm font-extrabold text-[#173B3A] group-hover:text-[#9E1830] transition leading-snug truncate">
                          {state.name}
                        </h3>
                        <p className="text-[11px] font-semibold text-[#6B4226]">
                          {state.districtsCount} Districts Covered
                        </p>
                        <span className="text-[10px] text-[#2F855A] font-bold block">
                          ⚡ {state.dispatchTime}
                        </span>
                      </div>
                    </div>

                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#9E1830] text-white shadow-xs transition-transform group-hover:translate-x-0.5 group-hover:scale-110">
                      <ChevronRight size={13} />
                    </span>
                  </button>
                ))}
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* State District Explorer Modal */}
      {selectedState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg max-h-[85vh] overflow-hidden rounded-3xl border-2 border-[#F6C84C] bg-[#FFFDF8] p-6 shadow-2xl flex flex-col space-y-4">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#F6C84C]/40 pb-3">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#FFF8E7] border border-[#F6C84C]/60 shadow-xs">
                  <StateLandmarkIcon stateId={selectedState.id} />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-extrabold text-[#173B3A]">
                    {selectedState.name} Delivery Reach
                  </h3>
                  <p className="text-xs font-semibold text-[#6B4226]">
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
              <span className="text-[11px] font-semibold text-[#6B4226]">
                Safe transit &amp; doorstep delivery guaranteed.
              </span>
              <Link
                href={`/shop`}
                onClick={() => setSelectedState(null)}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#9E1830] hover:bg-[#F47A20] px-4 py-2 text-xs font-extrabold text-white shadow-md transition"
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
