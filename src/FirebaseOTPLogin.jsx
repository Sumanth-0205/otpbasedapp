import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

function FirebaseOTPLogin() {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
  if (!window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier = new RecaptchaVerifier(
        'recaptcha-container',
        { size: 'invisible' },
        auth
      );
      window.recaptchaVerifier.render();
    } catch (error) {
      console.error("reCAPTCHA init failed:", error);
      setMessage("❌ reCAPTCHA setup failed.");
    }
  }
}, []);


  const handleSendOTP = () => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      'recaptcha-container',
      { size: 'invisible' },
      auth
    );
  }

  const appVerifier = window.recaptchaVerifier;
  const phone = `+91${mobile}`;

  console.log("Sending to:", phone);
  console.log("Using auth:", auth);
  console.log("Using verifier:", appVerifier);

  signInWithPhoneNumber(auth, phone, appVerifier)
    .then((confirmationResult) => {
      setConfirmation(confirmationResult);
      setMessage("✅ OTP sent!");
    })
    .catch((error) => {
      console.error("OTP Error:", error);
      setMessage(`❌ ${error.code}: ${error.message}`);
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
