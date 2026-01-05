import React, { useState } from "react";

// Card data structure for mapping


export const CreateHome = () => {
  

  return (
    <div style={{
      background: "none",
      minHeight: 360,

      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      <h1 style={{
        fontSize: "2.35rem",
        fontWeight: 800,
        color: "#b435d1",
        background: "linear-gradient(90deg,#ab6bff,#2ab8ed 88%,#af45a4)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        textAlign: "center"
      }}>
        Create Something Amazing
      </h1>
      <p style={{
        fontSize: "1.28rem",
        color: "#888bae",
        marginTop: -2,
        
        textAlign: "center"
      }}>
        Choose your creative tool and bring your ideas to life with AI-powered design
      </p>
      
    </div>
  );
};

export default CreateHome;
