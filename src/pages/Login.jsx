import React, { useState, useEffect } from 'react';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [error, setError] = useState('');

  useEffect(() => {
    let interval = null;
    if (otpSent && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!email.toLowerCase().endsWith('@company.com')) {
      setError('Access Restricted: Enter official email ending with @company.com');
      return;
    }
    setError('');
    setOtpSent(true);
    setTimer(60);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.join('').length === 6) {
      onLoginSuccess();
    } else {
      setError('Please enter complete 6-digit OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F6FA] p-4">
      <div className="bg-white p-8 rounded-3xl card-shadow w-full max-w-md border border-gray-100">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">HR & Owner Login</h2>
          <p className="text-xs text-gray-500 mt-1">Authenticate using enterprise email domain</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl mb-4 font-medium border border-red-100">
            {error}
          </div>
        )}

        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-600">Official HR Email</label>
              <input 
                type="email" 
                required
                placeholder="manager@company.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button type="submit" className="w-full py-3 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 shadow-lg shadow-purple-100 transition">
              Send Verification OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <label className="text-xs font-semibold text-gray-600">Enter 6-Digit Verification Code</label>
            <div className="flex gap-2 justify-between">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => {
                    const newOtp = [...otp];
                    newOtp[idx] = e.target.value;
                    setOtp(newOtp);
                  }}
                  className="w-10 h-12 text-center bg-gray-50 border border-gray-200 rounded-xl font-bold text-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
              ))}
            </div>

            <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
              <span>Resend in: <strong className="text-purple-600">{timer}s</strong></span>
              {timer === 0 && (
                <button type="button" onClick={handleSendOtp} className="text-purple-600 font-semibold underline">
                  Resend OTP
                </button>
              )}
            </div>

            <button type="submit" className="w-full py-3 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 shadow-lg shadow-purple-100 transition">
              Verify & Launch Dashboard
            </button>
          </form>
        )}
      </div>
    </div>
  );
}