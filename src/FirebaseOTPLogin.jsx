import React, { useState } from 'react';
import { auth } from './firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

function FirebaseOTPLogin() {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [message, setMessage] = useState('');

  const handleSendOTP = () => {
    if (!auth) {
      setMessage("❌ Firebase Auth is not initialized");
      return;
    }

    if (!window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(
          'recaptcha-container',
          { size: 'invisible' },
          auth
        );
        window.recaptchaVerifier.render();
      } catch (error) {
        console.error("reCAPTCHA setup error:", error);
        setMessage("❌ reCAPTCHA setup failed.");
        return;
      }
    }

    const phone = `+91${mobile}`;
    const appVerifier = window.recaptchaVerifier;

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
    if (!confirmation) {
      setMessage("Please send OTP first.");
      return;
    }

    confirmation
      .confirm(otp)
      .then(() => setMessage("🎉 Phone number verified!"))
      .catch(() => setMessage("❌ Incorrect OTP"));
  };

  return (
    <div style={{ maxWidth: '320px', margin: '2rem auto', textAlign: 'center' }}>
      <h3>OTP Login</h3>

      <input
        type="tel"
        placeholder="Enter mobile number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />
      <br />
      <button onClick={handleSendOTP}>Send OTP</button>

      <br /><br />

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <br />
      <button onClick={handleVerifyOTP}>Verify OTP</button>

      <div id="recaptcha-container" />

      <p>{message}</p>
    </div>
  );
}

export default FirebaseOTPLogin;
