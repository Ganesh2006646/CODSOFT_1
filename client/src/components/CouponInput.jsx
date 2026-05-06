import { useState } from 'react';

const CouponInput = ({ onApply, appliedCoupon }) => {
  const [code, setCode] = useState('');

  const handleApply = () => {
    if (!code.trim()) return;
    onApply(code.trim());
  };

  return (
    <div className="bg-gray-50 border rounded-lg p-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter coupon code"
          className="flex-grow border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="button"
          onClick={handleApply}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          Apply
        </button>
      </div>
      {appliedCoupon && (
        <p className="text-xs text-green-600 mt-2">Applied: {appliedCoupon}</p>
      )}
    </div>
  );
};

export default CouponInput;
