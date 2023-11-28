import './Card.css';
import React, { useEffect } from 'react';
import { useState } from 'react';
import lanzallamas from '../images/lanzallamas.png';
import sospecha from '../images/sospecha.png';
import cambio_de_lugar from '../images/cambio_de_lugar.png';
import vigila from '../images/vigila.png';
import corras from '../images/corras.png';
import infectado from '../images/infectado.png';
import analisis from '../images/analisis.png';
import whisky from '../images/whisky.png';
import lacosa from '../images/lacosa.png';
import gallardo from '../images/gallardo.png';
import aterrador from '../images/aterrador.png';
import nogracias from '../images/nogracias.png';
import fallaste from '../images/fallaste.png';
import aquiestoybien from '../images/estoybien.png';
import barbacoas from '../images/barbacoas.png';
import seduccion from '../images/seduccion.png';
import cuarentena from '../images/cuarentena.png';
import hacha from   '../images/hacha.png';
import puerta from '../images/puerta.png';
import oops from '../images/oops.png';
import solo_entre_nosotros from '../images/solo_entre_nosotros.png';
import cita_a_ciegas from '../images/cita_a_ciegas.png';
import revelaciones from '../images/revelaciones.png';
import cuerdas_podridas from '../images/cuerdas_podridas.png';
import no_podemos_ser_amigos from '../images/no_podemos_ser_amigos.png';
import olvidadizo from '../images/olvidadizo.png';
import tres_cuatro from '../images/tres_cuatro.png';
import uno_dos from '../images/uno_dos.png';
import ronda_ronda from '../images/ronda_ronda.png';


function Card({ id, type, number, onClick, selectedCard }) {
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    setIsSelected(selectedCard === id)
  }, [selectedCard])

  const toggleSelection = () => {
    onClick(id)
  };

  const cardTypeToImage = {
    Lanzallamas: lanzallamas,
    Sospecha: sospecha,
    CambioDeLugar: cambio_de_lugar,
    VigilaTusEspaldas: vigila,
    MasValeQueCorras: corras,
    Analisis: analisis,
    Whisky: whisky,
    Infeccion: infectado, // Assuming you have an image for "Infeccion" as well
    Aterrador: aterrador,
    NoGracias:  nogracias,
    Fallaste: fallaste,
    AquíEstoyBien: aquiestoybien,
    NadaDeBarbacoas: barbacoas,
    Seduccion: seduccion,
    Cuarentena: cuarentena,
    Hacha: hacha,
    PuertaAtrancada: puerta,
    LaCosa: lacosa,
    Oops:oops,
    SoloEntreNosotros: solo_entre_nosotros,
    CitaACiegas: cita_a_ciegas,
    Revelaciones: revelaciones,
    Olvidadizo: olvidadizo,
    PodemosSerAmigos: no_podemos_ser_amigos,
    CuerdasPodridas: cuerdas_podridas,
    Carta1_2: uno_dos,
    Carta3_4: tres_cuatro,
    RondaYRonda: ronda_ronda,

  };

  const imageSrc = cardTypeToImage[type] || gallardo; // Use a default image if type doesn't match

  return (
    <div
    className={`card ${isSelected ? 'card-enlarged' : ''}`}
    onClick={toggleSelection} // Use the provided click handler
  >
    {/* <div className="card-type">{type}</div> */}
    <img src={imageSrc} alt={`Card ${number} ${type}`} />
  </div>
  );
}
  
  export default Card;
  