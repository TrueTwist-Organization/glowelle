import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { ShoppingBag, MapPin, CreditCard, ChevronRight, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';

const Checkout = () => {
  const { cartItems, getCartCount } = useCart();
  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Success
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    address: '',
    pincode: ''
  });
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((acc, item) => {
    const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
    return acc + (price * item.quantity);
  }, 0);

  const steps = [
    { id: 1, name: 'Address', icon: <MapPin size={20} /> },
    { id: 2, name: 'Payment', icon: <CreditCard size={20} /> },
    { id: 3, name: 'Done', icon: <CheckCircle2 size={20} /> }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    setIsSending(true);
    
    // Email data structure
    const templateParams = {
      to_name: formData.fullName,
      to_email: formData.email,
      order_id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      total_amount: `₹${subtotal.toLocaleString()}`,
      items_summary: cartItems.map(item => `${item.quantity}x ${item.name}`).join(', '),
      shipping_address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
      customer_phone: formData.phone
    };

    try {
      // emailjs.send('service_id', 'template_id', templateParams, 'public_key');
      console.log('Order Data prepared for EmailJS:', templateParams);
      
      setTimeout(() => {
        setStep(3);
        setIsSending(false);
      }, 1500);

    } catch (error) {
      console.error('Email sending failed:', error);
      setStep(3);
      setIsSending(false);
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: 'transparent' }}>
      <div className="container" style={{ paddingTop: 'clamp(5rem, 15vh, 8rem)', paddingBottom: 'clamp(4rem, 10vh, 10rem)' }}>
        
        {/* Progress Bar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: 'clamp(1rem, 5vw, 2rem)', 
          marginBottom: 'clamp(2.5rem, 8vh, 5rem)' 
        }}>
          {steps.map((s, idx) => (
            <React.Fragment key={s.id}>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '0.8rem',
                opacity: step >= s.id ? 1 : 0.4,
                color: step === s.id ? 'var(--highlight-pink)' : 'white',
                transition: 'all 0.5s ease'
              }}>
                <div style={{ 
                  width: '50px', 
                  height: '50px', 
                  borderRadius: '50%', 
                  background: step === s.id ? 'var(--highlight-pink)' : 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: step === s.id ? 'white' : 'inherit'
                }}>
                  {s.icon}
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.name}</span>
              </div>
              {idx < steps.length - 1 && (
                <div style={{ width: 'clamp(30px, 10vw, 60px)', height: '2px', background: 'rgba(255,255,255,0.1)', marginTop: '-1.5rem' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: step > s.id ? '100%' : '0%' }}
                    style={{ height: '100%', background: 'var(--highlight-pink)' }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <AnimatePresence mode="wait">
            
            {/* Step 1: Address */}
            {step === 1 && (
              <motion.div
                key="address"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="checkout-layout"
              >
                <div>
                  <h2 style={{ fontSize: '3rem', marginBottom: '2.5rem', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>Shipping <span className="text-lips">Address</span></h2>
                  <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Full Name" className="checkout-input" required />
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email Address" className="checkout-input" required />
                    <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number" className="checkout-input" required />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="City" className="checkout-input" required />
                      <input type="text" name="state" value={formData.state} onChange={handleInputChange} placeholder="State" className="checkout-input" required />
                    </div>
                    <textarea name="address" value={formData.address} onChange={handleInputChange} placeholder="Complete Address" className="checkout-input" style={{ minHeight: '120px' }} required />
                    <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="Pincode" className="checkout-input" required />
                  </div>
                  <button 
                    className="btn btn-primary" 
                    style={{ marginTop: '3rem', width: '100%', justifyContent: 'center' }}
                    onClick={() => setStep(2)}
                  >
                    Continue to Payment <ChevronRight size={20} />
                  </button>
                </div>

                <OrderSummary subtotal={subtotal} cartItems={cartItems} />
              </motion.div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="checkout-layout"
              >
                <div>
                  <h2 style={{ fontSize: '3.0rem', marginBottom: '2.5rem', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>Choose <span className="text-lips">Payment</span></h2>
                  <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <div className="payment-option">
                      <input type="radio" name="pay" id="card" defaultChecked />
                      <label htmlFor="card" style={{ flex: 1, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Credit / Debit Card</span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                           <div style={{ width: '35px', height: '22px', background: '#ffffff20', borderRadius: '4px' }}></div>
                           <div style={{ width: '35px', height: '22px', background: '#ffffff20', borderRadius: '4px' }}></div>
                        </div>
                      </label>
                    </div>
                    <div className="checkout-input">
                      <input type="text" placeholder="Card Number" style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      <input type="text" placeholder="Expiry (MM/YY)" className="checkout-input" />
                      <input type="password" placeholder="CVV" className="checkout-input" />
                    </div>
                    
                    <div className="payment-option">
                      <input type="radio" name="pay" id="upi" />
                      <label htmlFor="upi" style={{ flex: 1, cursor: 'pointer' }}>UPI Payment (GPay / PhonePe)</label>
                    </div>
                    
                    <div className="payment-option">
                      <input type="radio" name="pay" id="cod" />
                      <label htmlFor="cod" style={{ flex: 1, cursor: 'pointer' }}>Cash on Delivery</label>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1.5rem', marginTop: '3.5rem' }}>
                    <button className="btn btn-secondary" onClick={() => setStep(1)}><ArrowLeft size={18} /> Back</button>
                    <button 
                      className="btn btn-primary" 
                      style={{ flex: 1, justifyContent: 'center' }}
                      onClick={handlePlaceOrder}
                      disabled={isSending}
                    >
                      {isSending ? 'Sending Confirmation...' : `Place Order ₹${subtotal.toLocaleString()}`}
                    </button>
                  </div>
                </div>

                <OrderSummary subtotal={subtotal} cartItems={cartItems} />
              </motion.div>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: '4rem 0' }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10, stiffness: 100 }}
                  style={{ color: '#22c55e', marginBottom: '2.5rem' }}
                >
                  <CheckCircle2 size={100} />
                </motion.div>
                <h1 style={{ fontSize: '4.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>
                  Order <span className="text-lips">Confirmed!</span>
                </h1>
                <p style={{ fontSize: '1.3rem', color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 4rem', lineHeight: 1.6 }}>
                  Congratulations! Your luxury beauty ritual is on its way. Expect delivery in 3-5 business days.
                </p>
                <button className="btn btn-primary" onClick={() => navigate('/')}>
                  Continue Shopping
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const OrderSummary = ({ subtotal, cartItems }) => (
  <div className="checkout-summary">
    <h3 style={{ fontSize: '1.8rem', marginBottom: '2.5rem', color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Order Details</h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2rem' }}>
      {cartItems.map(item => (
        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>{item.quantity}x {item.name}</span>
          <span style={{ fontWeight: 700 }}>{item.price}</span>
        </div>
      ))}
    </div>
    <div style={{ borderTop: '1px solid #ffffff10', paddingTop: '2.5rem' }}>
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Total Amount</span>
          <span style={{ fontWeight: 900, fontSize: '1.8rem', color: 'var(--highlight-pink)' }}>₹{subtotal.toLocaleString()}</span>
       </div>
    </div>
  </div>
);

export default Checkout;
