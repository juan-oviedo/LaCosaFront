import React, { useEffect, useState } from "react";
import "./Table.css";
import Avatar from "@mui/material/Avatar";
import Sentido from "./senseGame/Sentido";

function Table({ players, currentPlayer, gamestatus }) {
  const [currentPlayerName, setCurrentPlayerName] = useState("");
  const playerCount = players.length;
  const angle = 360 / playerCount;
  const parentRadius = 180;
  const childRadius = 40;
  const [obs, setObs] = useState([]);
  const [cua, setCua] = useState([]);

  function verificarCuarentenaJugador(gameStatus) {
    if (!gameStatus || !gameStatus.players || gameStatus.players.length <= 1) {
      console.error("La información del juego no es válida");
      return [];
    }
    const jugadoresVivos = gameStatus.players.filter((player) => player.alive);
    // Ordena la lista de jugadores por posición
    const jugadoresOrdenados = jugadoresVivos.sort(
      (a, b) => a.position - b.position
    );
    const cuarentenaJugadores = new Array(jugadoresOrdenados.length ).fill(false);
    for (let index = 0; index < jugadoresOrdenados.length; index++) {
      if(jugadoresOrdenados[index].cuarentena){
        cuarentenaJugadores[index]=true
      }
    }
    return cuarentenaJugadores;
  }

  function verificarObstaculosEntreJugadores(gameStatus) {
    if (!gameStatus || !gameStatus.players || gameStatus.players.length <= 1) {
      console.error("La información del juego no es válida");
      return [];
    }
    const jugadoresVivos = gameStatus.players.filter((player) => player.alive);
    // Ordena la lista de jugadores por posición
    const jugadoresOrdenados = jugadoresVivos.sort(
      (a, b) => a.position - b.position
    );

    // Inicializa el arreglo de obstáculos entre jugadores
    const obstaculosEntreJugadores = new Array(jugadoresOrdenados.length - 1).fill(false);

    // Itera sobre los jugadores y verifica si hay obstáculos entre ellos
    for (let i = 0; i < jugadoresOrdenados.length - 1; i++) {
      const jugadorActual = jugadoresOrdenados[i];
      const jugadorSiguiente = jugadoresOrdenados[i + 1];

      // Verifica si hay un obstáculo entre el jugador actual y el siguiente
      if (
        jugadorActual.obstaculo_izquierda &&
        jugadorSiguiente.obstaculo_derecha
      ) {
        obstaculosEntreJugadores[i] = true;
      }
    }
    if (
      jugadoresOrdenados[0].obstaculo_derecha &&
      jugadoresOrdenados[jugadoresOrdenados.length - 1].obstaculo_izquierda
    ) {
      obstaculosEntreJugadores[jugadoresOrdenados.length - 1] = true;
    }

    // Devuelve el arreglo de obstáculos entre jugadores
    return obstaculosEntreJugadores;
  }

  useEffect(() => {
    if (currentPlayer) {
      setCurrentPlayerName(currentPlayer.name);
    }
    setObs(verificarObstaculosEntreJugadores(gamestatus));
    setCua(verificarCuarentenaJugador(gamestatus));
  }, [currentPlayer,gamestatus]);
  const totalOffset = parentRadius - childRadius;
  return (
    <div style={{ position: "relative" }}>
      <Sentido sentido={gamestatus.gameInfo.sentido}></Sentido>
      <div className="table">
        {players.map((player, index) => {
          const childStyle = {
            position: "absolute",
            boxShadow:
              currentPlayerName === player
                ? "0 0 20px 5px rgba(225, 216, 24, 5)"
                : "0 0 40px 0 rgba(166, 21, 39, 0)",
            transform: `rotate(${
              index * angle
            }deg) translate(${totalOffset}px)`,
            borderRadius: "20px",
          };
          const playerNameStyle = {
            position: "absolute",
            left: "95%",
            transform: "translate(-50%, -50%)", // Center the text inside the circle,
            textAlign: "center",
            color: "#fff",
            transform: "rotate(90deg)",
            backgroundColor: "black",
            borderRadius: "10px",
            padding: "4px",
          };

          return (
            <div key={index} className="player" style={childStyle}>
              {obs && (
                <h1
                  style={{
                    transform: "rotate(140deg) translate(100px)",
                    position: "absolute",
                    backgroundColor: obs[index] === true ? "red" : "white",
                    borderRadius: "5px",
                    width: "20px",
                    height: "25px",
                    fontSize: "10px",
                    color: "green",
                  }}
                ></h1>
              )}

              {cua && (
                <h1
                  style={{
                    transform: "rotate(110deg) translate(0px)",
                    position: "absolute",
                    backgroundColor:
                      cua[index] === true ? "rgba(255, 0, 0, 0.5)" : "white",
                    borderRadius: "100%",
                    width: cua[index] === true ? "70px" : "0px",
                    height: cua[index] === true ? "70px" : "px",
                    fontSize: "60px",
                    color: "green",
                    zIndex: cua[index] === true ? "99" : "0",
                  }}
                ></h1>
              )}
              <Avatar
                alt="Remy Sharp"
                src="https://avataaars.io/?avatarStyle=Circle&topType=Hat&accessoriesType=Sunglasses&facialHairType=BeardLight&facialHairColor=Brown&clotheType=BlazerShirt&eyeType=Surprised&eyebrowType=FlatNatural&mouthType=Sad&skinColor=Pale"
                sx={{ width: 56, height: 56 }}
              />
              <div className="player-name" style={playerNameStyle}>
                {player}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Table;
