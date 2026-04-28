"use client";

import React, { useState } from "react";

interface CheckoutPaymentFormProps {
  onCheckout?: (data: { name: string; card: string; expiry: string; cvv: string }) => void;
  className?: string;
}

const CheckoutPaymentForm: React.FC<CheckoutPaymentFormProps> = ({
  onCheckout,
  className = "",
}) => {
  const [name, setName] = useState("");
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [btnHovered, setBtnHovered] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [cardFocused, setCardFocused] = useState(false);
  const [expiryFocused, setExpiryFocused] = useState(false);
  const [cvvFocused, setCvvFocused] = useState(false);

  const handleCheckout = () => {
    onCheckout?.({ name, card, expiry, cvv });
  };

  const inputStyle = (focused: boolean): React.CSSProperties => ({
    width: "auto",
    height: "50px",
    textIndent: "15px",
    borderRadius: "15px",
    outline: "none",
    backgroundColor: "transparent",
    border: focused ? "1px solid #d17842" : "1px solid #21262e",
    transition: "all 0.3s",
    caretColor: "#d17842",
    color: "#aeaeae",
    fontSize: "14px",
  });

  return (
    <section className={className}>
      <form
        style={{
          background: "#0c0f14",
          boxShadow: "0px 187px 75px rgba(0,0,0,0.01), 0px 105px 63px rgba(0,0,0,0.05), 0px 47px 47px rgba(0,0,0,0.09), 0px 12px 26px rgba(0,0,0,0.1)",
          width: "320px",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          padding: "20px",
          position: "relative",
          borderRadius: "25px",
        }}
        onSubmit={(e) => { e.preventDefault(); handleCheckout(); }}
      >
        {/* Card holder */}
        <label style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <span style={{ padding: "0 10px", fontSize: "12px", color: nameFocused ? "#d17842" : "#8b8e98", fontWeight: 600, transition: "all 300ms" }}>
            Card holder full name
          </span>
          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => setNameFocused(true)}
            onBlur={() => setNameFocused(false)}
            style={inputStyle(nameFocused)}
          />
        </label>

        {/* Card number */}
        <label style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <span style={{ padding: "0 10px", fontSize: "12px", color: cardFocused ? "#d17842" : "#8b8e98", fontWeight: 600, transition: "all 300ms" }}>
            Card Number
          </span>
          <input
            type="text"
            placeholder="0000 0000 0000 0000"
            value={card}
            onChange={(e) => setCard(e.target.value)}
            onFocus={() => setCardFocused(true)}
            onBlur={() => setCardFocused(false)}
            style={inputStyle(cardFocused)}
          />
        </label>

        {/* Split row */}
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%", gap: "15px" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: "5px", width: "130px" }}>
            <span style={{ padding: "0 10px", fontSize: "12px", color: expiryFocused ? "#d17842" : "#8b8e98", fontWeight: 600 }}>
              Expiry Date
            </span>
            <input
              type="text"
              placeholder="01/23"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              onFocus={() => setExpiryFocused(true)}
              onBlur={() => setExpiryFocused(false)}
              style={inputStyle(expiryFocused)}
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: "5px", width: "130px" }}>
            <span style={{ padding: "0 10px", fontSize: "12px", color: cvvFocused ? "#d17842" : "#8b8e98", fontWeight: 600 }}>
              CVV
            </span>
            <input
              type="number"
              placeholder="CVV"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              onFocus={() => setCvvFocused(true)}
              onBlur={() => setCvvFocused(false)}
              style={inputStyle(cvvFocused)}
            />
          </label>
        </div>

        {/* Checkout button */}
        <button
          type="submit"
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          style={{
            marginTop: "20px",
            padding: "20px 0",
            borderRadius: "25px",
            transition: "all 200ms",
            cursor: "pointer",
            fontSize: "20px",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            border: btnHovered ? "2px solid #d17842" : "2px solid transparent",
            justifyContent: "center",
            color: btnHovered ? "#d17842" : "#fff",
            background: btnHovered ? "transparent" : "#d17842",
          }}
        >
          Checkout
        </button>
      </form>
    </section>
  );
};

export default CheckoutPaymentForm;
