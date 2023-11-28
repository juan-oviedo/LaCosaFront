import React from "react";
import "./Sentido.css";

const Sentido = ({ sentido }) => {
  const animationDirection = sentido === "derecha" ? "normal" : "reverse";
  const estiloTransform = {
    animationDirection: animationDirection,
  };
  return (
  <div class="loader" style={estiloTransform}></div>
  );
};

export default Sentido;
