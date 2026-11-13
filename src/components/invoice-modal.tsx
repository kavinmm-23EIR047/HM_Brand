'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { Printer, Download, X, MapPin, CheckCircle2, ShieldCheck } from 'lucide-react';

interface OrderItem {
  id?: string;
  productNameSnapshot?: string;
  name?: string;
  quantity: number;
  unitPriceSnapshot?: number;
  unitPrice?: number;
  totalPrice: number;
  skuSnapshot?: string;
}

interface InvoiceOrder {
  id: string;
  orderNumber: string;
  createdAt: string | Date;
  totalAmount: number;
  subtotal: number;
  discountAmount?: number;
  shippingCost?: number;
  paymentMethod: string;
  paymentStatus: string;
  razorpayPaymentId?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress: any;
  items: OrderItem[];
}

function numberToIndianWords(num: number): string {
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function inWords(n: number): string {
    if (n === 0) return '';
    if (n < 20) return a[n] + ' ';
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] : '') + ' ';
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred ' + (n % 100 ? inWords(n % 100) : '');
    if (n < 100000) return inWords(Math.floor(n / 1000)) + 'Thousand ' + (n % 1000 ? inWords(n % 1000) : '');
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + 'Lakh ' + (n % 100000 ? inWords(n % 100000) : '');
    return inWords(Math.floor(n / 10000000)) + 'Crore ' + (n % 10000000 ? inWords(n % 10000000) : '');
  }

  const rounded = Math.round(num);
  if (rounded === 0) return 'Zero Rupees Only';
  return (inWords(rounded).trim() + ' Rupees Only').replace(/\s+/g, ' ');
}

export function InvoiceModal({
  order,
  isOpen,
  onClose,
}: {
  order: InvoiceOrder | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !order) return null;

  // Parse shipping address
  let addr: any = {};
  if (typeof order.shippingAddress === 'string') {
    try {
      addr = JSON.parse(order.shippingAddress);
    } catch {
      addr = { street: order.shippingAddress };
    }
  } else if (order.shippingAddress) {
    addr = order.shippingAddress;
  }

  const recipientName = addr.fullName || addr.name || order.customerEmail || 'Valued Devotee';
  const recipientPhone = order.customerPhone || addr.phone || 'N/A';
  const recipientEmail = order.customerEmail || addr.email || 'N/A';

  const fullStreet = addr.addressLine1
    ? `${addr.addressLine1}${addr.addressLine2 ? ', ' + addr.addressLine2 : ''}`
    : (addr.street || '');
  const cityStateZip = [addr.city, addr.state || 'Tamil Nadu', addr.postalCode || addr.pincode].filter(Boolean).join(', ');
  const fullAddressString = [fullStreet, cityStateZip, 'India'].filter(Boolean).join(', ');
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddressString)}`;

  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const invoiceNumber = `INV-${order.orderNumber.replace(/^HM-/, '')}`;
  const amountWords = numberToIndianWords(Number(order.totalAmount || 0));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-4xl bg-[#FFFDF8] rounded-2xl shadow-2xl border border-[#C89B3C]/30 overflow-hidden print:border-none print:shadow-none print:rounded-none">
        
        {/* Modal Controls Bar (hidden during printing) */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#F5EFE3] border-b border-[#EAE1D3] print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#15803D]"></span>
            <h3 className="font-serif font-bold text-[#302923] text-sm sm:text-base">
              Sacred Tax Invoice: {invoiceNumber}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#9E1830] hover:bg-[#7A1224] text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#746B62] hover:text-[#302923] rounded-lg hover:bg-black/5 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div ref={invoiceRef} className="p-6 sm:p-10 font-sans text-[#302923] bg-white print:p-4">
          
          {/* Header & Brand */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-[#C89B3C]/40 pb-6 gap-6">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0">
                <Image
                  src="/images/brand_logo_gold_transparent.png"
                  alt="HM Brand Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <span className="text-[10px] tracking-[0.25em] font-bold text-[#9E1830] uppercase">
                  Sacred Fragrance Heritage
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#302923]">
                  HM AGARBATTI WORKS
                </h1>
                <p className="text-xs text-[#746B62] mt-0.5">
                  M/s. Jayam Associates &bull; Peelamedu Main Rd, Sowri Palayam, Coimbatore - 641028, TN, India
                </p>
                <p className="text-xs text-[#746B62]">
                  <strong>Phone:</strong> +91 63821 77441 &bull; <strong>Email:</strong> jayamassociatescoimbatore@gmail.com
                </p>
                <p className="text-[11px] font-mono text-[#9E1830] mt-0.5 font-semibold">
                  GSTIN: 33AAACJ1234F1Z5 &bull; HSN CODE: 33074100
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right bg-[#FAF7F0] p-4 rounded-xl border border-[#EAE1D3] sm:min-w-[220px]">
              <span className="inline-block px-2.5 py-0.5 bg-[#9E1830] text-white text-[10px] font-bold tracking-wider rounded uppercase mb-1.5">
                TAX INVOICE
              </span>
              <div className="text-xs text-[#746B62]">Invoice Ref:</div>
              <div className="font-mono text-sm font-bold text-[#302923]">{invoiceNumber}</div>
              <div className="text-xs text-[#746B62] mt-1">Date:</div>
              <div className="text-xs font-semibold text-[#302923]">{orderDate}</div>
              <div className="text-xs text-[#746B62] mt-1">Payment Status:</div>
              <div className="text-xs font-bold text-[#15803D]">
                {order.paymentStatus === 'COMPLETED' ? 'PAID & CONFIRMED' : order.paymentStatus}
              </div>
            </div>
          </div>

          {/* Customer & Delivery Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 p-4 rounded-xl bg-[#FFFDF8] border border-[#EAE1D3]">
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#9E1830] mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Billed & Delivered To:
              </h4>
              <p className="text-sm font-bold text-[#302923]">{recipientName}</p>
              <p className="text-xs text-[#746B62] mt-0.5">{recipientEmail} &bull; {recipientPhone}</p>
              <p className="text-xs text-[#302923] mt-2 leading-relaxed">
                {fullStreet ? `${fullStreet}, ` : ''}{cityStateZip}
              </p>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-[#9E1830] hover:underline font-semibold mt-2 print:text-[#302923]"
              >
                <MapPin className="w-3 h-3 text-[#C89B3C]" />
                <span>Verify Exact Location on Google Maps &rarr;</span>
              </a>
            </div>

            <div className="sm:border-l sm:border-[#EAE1D3] sm:pl-6">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#9E1830] mb-2">
                Order & Transaction Meta:
              </h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between py-0.5 border-b border-[#F5EFE3]">
                  <span className="text-[#746B62]">Order Number:</span>
                  <span className="font-mono font-bold">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-[#F5EFE3]">
                  <span className="text-[#746B62]">Payment Gateway:</span>
                  <span className="font-semibold">{order.paymentMethod}</span>
                </div>
                {order.razorpayPaymentId && (
                  <div className="flex justify-between py-0.5 border-b border-[#F5EFE3]">
                    <span className="text-[#746B62]">Razorpay Payment ID:</span>
                    <span className="font-mono text-[11px]">{order.razorpayPaymentId}</span>
                  </div>
                )}
                <div className="flex justify-between py-0.5">
                  <span className="text-[#746B62]">Dispatch Origin:</span>
                  <span className="font-semibold text-[#9E1830]">Coimbatore Sacred Works</span>
                </div>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto my-6">
            <table className="w-full text-left text-xs border border-[#EAE1D3] rounded-lg overflow-hidden">
              <thead className="bg-[#FAF7F0] text-[#302923] font-serif border-b border-[#EAE1D3]">
                <tr>
                  <th className="py-3 px-3 w-12 text-center">#</th>
                  <th className="py-3 px-3">Sacred Fragrance & Description</th>
                  <th className="py-3 px-3 text-center">HSN</th>
                  <th className="py-3 px-3 text-center">Qty</th>
                  <th className="py-3 px-3 text-right">Unit Price</th>
                  <th className="py-3 px-3 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5EFE3]">
                {order.items.map((item, idx) => {
                  const name = item.productNameSnapshot || item.name || 'Sacred Agarbatti';
                  const unitPrice = item.unitPriceSnapshot || item.unitPrice || (item.totalPrice / (item.quantity || 1));
                  return (
                    <tr key={idx} className="hover:bg-[#FFFDF8]">
                      <td className="py-3 px-3 text-center text-[#746B62] font-mono">{idx + 1}</td>
                      <td className="py-3 px-3 font-semibold text-[#302923]">
                        {name}
                        {item.skuSnapshot ? (
                          <span className="block text-[10px] font-mono text-[#746B62] font-normal">
                            SKU: {item.skuSnapshot}
                          </span>
                        ) : null}
                      </td>
                      <td className="py-3 px-3 text-center text-[#746B62] font-mono text-[11px]">33074100</td>
                      <td className="py-3 px-3 text-center font-bold text-[#302923]">{item.quantity}</td>
                      <td className="py-3 px-3 text-right font-mono text-[#302923]">
                        ₹{Number(unitPrice).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-[#302923]">
                        ₹{Number(item.totalPrice).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals & Calculations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start mt-6">
            <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#EAE1D3] text-xs">
              <span className="text-[10px] font-bold text-[#746B62] uppercase tracking-wider block mb-1">
                Amount in Words:
              </span>
              <p className="font-serif font-bold text-[#9E1830] text-sm italic">
                {amountWords}
              </p>
              <div className="mt-4 pt-3 border-t border-[#EAE1D3] space-y-1 text-[11px] text-[#746B62]">
                <p>&bull; 100% Herbal temple ingredients, hand-rolled in Tamil Nadu.</p>
                <p>&bull; This is a computer-generated official tax invoice, authenticated by Jayam Associates.</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#F5EFE3]">
                <span className="text-[#746B62]">Items Subtotal:</span>
                <span className="font-mono font-semibold">₹{Number(order.subtotal).toLocaleString('en-IN')}</span>
              </div>
              {Number(order.discountAmount || 0) > 0 && (
                <div className="flex justify-between py-1 border-b border-[#F5EFE3] text-[#15803D]">
                  <span>Divine Discount / Offer:</span>
                  <span className="font-mono font-semibold">-₹{Number(order.discountAmount).toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-[#F5EFE3]">
                <span className="text-[#746B62]">Sacred Coimbatore Courier:</span>
                <span className="font-semibold text-[#15803D]">
                  {Number(order.shippingCost || 0) > 0 ? `₹${order.shippingCost}` : 'FREE'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-t-2 border-[#C89B3C] text-sm">
                <span className="font-serif font-bold text-[#302923]">Grand Total (Incl. Taxes):</span>
                <span className="font-mono font-bold text-base text-[#9E1830]">
                  ₹{Number(order.totalAmount).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="flex flex-col sm:flex-row justify-between items-end mt-12 pt-6 border-t border-[#EAE1D3] text-xs gap-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full border-2 border-dashed border-[#C89B3C] flex items-center justify-center p-1 text-center">
                <span className="text-[9px] font-bold font-serif text-[#9E1830] uppercase leading-tight">
                  HM BRAND<br />SEAL
                </span>
              </div>
              <div>
                <p className="font-semibold text-[#302923]">Pure Coimbatore Dispatch Verified</p>
                <p className="text-[11px] text-[#746B62]">Batch packed with temple blessings</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs font-serif font-bold text-[#302923]">For HM Agarbatti Works (Jayam Associates)</p>
              <div className="h-10"></div>
              <p className="text-[11px] text-[#746B62] font-semibold border-t border-[#746B62]/40 pt-1">
                Authorized Signatory
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

