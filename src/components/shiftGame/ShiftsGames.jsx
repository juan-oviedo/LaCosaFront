import React, { useEffect, useState } from "react";
import { Snackbar } from "@mui/material";

function ShiftsGames({ phaseShift }) {
  const [open, setOpen] = useState(false); // Inicialmente, el Snackbar está cerrado
  const [text, setText] = useState("");
  const [countdown, setCountdown] = useState(40); // Contador de 20 segundos
  useEffect(() => {
    if (phaseShift === 1) {
      setText("Robar una carta del mazo");
    } else if (phaseShift === 2) {
      setText("Seleccione una carta para jugar");
    } else if (phaseShift === 3) {
      setText("Seleccione una carta para intercambiar");
    }

    if (phaseShift === 1) {
      setOpen(true); // Abre el Snackbar cuando cambia el phaseShift
      // Actualiza el mensaje cada segundo con el tiempo restante
      const interval = setInterval(() => {
        if (countdown > 0) {
          setCountdown(countdown - 1);
        }
      }, 1000);

      // Cerrar el Snackbar después de 20 segundos
      if (countdown == 0) {
        setOpen(false);
      }

      // Limpia el intervalo y el timeout cuando el componente se desmonta o cuando cambia el phaseShift
      return () => {
        clearInterval(interval);
      };
    }
    if (phaseShift === 2) {
      setOpen(true); // Abre el Snackbar cuando cambia el phaseShift
      // Actualiza el mensaje cada segundo con el tiempo restante
    }
    if (phaseShift === 3) {
      setOpen(true); // Abre el Snackbar cuando cambia el phaseShift
      // Actualiza el mensaje cada segundo con el tiempo restante
    }
  }, [phaseShift, countdown]);

  return (
    <div>
      {phaseShift === 1 && (
        <Snackbar
          open={open}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          sx={{ width: "30%" }}
          message={
            <span>
              {text}{" "}
              <span
                style={{
                  color: "blue",
                  fontSize: "20px",
                  backgroundColor: "white",
                  borderRadius: "50px",
                  padding: "5px",
                }}
              >
                {countdown}
              </span>
            </span>
          }
        />
      )}

      {phaseShift === 2 && (
        <Snackbar
          open={open}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          sx={{ width: "30%" }}
          message={<span>{text} </span>}
        />
      )}
      {phaseShift === 3 && (
        <Snackbar
          open={open}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          sx={{ width: "30%" }}
          message={<span>{text} </span>}
        />
      )}
    </div>
  );
}

export default ShiftsGames;
