import React from "react";

type Kind = "incense" | "camphor" | "sambrani" | "loban" | "sandalwood" | "diya" | "gift" | "natural" | "clean" | "chemical-free" | "india";

/** Small flat vector scenes used in place of generic interface icons or stock thumbnails. */
export function RitualArt({ kind, className = "" }: { kind: Kind; className?: string }) {
  const common = { stroke: "#276a43", strokeWidth: 2.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 120 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {kind === "incense" && <>
        <path d="M37 67 49 17M48 69 57 12M59 70 65 18M70 70 74 25" stroke="#512d2a" strokeWidth="3" strokeLinecap="round" />
        <path d="M48 17c-4-5 4-6 0-11m17 12c-4-5 4-6 0-11m9 21c-4-5 4-6 0-11" stroke="#8e8d7b" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M23 72c8 14 57 14 68 0l-7 14H32l-9-14Z" fill="#b83c30" stroke="#71332b" strokeWidth="2" />
        <ellipse cx="57" cy="71" rx="35" ry="7" fill="#e58d35" stroke="#71332b" strokeWidth="2" />
        <path d="M22 61c-8-8-15-3-15 4 9 3 14 2 15-4Zm69 0c8-8 15-3 15 4-9 3-14 2-15-4Z" fill="#4f9c53" />
        <circle cx="19" cy="59" r="5" fill="#f2c64f" /><circle cx="94" cy="58" r="5" fill="#f2c64f" />
      </>}
      {kind === "camphor" && <>
        <path d="M30 48c7-8 14-8 21 0s14 8 21 0 14-8 21 0" stroke="#fffdf2" strokeWidth="7" strokeLinecap="round" />
        <path d="M22 56c9 25 67 25 76 0H22Z" fill="#b97835" stroke="#75451f" strokeWidth="2.5" />
        <ellipse cx="60" cy="56" rx="39" ry="12" fill="#e3a74f" stroke="#75451f" strokeWidth="2.5" />
        <path d="M37 48c-2-9 5-12 10-7 5-7 14-6 15 2 7-5 14 0 11 7" fill="#fffdf2" stroke="#ded6bd" strokeWidth="2" />
        <path d="M16 78c9 6 19 8 27 8m61-8c-9 6-19 8-27 8" {...common} />
        <path d="M26 75c-6-11-2-19 3-22 5 9 5 16-3 22Zm68 0c6-11 2-19-3-22-5 9-5 16 3 22Z" fill="#59a35b" />
      </>}
      {kind === "sambrani" && <>
        <path d="M49 21c-10-12 8-13 1-22m13 24c-8-11 9-12 2-21" stroke="#a9a58e" strokeWidth="2" strokeLinecap="round" />
        <path d="M36 49h48l-5 30H41l-5-30Z" fill="#bd5333" stroke="#713b2b" strokeWidth="2.5" />
        <ellipse cx="60" cy="49" rx="24" ry="9" fill="#e29452" stroke="#713b2b" strokeWidth="2.5" />
        <ellipse cx="60" cy="48" rx="15" ry="5" fill="#492a20" />
        <path d="M42 81h36" stroke="#f5d18a" strokeWidth="4" strokeLinecap="round" />
        <path d="M29 79c7-9 12-8 17-4m45 4c-7-9-12-8-17-4" {...common} />
      </>}
      {kind === "loban" && <>
        <circle cx="44" cy="54" r="13" fill="#382820" /><circle cx="68" cy="43" r="12" fill="#51402e" /><circle cx="78" cy="65" r="11" fill="#34251f" /><circle cx="53" cy="72" r="10" fill="#68503a" />
        <circle cx="42" cy="51" r="3" fill="#c98638" /><circle cx="67" cy="40" r="3" fill="#e2a448" /><circle cx="78" cy="62" r="3" fill="#b77531" />
        <path d="M20 82c11-5 21-6 31-2 12-4 24-3 37 2" stroke="#b76e2f" strokeWidth="5" strokeLinecap="round" />
        <path d="M24 43c-9-12 7-13 1-23m13 26c-8-12 8-12 2-22" stroke="#a9a58e" strokeWidth="2" strokeLinecap="round" />
        <path d="M21 74c2-12 8-18 17-21-1 12-6 19-17 21Zm66 0c-2-12-8-18-17-21 1 12 6 19 17 21Z" fill="#4d9850" />
      </>}
      {kind === "sandalwood" && <>
        <path d="m30 68 40-41 13 11-40 41-13-11Z" fill="#c5833f" stroke="#805126" strokeWidth="2.5" />
        <path d="m49 79 39-40 12 11-39 40-12-11Z" fill="#dfa251" stroke="#805126" strokeWidth="2.5" />
        <path d="m30 68 13 11m27-52 13 11M49 79l12 11m27-51 12 11" stroke="#f0c77e" strokeWidth="2" />
        <path d="M22 80c14 7 31 10 48 8" stroke="#4f944e" strokeWidth="3" strokeLinecap="round" />
      </>}
      {kind === "diya" && <>
        <path d="M60 12c-15 17-12 27 0 34 12-7 15-17 0-34Z" fill="#f27724" />
        <path d="M60 23c-7 9-5 15 0 18 5-3 7-9 0-18Z" fill="#ffd45d" />
        <path d="M30 55c4 24 56 24 60 0H30Z" fill="#9d2440" stroke="#6c2733" strokeWidth="2.5" />
        <ellipse cx="60" cy="55" rx="32" ry="9" fill="#ef9b38" stroke="#6c2733" strokeWidth="2.5" />
        <path d="M32 74h56" stroke="#d7792d" strokeWidth="3" strokeLinecap="round" />
      </>}
      {kind === "gift" && <>
        <path d="M24 42h72v45H24V42Z" fill="#e9a329" stroke="#9a4429" strokeWidth="2.5" />
        <path d="M19 34h82v15H19V34Z" fill="#f5c546" stroke="#9a4429" strokeWidth="2.5" />
        <path d="M55 35c-20-2-25-22-12-22 8 0 13 12 17 22 4-10 10-22 18-22 13 0 8 20-13 22" fill="#c5213d" stroke="#9a4429" strokeWidth="2.5" />
        <path d="M55 36v51m11-51v51" stroke="#c5213d" strokeWidth="5" />
        <path d="M31 56h11m39 0h10M31 73h11m39 0h10" stroke="#ffebaa" strokeWidth="2" strokeLinecap="round" />
      </>}
      {kind === "natural" && <><path d="M60 84V43" {...common} /><path d="M60 62C35 63 27 48 29 33c18 0 29 9 31 29Zm1-13c1-22 14-34 30-34 2 19-9 31-30 34Z" fill="#5a9d4b" stroke="#276a43" strokeWidth="2.4" /><path d="m47 40 12 18m19-29L62 46" stroke="#dbefc6" strokeWidth="2" /></>}
      {kind === "clean" && <><path d="M60 20 82 29v18c0 16-9 27-22 34-13-7-22-18-22-34V29l22-9Z" fill="#e4f1d2" stroke="#34814b" strokeWidth="3" /><path d="m49 49 8 8 16-19" stroke="#34814b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /><path d="M24 80c10-8 20-9 30-7m42 7c-10-8-20-9-30-7" {...common} /></>}
      {kind === "chemical-free" && <><path d="M60 18c-16 19-12 31 0 39 12-8 16-20 0-39Z" fill="#f07835" /><path d="M60 31c-7 9-5 15 0 18 5-3 7-9 0-18Z" fill="#ffdc68" /><path d="m30 73 60-43" stroke="#a72139" strokeWidth="5" strokeLinecap="round" /><circle cx="60" cy="53" r="36" stroke="#d04a3e" strokeWidth="3" /></>}
      {kind === "india" && <><path d="M34 22h52v56H34z" fill="#fff1cd" stroke="#b46937" strokeWidth="2.5" /><path d="M42 31h36M42 40h36" stroke="#e18a36" strokeWidth="7" /><path d="M42 59h36M42 68h36" stroke="#4c9850" strokeWidth="7" /><circle cx="60" cy="50" r="6" fill="#557fa5" /><path d="M60 43v14m-6-7h12m-10-5 8 10m0-10-8 10" stroke="#fff9e9" strokeWidth="1.4" /></>}
    </svg>
  );
}
