import React from 'react';

export default function AdminSettings() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Site Settings</h1>

      <div className="space-y-6">
        {/* General Settings */}
        <div className="card card-body">
          <h2 className="text-lg font-bold mb-4">General Settings</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Site Name</label>
              <input type="text" defaultValue="Your Store" className="input" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Site Description</label>
              <textarea className="input" rows="4"></textarea>
            </div>
            <button type="button" className="btn btn-primary">Save Settings</button>
          </form>
        </div>

        {/* Contact Settings */}
        <div className="card card-body">
          <h2 className="text-lg font-bold mb-4">Contact Information</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Email</label>
                <input type="email" className="input" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Phone</label>
                <input type="tel" className="input" />
              </div>
            </div>
            <button type="button" className="btn btn-primary">Save Settings</button>
          </form>
        </div>
      </div>
    </div>
  );
}
