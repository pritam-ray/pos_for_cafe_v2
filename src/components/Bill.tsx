import React from 'react';
import { formatCurrency } from '../lib/notification';
import { Logo } from './Logo';

interface BillProps {
  order: {
    id: string;
    table_number: number;
    customer_name?: string;
    created_at: string;
    total_amount: number;
    payment_method: 'cash' | 'online';
    order_items: Array<{
      item_name: string;
      quantity: number;
      price: number;
      image_url?: string;
    }>;
  };
}

const COMPANY_INFO = {
  name: "C Square CAFE",
  legal: "(A UNIT OF SQUARE FOODS PVT. LTD.)",
  tagline: "TASTE FEEL REPEAT",
  address: "123, MAIN STREET, CITY CENTER",
  city: "JAIPUR, RAJASTHAN",
  phone: "Phone: +91 8209349602",
  gstin: "GSTIN: 08AABCS1429B1Z1",
  tin: "TIN: 08262974040",
};

export const Bill: React.FC<BillProps> = ({ order }) => {
  if (!order || !order.order_items || order.order_items.length === 0) {
    return (
      <div className="p-8 bg-white text-center" id="bill-print">
        <p className="text-red-500">Error: Invalid order data</p>
      </div>
    );
  }

  const subtotal = order.order_items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = 0;
  const cgst = (subtotal - discount) * 0.025;
  const sgst = (subtotal - discount) * 0.025;
  const serviceCharge = (subtotal - discount) * 0.10;
  const total = subtotal - discount + cgst + sgst + serviceCharge;

  const formattedDate = new Date(order.created_at).toLocaleString('en-IN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const getBillImage = () => {
    return order.order_items[0].image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
  };

  const billImage = getBillImage();

  return (
    <div
      className="pt-2 px-4 pb-6 bg-white max-w-md mx-auto"
      id="bill-print"
      style={{ fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.2' }}
    >
      {/* Header */}
      <div className="text-center mb-6 border-b-2 border-dashed border-gray-400 pb-4">
        <div className="flex justify-center mb-1 mt-0">
        <Logo className="w-12 h-12" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-1">{COMPANY_INFO.name}</h1>
        <p className="text-sm text-gray-700">{COMPANY_INFO.legal}</p>
        <p className="text-sm font-bold text-gray-900 tracking-wider mb-2">{COMPANY_INFO.tagline}</p>
        <p className="text-sm text-gray-700">{COMPANY_INFO.address}</p>
        <p className="text-sm text-gray-700">{COMPANY_INFO.city}</p>
        <p className="text-sm text-gray-700">{COMPANY_INFO.phone}</p>
        <div className="text-xs text-gray-600 mt-2">
          <p>{COMPANY_INFO.gstin}</p>
          <p>{COMPANY_INFO.tin}</p>
        </div>
      </div>

      {/* Bill Details */}
      <div className="border-b border-dashed border-gray-400 pb-3 mb-4">
        <div className="flex justify-between text-sm">
          <div>
            <p><strong>Bill No:</strong> {order.id.slice(0, 8).toUpperCase()}</p>
            <p><strong>Date:</strong> {formattedDate}</p>
            <p><strong>Table:</strong> {order.table_number}</p>
          </div>
          <div className="text-right">
            {order.customer_name && (
              <p><strong>Customer:</strong> {order.customer_name}</p>
            )}
            <p><strong>Payment:</strong> {order.payment_method.toUpperCase()}</p>
            <p><strong>Server:</strong> STAFF</p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-4">
        <div className="border-b border-gray-400 pb-1 mb-2">
          <div className="flex justify-between text-sm font-bold">
            <span style={{ width: '40%' }}>ITEM</span>
            <span style={{ width: '15%', textAlign: 'center' }}>QTY</span>
            <span style={{ width: '20%', textAlign: 'right' }}>RATE</span>
            <span style={{ width: '25%', textAlign: 'right' }}>AMOUNT</span>
          </div>
        </div>

        {order.order_items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm py-1">
            <span style={{ width: '40%', wordBreak: 'break-word' }}>{item.item_name}</span>
            <span style={{ width: '15%', textAlign: 'center' }}>{item.quantity}</span>
            <span style={{ width: '20%', textAlign: 'right' }}>{formatCurrency(item.price)}</span>
            <span style={{ width: '25%', textAlign: 'right' }}>{formatCurrency(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t border-dashed border-gray-400 pt-3 mb-4">
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Sub Total:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount:</span>
              <span>-{formatCurrency(discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>CGST @ 2.5%:</span>
            <span>{formatCurrency(cgst)}</span>
          </div>
          <div className="flex justify-between">
            <span>SGST @ 2.5%:</span>
            <span>{formatCurrency(sgst)}</span>
          </div>
          <div className="flex justify-between">
            <span>Service Charge @ 10%:</span>
            <span>{formatCurrency(serviceCharge)}</span>
          </div>
          <div className="border-t border-dashed border-gray-400 pt-2 mt-2">
            <div className="flex justify-between font-bold text-lg">
              <span>TOTAL AMOUNT:</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="text-center text-sm mb-4 border-b border-dashed border-gray-400 pb-4">
        <p><strong>Payment Method:</strong> {order.payment_method.toUpperCase()}</p>
        <p><strong>Amount Paid:</strong> {formatCurrency(total)}</p>
        <p><strong>Balance:</strong> {formatCurrency(0)}</p>
      </div>

      {/* Footer */}
      <div className="text-center border-t-2 border-dashed border-gray-400 pt-4 mb-3">
        <p className="text-sm font-bold mb-2">Thank you for visiting!</p>
        <p className="font-bold text-gray-900 text-base tracking-wider">{COMPANY_INFO.tagline}</p>
        <p className="text-xs text-gray-600 mt-2">Visit us again soon!</p>
        <div className="mt-3 text-xs text-gray-500">
          <p>For feedback: {COMPANY_INFO.phone}</p>
          <p>Follow us on social media @csquarecafe</p>
        </div>
      </div>

      {/* Product Image at Bottom */}
      <div className="text-center mt-2">
        <div className="w-12 h-12 mx-auto mt-1 mb-1 rounded overflow-hidden border border-gray-300 shadow-sm">


          <img
            src={billImage}
            alt={order.order_items.length === 1 ? order.order_items[0].item_name : "Order Items"}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
            }}
          />
        </div>
        <p className="text-xs text-gray-600">
          {order.order_items.length === 1
            ? order.order_items[0].item_name
            : `Featured: ${order.order_items[0].item_name} + ${order.order_items.length - 1} more item${order.order_items.length > 2 ? 's' : ''}`}
        </p>
      </div>
    </div>
  );
};
