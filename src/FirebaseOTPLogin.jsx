import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

function FirebaseOTPLogin() {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [message, setMessage] = useState('');

  

  const handleSendOTP = () => {
    const phone = `+91${mobile}`;
    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, phone, appVerifier)
      .then((confirmationResult) => {
        setConfirmation(confirmationResult);
        setMessage('✅ OTP sent!');
      })
      .catch((error) => {
        console.error(error);
        setMessage('❌ Error sending OTP');
      });
  };

  const handleVerifyOTP = () => {
    if (!confirmation) return setMessage('Please send OTP first');
    confirmation
      .confirm(otp)
      .then(() => setMessage('🎉 Phone number verified!'))
      .catch(() => setMessage('❌ Incorrect OTP'));
  };

  return (
    <div style={{ maxWidth: '320px', margin: '2rem auto' }}>
      <h3>OTP Login</h3>
      <input
        type="tel"
        placeholder="Enter mobile number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />
      <button onClick={handleSendOTP}>Send OTP</button>

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={handleVerifyOTP}>Verify OTP</button>

      <div id="recaptcha-container"></div>
      <p>{message}</p>
    </div>
  );
}

export default FirebaseOTPLogin;
