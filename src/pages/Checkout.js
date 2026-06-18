import React from 'react';

export default function Checkout() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Shipping Address */}
          <div className="card card-body">
            <h2 className="text-lg font-bold mb-4">Shipping Address</h2>
            <form className="space-y-4">
              <input type="text" placeholder="Street Address" className="input" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="City" className="input" />
                <input type="text" placeholder="State" className="input" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="ZIP Code" className="input" />
                <input type="text" placeholder="Country" className="input" />
              </div>
            </form>
          </div>

          {/* Payment Method */}
          <div className="card card-body">
            <h2 className="text-lg font-bold mb-4">Payment Method</h2>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="radio" name="payment" defaultChecked className="mr-2" />
                Credit Card
              </label>
              <label className="flex items-center">
                <input type="radio" name="payment" className="mr-2" />
                Debit Card
              </label>
              <label className="flex items-center">
                <input type="radio" name="payment" className="mr-2" />
                PayPal
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="card card-body h-fit">
          <h2 className="text-lg font-bold mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4 pb-4 border-b">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>$0.00</span>
            </div>
          </div>
          <div className="flex justify-between font-bold text-xl mb-6">
            <span>Total</span>
            <span>$0.00</span>
          </div>
          <button className="btn btn-primary w-full">Place Order</button>
        </div>
      </div>
    </div>
  );
}
