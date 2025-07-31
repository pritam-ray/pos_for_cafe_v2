import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface PaymentQRCodeProps {
  onClose: () => void;
  onConfirmPayment: () => void;
}

function PaymentQRCode({ onClose, onConfirmPayment }: PaymentQRCodeProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-primary-800 rounded-lg shadow-premium p-6 max-w-sm w-full border border-primary-700">
        <h3 className="text-xl font-semibold mb-4 text-white">Scan QR Code to Pay</h3>
        <img
          src={import.meta.env.VITE_QR_CODE_URL}
          alt="Payment QR Code"
          className="w-full rounded-lg mb-4"
        />
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 bg-primary-700 text-primary-200 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirmPayment}
            className="flex-1 bg-accent-600 text-white py-2 rounded-lg hover:bg-accent-500 transition-colors"
          >
            I've Paid
          </button>
        </div>
      </div>
    </div>
  );
}

export function Cart() {
  const { items, removeItem, updateQuantity, clearCart, total } = useCartStore();
  const [tableNumber, setTableNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online'>('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  const handleSubmitOrder = async () => {
    if (!tableNumber) {
      toast.error('Please enter a table number');
      return;
    }

    if (!customerName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (paymentMethod === 'online' && !showQRCode) {
      setShowQRCode(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          table_number: parseInt(tableNumber),
          customer_name: customerName.trim(),
          payment_method: paymentMethod,
          total_amount: total(),
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map(item => ({
        order_id: order.id,
        item_name: item.name,
        quantity: item.quantity,
        price: item.price,
        image_url: item.image
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      toast.success('Order placed successfully!');
      clearCart();
      setTableNumber('');
      setCustomerName('');
      setShowQRCode(false);
    } catch (error) {
      toast.error('Failed to place order');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showQRCode) {
    return (
      <PaymentQRCode
        onClose={() => setShowQRCode(false)}
        onConfirmPayment={handleSubmitOrder}
      />
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center card p-4 md:p-6">
        <div className="p-4 bg-gradient-to-br from-accent-500/20 to-accent-600/20 rounded-full mb-4">
          <ShoppingCart className="w-16 h-16 text-accent-400" />
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-center text-white">Your cart is empty</h2>
        <p className="text-dark-300 text-center">Add some delicious items to your cart!</p>
      </div>
    );
  }

  return (
    <div className="card p-4 md:p-6">
      <h2 className="text-2xl font-semibold mb-4 text-accent-400">Your Order</h2>
      <div className="max-h-[50vh] overflow-y-auto mb-4 pr-2">
        {items.map((item) => (
          <div key={item.name} className="flex items-center justify-between py-3 border-b border-dark-700/30">
            <div className="flex-1 min-w-0 pr-2">
              <h3 className="font-medium text-white truncate">{item.name}</h3>
              <p className="text-accent-400">₹{item.price}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.name, Math.max(0, item.quantity - 1))}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-dark-700 text-dark-300 hover:text-white transition-colors"
              >
                -
              </button>
              <span className="w-8 text-center text-white">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.name, item.quantity + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-dark-700 text-dark-300 hover:text-white transition-colors"
              >
                +
              </button>
              <button
                onClick={() => removeItem(item.name)}
                className="ml-2 text-red-400 hover:text-red-300 w-8 h-8 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full input-primary"
        />
        <input
          type="number"
          placeholder="Table Number"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          className="w-full input-primary"
        />
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setPaymentMethod('cash')}
            className={`p-3 rounded-lg text-center transition-colors ${
              paymentMethod === 'cash'
                ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg'
                : 'bg-dark-700/50 text-dark-300 hover:bg-dark-700 border border-dark-600'
            }`}
          >
            Cash
          </button>
          <button
            onClick={() => setPaymentMethod('online')}
            className={`p-3 rounded-lg text-center transition-colors ${
              paymentMethod === 'online'
                ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg'
                : 'bg-dark-700/50 text-dark-300 hover:bg-dark-700 border border-dark-600'
            }`}
          >
            Online
          </button>
        </div>
        <div className="text-xl font-semibold text-white">
          Total: ₹{total()}
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmitOrder}
          disabled={isSubmitting}
          className="w-full btn-primary disabled:opacity-50"
        >
          {isSubmitting ? 'Placing Order...' : paymentMethod === 'online' ? 'Proceed to Pay' : 'Place Order'}
        </motion.button>
      </div>
    </div>
  );
}