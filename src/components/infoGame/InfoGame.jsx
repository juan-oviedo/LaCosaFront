import React from 'react'
import "./InfoGame.css"

const InfoGame = ({ name, turno, rol, obstaculosCuarentena, obstaculosPuertaA }) => {
  return (
    <div className="player-turn">
      Partida:
      {name}
      <br></br> Turno del jugador:
      {turno}
      <br></br>
      Tu rol de jugador:
      {rol}
      <br></br>

      {/* Cuarentenas:
      {obstaculosCuarentena ? obstaculosCuarentena.map((obstaculo) => (
        <div key={obstaculo.id} className="obstaculo-container">
          <div className="obstaculo">ID: {obstaculo.id} Jugador_ID: {obstaculo.jugador_izquierda}</div>
        </div>
      ))
        : null}
      <br></br>
      Puertas Atrancadas:
      {obstaculosPuertaA ? obstaculosPuertaA.map((obstaculo) => (
        <div key={obstaculo.id} className='obstaculoPuerta'>
          <div className='obstaculo1'>ID:{obstaculo.id} Pos_Jugador_Izq: {obstaculo.jugador_izquierda} Pos_Jugador_Der: {obstaculo.jugador_derecha}</div>
        </div>
      )) : null} */}
    </div>
  )
}

export default InfoGame
