// Main game interface
import { Button, Box, Modal} from "@mui/material";
import "./PageGame.css";
import React, { useState, useEffect} from "react";
import axios from "axios";
import deckimg from "../images/dorso.jpeg";
import Table from "../components/Table";
import Card from "../components/Card";
import ShiftsGames from "../components/shiftGame/ShiftsGames";
import useWebSocketManager from "../utils/WebSocketUtil";
import Notification from "../components/Notification";
import { useNavigate } from "react-router-dom";
import { Snackbar } from "@mui/material";
import ButtonFinishGame from "../components/buttonFinishGame/ButtonFinishGame";
import InfoGame from "../components/infoGame/InfoGame";
//import Sentido from "../components/senseGame/Sentido";
import Chat from "../components/waitingRoom/Chat";
import Logs from "../components/infoGame/Logs";

const buttonStyles = {
  width: "120px",
  background: "#8B0000", // Dark red color
  color: "#ffffff", // White text color
  marginRight: 2,
  marginTop: 1,
  fontSize: "15px",
  padding: "15px 30px",
  fontFamily: "KCWaxMuseum, sans-serif",
  "&:hover": {
    background: "#610101", // Darker red color on hover
  },
};

function PageGame() {
  const [gameStatus, setGameStatus] = useState({
    gameStatus: null,
    players: [],
    gameInfo: {},
  });
  const [showSelectPlayerButtons, setShowSelectPlayerButtons] = useState(false);
  const [showNotificationBox, setShowNotificationBox] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [playerStatus, setPlayerStatus] = useState({});
  const [playerPublicStatus, setPlayerPublicStatus] = useState({});
  const [playerCards, setPlayerCards] = useState([]);
  const [otherPlayers, setOtherPlayers] = useState([]);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentPlayerId, setCurrentPlayerId] = useState(0); // State variable to store the current player ID
  const [leftPlayer, setLeftPlayer] = useState({}); // State variable to store the left player object
  const [rightPlayer, setRightPlayer] = useState({}); // State variable to store the right player object
  //const [nextPlayerInQuarantine, setNextPlayerInQuarantine] = useState(false); // State variable to store the next player in quarantine
  const [phase, setPhase] = useState(0); // State variable to store the phase of the turn [1,2,3
  const userID = sessionStorage.getItem("playerId");
  const gameID = sessionStorage.getItem("id_game");
  const [obstacleRight, setObstacleRight] = useState(false);
  const [obstacleLeft, setObstacleLeft] = useState(false);
  const [showAxeOptionLftRgt, setShowAxeOptionLftRgt] = useState(false);
  // JSON websocket message
  //const [wsMessage, setWsMessage] = useState({}); // State variable to store the websocket message
  const [recoveredMessage, setRecoveredMessage] = useState({}); // State variable to store if the websocket message was recovered

  const [wsChat, setWsChat] = useState(0); 
  const [wsLog, setWsLog] = useState(0);
  const [showQuarantineCards, setShowQuarantineCards] = useState(false);
  const [quarantineCard, setQuarantineCard] = useState([]);
  const [quarantinePlayer, setQuarantinePlayer] = useState();
  const [showCardsDeck, setShowCardsDeck] = useState(false);
  const [showWhiskeyCards, setShowWhiskeyCards] = useState(false); // State variable to store the cards of the whiskey
  const [whiskeyCards, setWhiskeyCards] = useState([]); // State variable to store the cards of the whiskey
  const [whiskeyPlayer, setWhiskeyPlayer] = useState();
  const [exchangableCards, setExchangableCards] = useState([]); // State variable to store the exchangable cards
  const [inExchange, setInExchange] = useState(false); // State variable to store if the player is in exchange
  const [inExchangeWith, setInExchangeWith] = useState(0); // State variable to store the player in exchange with
  const [cardInExchange, setCardInExchange] = useState(0); // State variable to store the card in exchange
  const [showPlayOrDiscardOption, setShowPlayOrDiscardOption] = useState(false); // State variable to store Play or Discard
  const [showPlayerCards, setShowPlayerCards] = useState(true);
  const [showSelectPlayersButtons, setShowSelectPlayersButtons] = useState(false);
  const [showSelectPlayerButtons2, setShowSelectPlayerButtons2] = useState(false);
  const [showInfoCardsPlayers, setShowInfoCardsPlayers] = useState([]); // State variable to store the cards of other's players
  const [infoCardsPlayer, setInfoCardsPlayer] = useState(); 
  const [showResponseCards, setShowResponseCards] = useState(false); // State variable to store habilited show cards
  const [showMessengeCardStolen, setShowMessengeCardStolen] = useState(false);
  const [showSelectDefenseButtons, setShowSelectDefenseButtons] = useState(false); // State variable to store the card of defense
  const [cardDefense, setCardDefense] = useState([]); // State variable to store the card of defense
  const [showAddObstacleOption, setShowAddObstacleOption] = useState(false); // State variable to store the card of defense
  const [playerAttack, setPlayerAttack] = useState();
  const [defense, setDefense] = useState(false);
  const [inSeduccion, setInSeduccion] = useState(false);
  const [cardPanic,setCardPanic] = useState({});
  const [showCardPanic,setShowCardPanic] = useState(false);
  const [showPlayPanicCard,setShowPlayPanicCard] = useState(false);
  const [showCardsRevelacion,setShowCardsRevelacion] = useState(false);
  const [aliveplayer,setAlivePlayer] = useState(true);
  const [open, setOpen] = useState(false);

  // function to wait n seconds
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Handle notifications from the server
  const handleWebSocketMessage = (event) => {
    const data = JSON.parse(event.data);
    //setWsMessage(data);
    console.log("WebSocket message received:");
    console.log(data);
    if (data.type === 'gameStatus') {
      console.log("gameStatus notification received");
      fetchGameStatus();
    }
    if (data.type === 'playerStatus') {
      console.log("playerStatus notification received");
      fetchPlayerStatus();
    }
    if (data.type === 'exchangeSolicitude') {
      console.log('exchangeSolicitude notification received')
      getExchangableCards();
      wait(1000); // Wait 1 second
      console.log(data.payload);
      setInExchangeWith(data.payload.player);
      setShowPlayerCards(false);
      setShowPlayOrDiscardOption(false);
      setShowNotificationBox(false);
      setInExchange(true);
    }
    if (data.type === 'Whisky') {
      // Recibimos notificacion para mostrar las cartas a todos los jugadores
      console.log("Whisky notification received");
      const payload = data.payload;
      console.log(payload);
      handleWhiskey(payload.player);
      setWhiskeyPlayer(payload.player);
      setShowWhiskeyCards(true);
      setShowCardPanic(false);
      setShowPlayPanicCard(false);
      // Luego, hacer una funcion para hacer un get del nuevo endpoint donde obtengo las cartas
      // luego mostrarlas en la pantalla para los id diferentes al que recibio la notificacion
    }
    if (data.type === 'defenseSolicitude') {
      console.log("defense notification received");
      setShowPlayerCards(false);
      setShowNotificationBox(false);
      // Mostramos los botones para defenderse
      setShowSelectDefenseButtons(true);
      // Si recibo el id de la carta de defensa, lo guardo en una variable para poder usarlo
      setCardDefense(data.payload.cards);
      setPlayerAttack(data.payload.player);
      setDefense(true);
    }
    if (data.type === 'Seduccion') {
      console.log('Seduccion notification received')
      const payload = data.payload;
      getExchangableCards();
      wait(1000); // Wait 1 second
      setShowPlayerCards(false);
      setShowPlayOrDiscardOption(false);
      setInExchange(true);
      setInSeduccion(true);
      setInExchangeWith(payload.player_to);
      setCardInExchange(0);
      setShowNotificationBox(false);
    }
    if (data.type === 'exchangeSolicitude_Seduccion') {
      console.log('exchangeSolicitude seduccion notification received')
      getExchangableCards();
      wait(1000); // Wait 1 second
      const payload = data.payload;
      console.log(payload);
      setInExchangeWith(payload.player);
      setShowNotificationBox(false);
      //setCardInExchange(payload.card_id);
      setInExchange(true);
      setInSeduccion(true);
    }
    if (data.type === 'message') {
      setNotificationMessage(data.payload);
      setShowNotificationBox(true);
    }
    if (data.type === 'quarantine') {
      const payload = data.payload;
      setShowQuarantineCards(true);
      setQuarantinePlayer(payload.player);
      handleQuarantine(payload.player);
    }
    if(data.type === 'playAgain'){
      console.log("no se defendio");
      const payload = data.payload;
      playCard(payload.card_to_play,payload.player_to);
    }
    if(data.type === 'revelaciones'){
      console.log("mensaje de revelaciones");
      setShowCardsRevelacion(true);
    }
    if(data.type === 'showInfection'){
      const payload = data.payload;
      sendRevelacionInfection(payload.player);
      setShowWhiskeyCards(true);
      setShowCardPanic(false);
      setShowPlayPanicCard(false);
    }
    if (data.type === 'turnFinished'){
      console.log('turnFinished notification received')
      setInExchange(false);
      setShowPlayerCards(true);
    }
    if (data.type === 'chat'){
      console.log('chat notification received')
      setWsChat((prevwsChat)=> prevwsChat + 1);
      console.log(wsChat)
    }
    if (data.type === 'log'){
      console.log('log notification received')
      setWsLog((prevwsLog)=> prevwsLog + 1);
    }

  };

  // function to recover last websocket message if the user refresh the page
  const recoverLastWsMessage = async () => {
    try {
      wait(1000); // Wait 1 second
      // Make a GET request to fetch last websocket message based on the game ID
      const response = await axios.get(
        `https://lacosa.adaptable.app/game/lastMessage?id_game=${gameID}&id_player=${userID}`
      );
      if (response.status === 200) {
        console.log("Last websocket message fetched successfully!");
        console.log(response.data);
        setRecoveredMessage(response.data);
        
      } else if (response.status === 204) {
        console.log("No hay mensajes para el jugador");
      } else {
        console.log("Error fetching last websocket message!");
      }
    } catch (error) {
      console.error("Error fetching last websocket message:", error);
    }
  };

  // Connect to the WebSocket server
  useWebSocketManager({ handleWebSocketMessage, recoverLastWsMessage, gameID, userID });

  // fetch game status
  const fetchGameStatus = async () => {
    try {
      // Make a GET request to fetch game status based on the game ID
      const response = await axios.get(
        `https://lacosa.adaptable.app/game/status?id_game=${gameID}`
      );

      // Set the players state with the data from the response
      setGameStatus(response.data);
    } catch (error) {
      console.error("Error fetching status:", error);
    }
  };

  // fetch player status
  const fetchPlayerStatus = async () => {
    try {
      // Make a get request to fetch player status based on the game ID and user ID /status/player
      const response = await axios.get(
        `https://lacosa.adaptable.app/game/playerstatus?id_game=${gameID}&id_player=${userID}`
      );
      // Set the players state with the data from the response
      setPlayerStatus(response.data);
    } catch (error) {
      console.error("Error fetching status:", error);
    }
  };

  // Get initial game status and player status
  useEffect(() => {
    fetchGameStatus();
    fetchPlayerStatus();
  }, []);

  // Get initial player status
  useEffect(() => {
    fetchPlayerStatus();
    fetchGameStatus();
  }, [gameID, userID]);

  // Update player cards and alive status
  useEffect(() => {
    const playerObject = playerStatus;
    console.log(playerObject);
    setPlayerStatus(playerObject);
    if (playerStatus?.cards) {
      setPlayerCards(playerStatus.cards);
    }
    // if (playerStatus?.alive) {
    //   setPlayerAlive(playerStatus.alive);
    // }
  }, [playerStatus]);

  // fetch exchangable cards
  const getExchangableCards = async () => {
    try {
      // Make a get request to fetch exchangable cards based on the game ID and user ID
      const response = await axios.get(
        `https://lacosa.adaptable.app/card/change/${userID}`
      );
      // Set the players state with the data from the response
      setExchangableCards(response.data);
    } catch (error) {
      console.error("Error fetching status:", error);
    }
  };
 


  const handleWhiskey = async (playerW) => {
    try {
      const response = await axios.get(
        `https://lacosa.adaptable.app/card/cards/${playerW}`
      );
      if (response.status === 200) {
        console.log(response.data);
        setWhiskeyCards(response.data);
      }
    } catch (error) {
      console.error("Error getting cards:", error);
    }
  };

  const drawCard = async () => {
    try {
      // Make a POST request to draw a card
      const response = await axios.post(
        `https://lacosa.adaptable.app/card/steal_card/${userID}`);
      // Check if the post return success
      if (response.status === 200) {
        console.log("Card drawn successfully!");
        setShowCardsDeck(false);
        setShowMessengeCardStolen(true);
        const typeCard = response.data.type;
        if(typeCard === "SoloEntreNosotros" || typeCard === "Revelaciones" || typeCard === "CitaACiegas" || typeCard === "Oops" || typeCard === "CadenasPodridas" || typeCard === "RondaYRonda" || typeCard === "PodemosSerAmigos" || typeCard === "Olvidadizo" || typeCard === "Carta1_2" || typeCard === "Carta3_4"){
          console.log("Robo Carta de Panico!!!!!!!",response.data);
          setCardPanic(response.data);
          setShowCardPanic(true); 
          setShowPlayerCards(false);
          setShowCardsDeck(false);
          setShowPlayPanicCard(true);
        }
      
      } else {
        console.log("Error drawing card!");
      }
    } catch (error) {
      console.error("Error drawing card:", error);
    }
  };


  // exchange cards 1
  const exchangeCards1 = async (player_to_id, card_id) => {
    try {
      // Hide elements until the exchange is done
      setShowPlayerCards(false);
      setShowSelectPlayerButtons(false);
      setShowPlayOrDiscardOption(false);
      setShowCardsDeck(false);
      setNotificationMessage(
        "Espere mientras se realiza el intercambio de cartas"
      );
      setShowNotificationBox(true);
      // Make post request to exchange cards
      const response = await axios.post(`https://lacosa.adaptable.app/card/change1`, {
        player_id: userID,
        player_to_id: player_to_id,
        card_id: card_id,
      });

      // Check if the post return success and show notification
      if (response.status === 200) {
        console.log("Cards exchanged successfully!");
        // setNotificationMessage("Cartas intercambiadas con éxito");
        // setShowNotificationBox(true);
        //setShowCardsDeck(true);
        setShowPlayerCards(true);
        setInExchange(false);
        setInExchangeWith(0);
        setCardInExchange(0);
        setSelectedCard({});
      } else {
        console.log("Error exchanging cards!");
      }
    } catch (error) {
      console.error("Error exchanging cards:", error);
    }
  };

  // exchange cards 2
  const exchangeCards2 = async (
    inExchangeWith,
    userID,
    selectedCardId
  ) => {
    try {
      console.log("inExchangeWith", inExchangeWith);
      console.log("userID", userID);
      console.log("selectedCard", selectedCardId);

      // Make post request to exchange cards
      const response = await axios.post(`https://lacosa.adaptable.app/card/change2`, {
        player_id: inExchangeWith,
        player_to_id: userID,
        card_id2: selectedCardId,
      });

      // Check if the post return success and show notification
      if (response.status === 200) {
        console.log("Cards exchanged successfully!");
        // setNotificationMessage("Cartas intercambiadas con éxito");
        // setShowNotificationBox(true);
        setShowPlayerCards(true);
        setInExchangeWith(0);
        setCardInExchange(0);
        setSelectedCard({});
        setShowPlayOrDiscardOption(false);
        setShowSelectPlayerButtons(false);
        setInExchange(false);
        fetchGameStatus();
      } else {
        //setInExchange(false);
        console.log("Error exchanging cards!");
      }
    } catch (error) {
      console.error("Error exchanging cards:", error);
    }
  };

  const handleSeduccion = async (player_to_id, card_id) => {
    try {
      const response = await axios.post(
        `https://lacosa.adaptable.app/card/change_in_play_1`,
        {
          player_id: userID,
          player_to_id: player_to_id,
          card_id: card_id,
        }
      );
      // Check if the post return success and show notification
      if (response.status === 200) {
        console.log("Seduccion cards exchanged successfully!");
        setShowPlayerCards(true);
        setInExchange(false);
        setInExchangeWith(0);
        setCardInExchange(0);
        setSelectedCard({});
      } else {
        console.log("Error exchanging cards!");
      }


    }
    catch (error) {
      console.error("Error exchanging cards:", error);
    }
  }

  const handleSeduccion2 = async (inExchangeWith, userID, selectedCard) => {
    try {
      console.log("inExchangeWith", inExchangeWith);
      console.log("userID", userID);
      console.log("cardInExchange", cardInExchange);
      console.log("selectedCard", selectedCard);

      // Make post request to exchange cards 
      const response = await axios.post(
        `https://lacosa.adaptable.app/card/change_in_play_2`
        , {
          player_id: inExchangeWith,
          player_to_id: userID,
          card_id2: selectedCard,
        }
      );


      // Check if the post return success and show notification
      if (response.status === 200) {
        console.log("Cards exchanged successfully!");
        // setNotificationMessage("Cartas intercambiadas con éxito");
        // setShowNotificationBox(true);
        setInExchange(false);
        setShowPlayerCards(true);
        setInExchangeWith(0);
        setCardInExchange(0);
        setSelectedCard({});
        setShowPlayOrDiscardOption(false);
        setShowSelectPlayerButtons(false);
      } else {
        console.log("Error exchanging cards!");
      }


    }
    catch (error) {
      console.error("Error exchanging cards:", error);
    }
  }

  // Update player cards and alive status
  useEffect(() => {
    if (playerStatus?.cards) {
      setPlayerCards(playerStatus.cards);
    }

  }, [playerStatus]);


  // Check if the game is finished
  const navigate = useNavigate();

  useEffect(() => {
    console.log(gameStatus.gameStatus);
    if (gameStatus.gameStatus === "FINISH") {
      //Cambia a la pagina de resultados
      navigate(`/resultados/${gameID}`);
    }
  }, [gameStatus, gameID]);

  // Update players on table (otherPlayers) and current player (currentPlayerId)
  useEffect(() => {
    // CAMBIO LA CONDICIÓN DE QUE PLAYER STATUS !== HUMAN YA QUE ESO NO LLEGA MAS POR EL GAME STATUS
    const otherPlayersObject = gameStatus.players
      .filter((player) => player.id !== userID && player.alive)
      .sort((a, b) => a.position - b.position) // Sort based on player IDs
      .map((player) => player.name);

    setOtherPlayers(otherPlayersObject);
    setCurrentPlayerId(gameStatus.gameInfo.jugadorTurno);
    setPhase(gameStatus.gameInfo.faseDelTurno);
    //check the phase of the turn
    if (currentPlayerId === playerStatus.id) {
      if (phase === 1) {
        setShowCardsDeck(true);
        setShowPlayerCards(true);
        setShowPlayOrDiscardOption(false);
        setShowSelectPlayerButtons(false);
        setShowNotificationBox(false);
      } else if (phase === 2) {
        setShowPlayerCards(true);
        setShowPlayOrDiscardOption(false);
        setShowSelectPlayerButtons(false);
        setShowCardsDeck(false);
        setShowNotificationBox(false);

      } else if (phase === 3) {
        setShowPlayerCards(false);
        setShowPlayOrDiscardOption(false);
        getExchangableCards();
        //fetchGameStatus();
        wait(1000); // Wait 1 second
        setInExchange(true);
        const inExcWith = gameStatus.gameInfo.sentido === "derecha" ? leftPlayer.id : rightPlayer.id;
        if (inExcWith) {
          setInExchangeWith(inExcWith);
        }else {
          fetchGameStatus();
        }
        setCardInExchange(0);
        setShowNotificationBox(false);

      }
    } else {
      setShowPlayerCards(true);
      setInExchange(false);
    }
  }, [gameStatus, phase, userID, playerStatus]);

  // Update leftPlayer and rightPlayer according to user.position
  useEffect(() => {
    if (playerStatus !== undefined) {
      const leftPlayerPos =
        (playerStatus.position + 1) % gameStatus.gameInfo.jugadoresVivos;

      const rightPlayerPos =
        playerStatus.position > 0
          ? playerStatus.position - 1
          : gameStatus.gameInfo.jugadoresVivos - 1;


      const leftPlayerObject = gameStatus.players.find(
        (player) => player.position === leftPlayerPos
      );

      const rightPlayerObject = gameStatus.players.find(
        (player) => player.position === rightPlayerPos
      );

      const nxtPlayerObjId =  gameStatus.gameInfo.sentido === "derecha" ? leftPlayer.id : rightPlayer.id;
      const nextPlayerObject = gameStatus.players.find(
        (player) => nxtPlayerObjId === player.id);

      if (nextPlayerObject) {
        //setNextPlayerInQuarantine(nextPlayerObject.cuarentena);
      }

      const playerPublicObject = gameStatus.players.find(
        (player) => player.id === playerStatus.id
      );

      if (leftPlayerObject && rightPlayerObject) {
        setLeftPlayer(leftPlayerObject);
        setRightPlayer(rightPlayerObject);
        setPlayerPublicStatus(playerPublicObject);
      }

      if (playerPublicObject && leftPlayerObject && rightPlayerObject) {
        const obsLeft = playerPublicObject.obstaculo_izquierda || leftPlayerObject.cuarentena;
        const obsRight = playerPublicObject.obstaculo_derecha || rightPlayerObject.cuarentena;
        console.log("obsLeft", obsLeft);
        console.log("obstaculo_izquierda", playerPublicObject.obstaculo_izquierda);
        console.log("obstaculo_derecha", playerPublicObject.obstaculo_derecha);
        console.log("obsRight", obsRight);

        setObstacleLeft(obsLeft);
        setObstacleRight(obsRight);
        setAlivePlayer(playerPublicObject.alive);
      }


    }
  }, [playerStatus, userID, gameStatus]);

  // Define a function to handle deck click
  const handleDeckClick = () => {
    console.log("Deck clicked");
    if (phase === 1 && currentPlayerId === userID) {
      drawCard();
    }
    //setShowCardsDeck(false);
  };

  // Define a function to handle card click
  const handleCardClick = (clickedCard) => {
    // Check if it is the player's turn and the phase of playing
    if (currentPlayerId === userID) {
      setShowAddObstacleOption(false);
      // DRAW FROM DECK
      if (phase === 1) {
        //NOTHING
      }
      // PLAY OR DISCARD
      else if (phase === 2) {
        // Enables and disables the play or discard button.
        if (selectedCard.id === clickedCard) {
          setSelectedCard({});
          setShowPlayOrDiscardOption(false);
        } else {
          // Otherwise, update the selected card.
          setSelectedCard(clickedCard);
          // Displays the option to play or discard
          setShowPlayOrDiscardOption(true);
        }
        // IT DO NOT HAVE TO ENTER HERE
      } else if (phase === 3) {
        if (inExchange) {
          setShowPlayerCards(false);
          setShowNotificationBox(false);
          setNotificationMessage("");
        }
      }
    } else if (defense) {
      if (selectedCard.id === clickedCard) {
        setSelectedCard({});
      } else {
        setSelectedCard(clickedCard);
      }
    }
  };

  // Define a function to handle play card click
  const handlePlayCardClick = async (clickedCard) => {
    // Check if it is the player's turn and the phase of playing
    if (currentPlayerId === userID && phase === 2) {
      switch (clickedCard.type) {
        case 'Lanzallamas':
          setShowPlayOrDiscardOption(false);
          setShowSelectPlayerButtons2(true);
          break;
        case 'Empty':
          // chequear que esté ok pasar null como id_player_target
          setShowSelectPlayerButtons(false);
          setShowPlayOrDiscardOption(false);

          // No colgar en borrar el userID
          playCard(clickedCard.id, userID);
          break;
        case 'VigilaTusEspaldas':
          setShowSelectPlayerButtons(false);
          setShowPlayOrDiscardOption(false);
          playCard(clickedCard.id, userID);
          break;
        case 'CambioDeLugar':
          setShowPlayOrDiscardOption(false);
          setShowSelectPlayerButtons(true);
          break;
        case 'MasValeQueCorras':
          setShowPlayOrDiscardOption(false);
          setShowSelectPlayersButtons(true);
          break;
        case 'Seduccion':
          setShowPlayOrDiscardOption(false);
          setShowSelectPlayersButtons(true);
          break;
        case 'Analisis':
          setShowPlayOrDiscardOption(false);
          setShowSelectPlayerButtons2(true);
          break;
        case 'Sospecha':
          setShowPlayOrDiscardOption(false);
          setShowSelectPlayerButtons2(true);
          break;
        case 'Whisky':
          setShowPlayOrDiscardOption(false);
          playCard(clickedCard.id, userID);
          break;
        case 'Hacha':
          setShowPlayOrDiscardOption(false);
          // obstacleLeft/Right takes into account the quarantine and the closed door
          if (obstacleLeft || obstacleRight || playerPublicStatus.cuarentena) {
            setShowAxeOptionLftRgt(true);
          }
          else {
            setNotificationMessage("No hay obstáculos para eliminar");
            setShowNotificationBox(true);
          }
          break;
        case 'Cuarentena':
          setShowPlayOrDiscardOption(false);
          setShowSelectPlayerButtons(true);
          setShowSelectPlayerButtons2(false);
          break;
        case 'PuertaAtrancada':
          if ((obstacleLeft && !leftPlayer.cuarentena) && (obstacleRight && !rightPlayer.cuarentena)) {
            setNotificationMessage("Ya tiene obstáculos de ambos lados, no se puede colocar uno nuevo");
            setShowNotificationBox(true);
          }
          setShowPlayOrDiscardOption(false);
          setShowSelectPlayerButtons(false);
          setShowAddObstacleOption(true);
          break;
        case "CitaACiegas":
          setShowSelectPlayerButtons(false);
          setShowPlayOrDiscardOption(false);
          setShowCardPanic(false);
          setShowPlayPanicCard(false);
          playCard(clickedCard.id, userID);
          break;
        case "Oops":
          setShowSelectPlayerButtons(false);
          setShowPlayOrDiscardOption(false);
          playCard(clickedCard.id, userID);
          break;
        case "Revelaciones":
          setShowSelectPlayerButtons(false);
          setShowPlayOrDiscardOption(false);
          setShowCardPanic(false);
          playCard(clickedCard.id, userID);
          break;
        case "SoloEntreNosotros":
          setShowPlayPanicCard(false);
          setShowSelectPlayerButtons(true);
          break;
        default:
          setNotificationMessage("Intente jugar otra carta");
          setShowNotificationBox(true);
          console.log("Card type not recognized!");
      }
    } else {
      console.log("Not your turn or not the phase of playing!");
    }
  };

  // Enables to display response cards
  useEffect(() => {
    if (showInfoCardsPlayers && showInfoCardsPlayers.length > 0) {
      setShowResponseCards(true);
    } else {
      console.log("No letters to display");
    }
  }, [showInfoCardsPlayers]);

  // Set the game to continue after viewing the card
  const handleContinueGame = () => {
    // Seteamos para dejar de mostrar las cartas
    setShowResponseCards(false);
    setShowWhiskeyCards(false);
    setShowInfoCardsPlayers([]);
    setWhiskeyCards([]);
    setInfoCardsPlayer();
    setWhiskeyPlayer();
    setQuarantinePlayer();
    setShowQuarantineCards(false);
    setOpen(false);
  };

  // Define a function to handle Discard card click
  const handleDiscardCard = async (selectedCard) => {
    if (currentPlayerId === userID && showPlayOrDiscardOption) {
      try {
        console.log("Enviando solicitud de descarte de carta...");
        console.log("gameID:", gameID);
        console.log("userID:", userID);
        console.log("selectedCard.id:", selectedCard.id);

        //Make a POST request to discard the card
        const response = await axios.post(
          `https://lacosa.adaptable.app/card/discard_card/${userID}/${selectedCard.id}`,
          {
            id_game: gameID,
          }
        );

        if (response.status === 200) {
          //if (true) {
          console.log("Card discarded successfully!");
          setShowPlayOrDiscardOption(false);

          // Delete the Discard Card of the state playerCards
          const updatedPlayerCards = playerCards.filter(
            (card) => card.id !== selectedCard.id
          );
          setPlayerCards(updatedPlayerCards);
        }
      } catch (error) {
        console.error("Error discarding card:", error);
      }
    }
  };

  // Define a function to handle card play
  const playCard = async (id_cardD, id_player_target) => {
    try {
      // Make a POST request to play a card
      // Chequear que se esté haciendo bien el post
      const response = await axios.post(
        `https://lacosa.adaptable.app/card/play_card1`,
        {
          id_game: gameID,
          id_player: userID,
          id_player_to: id_player_target,
          id_card: id_cardD,
        }
      );
      console.log(response.data);
      // Check if the post return success
      if (response.status === 200) {
        console.log("Card played successfully!");
        setShowSelectPlayerButtons(false);
        setShowAxeOptionLftRgt(false);
        setShowAddObstacleOption(false);
        console.log("card: ", response.data.card);
        console.log("cards: ", response.data.cards);
        // Setea si recibe las cartas del caso Analisis o Whisky
        if (response.data.cards) {
          console.log("CASO ANALISIS O WHISKY");
          setShowInfoCardsPlayers(response.data.cards); // Me envian en [{},{},{}...]
          setInfoCardsPlayer(id_player_target);
        }
        // Setea si recibe una carta del caso "Sospecha"
        else if (response.data.card) {
          console.log("CASO SOSPECHA");
          setShowInfoCardsPlayers([response.data.card]); // Me envian {} entonces los guardamos asi [{}]
          setInfoCardsPlayer(id_player_target);
        }
      } else {
        console.log("Error playing card!");
      }
    } catch (error) {
      console.error("Error playing card:", error);
    }
  };

  // Si recibo como parametro el id de la carta que debo jugar, entonces hago un post
  // el id de la carta de defensa es lo que recibo como parametro por websockets
  const PlayDefenseCards = async (card, condicionDef) => {
    try {
      // Make a get request to fetch defense cards based on the game ID and user ID
      console.log(card, condicionDef, playerStatus.id, playerAttack);
      const response = await axios.post(
        `https://lacosa.adaptable.app/card/play_card2`,
        {
          // los datos que tengo que enviar al back son: id_game, id_player, id_card
          id_player: playerAttack,
          id_player_to: Number(userID),
          id_card_2: card, // id de la carta de defensa
          defense: condicionDef, // booleano que indica si me quiero defender o no
        }
      );
      console.log(response.data);
      // Set the players state with the data from the response
      if (response.status === 200) {
        setShowSelectDefenseButtons(false);
        console.log("card: ", response.data.card);
        console.log("Card played successfully!");
        // si la carta de defensa es "Defensa Aterradora" entonces recibo una carta
        if (response.data.card) {
          console.log("CASO DEFENSA ATERRADOR");
          const card = response.data.card;
          const card_data = {
            "id": -1,
             "name": card.card,
            "description":card.description
            }
          setShowInfoCardsPlayers([card_data]);
          setInfoCardsPlayer(playerAttack);
          setShowResponseCards(true); // Me envian {} entonces los guardamos asi [{}]
        }
      } else {
        console.log("Error playing card!");
      }
    } catch (error) {
      console.error("Error playing card:", error);
    }
  };

  // Define a function to handle player selection
  const handlePlayerSelection = async (targetPlayerId) => {
    // Process the player selection here
    console.log(`Player selected: ${targetPlayerId}`);
    console.log(`Card selected: ${selectedCard.id}`);
    console.log(`target id: ${targetPlayerId}`);
    if (selectedCard.type === 'Cuarentena' && gameStatus.players.find((player) => player.id === targetPlayerId).cuarentena) {
      setNotificationMessage("El jugador ya tiene cuarentena");
      setShowNotificationBox(true);
    } else {
      playCard(selectedCard.id, targetPlayerId);
      setShowSelectPlayerButtons(false);
      setShowSelectPlayerButtons2(false);
      setShowSelectPlayersButtons(false);
      setSelectedCard({});
      setShowCardPanic(false);
    }
  };

  // Define a function to handle notification OK click
  const handleNotificationOKClick = () => {
    // Check if it is the player's turn and the phase
    if (currentPlayerId === userID && inExchange) {
      //NOTHING, WAIT FOR THE OTHER PLAYER TO EXCHANGE
      // chequear que sea necesario setear o si ya vienen seteados
      setShowCardsDeck(false);
      setShowPlayerCards(false);
    } else {
      setNotificationMessage("");
      setShowNotificationBox(false);
    }
  };


  // Handle exchange solicitude
  const handleExchangeSolicitude = (exchangeCard) => {
    console.log("inExchangeWith", inExchangeWith);
    console.log("userID", userID);
    console.log("leftPlayer.id", leftPlayer.id);
    if (inExchange && inSeduccion && currentPlayerId === userID) {
      handleSeduccion(inExchangeWith, exchangeCard);
      setInSeduccion(false);
    }
    if (currentPlayerId !== userID && inExchange && inSeduccion) {
      handleSeduccion2(inExchangeWith, userID, exchangeCard);
      setInSeduccion(false);
    }
    // Here when player is not in turn and received a solicitude to exchange
    if (currentPlayerId !== userID && inExchange && !inSeduccion) {
      exchangeCards2(inExchangeWith, userID, exchangeCard);
      // Here when player is in turn and in phase of exchanging
      // In this case we call the exchangeCards function that touches the /change endpoint
    } else if (currentPlayerId === userID && inExchange && !inSeduccion) {
      exchangeCards1(inExchangeWith, exchangeCard);
    }
  };

  const findUserNameById = (id) => {
    const player = gameStatus.players.find((player) => player.id === id);
    return player ? player.name : "Usuario no encontrado";
  };

  // function to handle eliminination of obstacle between left player and user 
  const handleLftPlayerObstacle = (selectedCardId) => {
    // find obstacle id from obstacle list in gameStatus.gameInfo.obstaculosPuertaAtrancada
    // that has jugador_izquierda === leftPlayer.id and jugador_derecha === userID
    console.log("gameStatus.gameInfo.obstaculosPuertaAtrancada", gameStatus.gameInfo.obstaculosPuertaAtrancada);
    console.log("leftPlayer.position", leftPlayer.position);
    console.log("playerStatus.position", playerStatus.position);
    console.log("playerStatus", playerStatus);
    console.log("leftPlayer", leftPlayer);
    const obstacle = gameStatus.gameInfo.obstaculosPuertaAtrancada.find((obstacle) =>
      (obstacle.jugador_izquierda === leftPlayer.position)
    );
    console.log("Obstacle obtained from gameStatus. obstacle:", obstacle);
    const obstacleId = obstacle ? obstacle.id : null;

    if (obstacleId) {
      playCard(selectedCardId, obstacleId);
      setShowAxeOptionLftRgt(false);
    } else {
      console.log("ERROR: No obstacle found that matchs the left player and the user");
    }
  };

  // function to handle right player quarantine elimination
  const handleRgtPlayerObstacle = (selectedCardId) => {
    // find obstacle id from obstacle list in gameStatus.gameInfo.obstaculosPuertaAtrancada
    //the one that has jugador_izquierda === userID and jugador_derecha === rightPlayer.id
    console.log("gameStatus.gameInfo.obstaculosPuertaAtrancada", gameStatus.gameInfo.obstaculosPuertaAtrancada);
    console.log("rightPlayer", rightPlayer.position);
    console.log("playerStatus.position", playerStatus.position);
    console.log("playerStatus", playerStatus);
    console.log("rightPlayer", rightPlayer);
    const obstacle = gameStatus.gameInfo.obstaculosPuertaAtrancada.find((obstacle) =>
      (obstacle.jugador_izquierda === playerStatus.position)
    );
    const obstacleId = obstacle ? obstacle.id : null;
    if (obstacleId) {
      playCard(selectedCardId, obstacleId);
      setShowAxeOptionLftRgt(false);
    } else {
      console.log("ERROR: No obstacle found that matchs the right player and the user");
    }
  };

  const handleQuarantine = async (player_id) => {
    try{
      const response = await axios.get(
        `https://lacosa.adaptable.app/card/show_card/${player_id}`
      );
      console.log(response.data);
      if (response.status === 200) {
        console.log(response);
        setQuarantineCard([response.data]);
      }
    }
    catch (error) {
      console.error("Error getting cards in quarantine", error);
    }
  };

  // function to handle quarantine elimination
  const handleRemoveQuarantine = (selectedCardId, playerId) => {
    // find obstacle id from obstacle list in gameStatus.gameInfo.obstaculosCuarentena
    const obstacleId = gameStatus.gameInfo.obstaculosCuarentena.find((obstacle) =>
      obstacle.jugador_izquierda === playerId).id;
    console.log("Obstacle obtained from gameStatus. obstacleId:", obstacleId);
    if (obstacleId) {
      playCard(selectedCardId, obstacleId);
      setShowAxeOptionLftRgt(false);
    } else {
      console.log("ERROR: No quarantine found that matchs the player, playerId: ", playerId);
    }
  };


// Trigger handle websocket message with the recovered message
useEffect(() => {
  if (recoveredMessage && recoveredMessage.type) {
      console.log("Handling recovered WebSocket message:");
      console.log(recoveredMessage);

      // Call handleWebSocketMessage with the recovered message
      handleWebSocketMessage({ data: JSON.stringify(recoveredMessage) });
  }
}, [recoveredMessage]);

  //Draw card automatically
  useEffect(() => {
    if (
      gameStatus.gameInfo.jugadorTurno === userID &&
      gameStatus.gameInfo.faseDelTurno === 1
    ) {
      const timeOut = setTimeout(() => {
        axios
          .post(`https://lacosa.adaptable.app/card/steal_card/${userID}`)
          .then((res) => {
            console.log(res);
            setShowMessengeCardStolen(true);
          })
          .catch((error) => {
            console.log(error);
          });
      }, 40000);
      return () => clearTimeout(timeOut);
    }
  });


  useEffect(() => {
    recoverLastWsMessage();
  }, []);

  const sendRevelacion = (show_cards,show_infection) =>{
    const url="https://lacosa.adaptable.app/card/revelaciones";
    const data = {
      id_player: userID,
      show_cards: show_cards,
      show_infection: show_infection
    }
    axios.post(url,data)
    .then((response) => {
      if(response.status === 200){
        setShowCardsRevelacion(false)}
      })
    .catch((error)=>console.log(error))

  }
  const sendRevelacionInfection = (playerId) =>{
    const url = `https://lacosa.adaptable.app/card/show_infection?id_player=${playerId}`;
    axios.post(url)
    .then((response) => {
      if(response.status === 200)
      console.log(response.data);
    const card = response.data
     const card_data = {
        "id": card.id,
         "name": card.type,
        "description": card.description
    }
    console.log("Cartaaa infeccion revelacion",card_data)
    setShowInfoCardsPlayers([card_data]);
    setInfoCardsPlayer(playerId);
    setShowResponseCards(true);
    setShowCardsRevelacion(false);
    })
    .catch((error)=>console.log(error))

  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box className="containerGame">
      {playerStatus && playerStatus.status === "theThing" && (
        <ButtonFinishGame gameID={gameID} playerID={userID}></ButtonFinishGame>
      )}
      {
        !aliveplayer && (
          <div>
            <div className="gameOver">
              <h1>ESTÁS MUERTO</h1>
            </div>
            <Button href="/" variant="contained" style={buttonStyles}>Salir</Button>
          </div>
        )
      }
        <div>
          <Button sx={buttonStyles} onClick={handleOpen}>Open Game Info </Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <Box sx={{ width: '20%', bgcolor: '#A62515', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
              <InfoGame
                name={gameStatus.name}
                turno={findUserNameById(gameStatus.gameInfo.jugadorTurno)}
                rol={playerStatus.status}
                obstaculosCuarentena={gameStatus.gameInfo.obstaculosCuarentena}
                obstaculosPuertaA={gameStatus.gameInfo.obstaculosPuertaAtrancada}
              ></InfoGame>
              <Button sx={buttonStyles} onClick={handleClose}>
                Close
              </Button>
            </Box>
          </Modal>
        </div>
        <div className="cardDeck">
        {showCardsDeck && (
          <div>
            <img src={deckimg} alt="Deck" onClick={handleDeckClick} />
          </div>
        )}
      </div>
      <div className="chatContainer">
          <Chat gameID={gameID} userID={userID} wsMsg={wsChat} />
      </div>
      <div className="logContainer">
          <Logs gameID={gameID} wsLog = {wsLog} />
      </div>
      <div className="pageGameTable">
        <div className="tablegame">
          <Table players={otherPlayers} currentPlayer={playerStatus} gamestatus={gameStatus}/>
        </div>
      </div>
      <div className="playerCards">
          {showNotificationBox && (
            <Notification
              text={
                <span
                  style={{
                    fontFamily: "'KCWaxMuseum', sans-serif",
                    fontSize: '20px',
                    color: '#ffff',
                    textShadow: '2px 4px 4px #000',
                  }}
                >
                  {notificationMessage}
                </span>
              }
              handleOKClick={handleNotificationOKClick}
            />
          )}
        </div>
      <div className="playerCards">
        {/* acá van las cartas del jugador */}
        {!showNotificationBox && !showSelectDefenseButtons && !inExchange && !showCardPanic
        && aliveplayer && showPlayerCards && <h3>Tus cartas</h3>}
        {!inExchange && !showCardPanic &&
          showPlayerCards &&
          playerCards &&
          !showSelectDefenseButtons &&
          playerCards
            .slice() // Create a shallow copy to avoid mutating the original array
            .sort((a, b) => a.id - b.id) // Sort based on card IDs
            .map((card) => (
              <Card
                key={card.id}
                id={card.id}
                type={card.type}
                number={card.number}
                selectedCard={selectedCard.id ?? null}
                //image={gallardoImage}
                onClick={() => handleCardClick(card)} // Add onClick handler
              />
            ))}
      </div>
      <div className="playerCards">
        {/* acá van las cartas intercambiables del jugador */}
        {!showNotificationBox && inExchange && exchangableCards &&
          <h3>Tus cartas intercambiables</h3>}
        {!showNotificationBox &&
          inExchange &&
          exchangableCards &&
          exchangableCards.map((exchangeableCardId) =>
            playerCards.find((card) => card.id === exchangeableCardId) ? (
              <Card
                id={exchangeableCardId}
                type={
                  playerCards.find((card) => card.id === exchangeableCardId)
                    .type
                }
                number={
                  playerCards.find((card) => card.id === exchangeableCardId)
                    .number
                }
                // image={gallardoImage}
                onClick={() => handleExchangeSolicitude(exchangeableCardId)}
              />
            ) : null
          )}
      </div>
      <div className="playerCards">
        {/* acá van las cartas de Defensa */}
        {cardDefense && showSelectDefenseButtons && (
        <>
          <h3>Tus cartas de defensa</h3>
          {cardDefense.map((IdCardDefense) =>
          playerCards.find((card) => card.id === IdCardDefense) ? (
          <Card
            id={IdCardDefense}
            type={playerCards.find((card) => card.id === IdCardDefense).type}
            number={playerCards.find((card) => card.id === IdCardDefense).number}
            selectedCard={selectedCard.id  ?? null}
            onClick={() => handleCardClick(IdCardDefense)}
          />
          ) : null
          )}
        </>
        )}
      </div>
      <div className="playerCards">
        {/* acá van las cartas de panico*/}
        {showCardPanic && <h3>Carta de Panico</h3>}
        {
           cardPanic && 
          showCardPanic && 
              <Card
                key={cardPanic.id}
                id={cardPanic.id}
                type={cardPanic.type}
                number={cardPanic.number}
                selectedCard={selectedCard.id ?? null}
                onClick={() => handleCardClick(cardPanic)} 
              />
            }
      </div>
      <div className="SelectPlayOrDiscardOption">
        {showCardPanic && showPlayPanicCard && !showCardsRevelacion &&(
          <div>
            <h2>Jugar Inmediatemente</h2>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handlePlayCardClick(selectedCard)}
              style={buttonStyles}
            >
              Jugar
            </Button>
          </div>
        )}
      </div>
      <div className="SelectPlayOrDiscardOption">
        {showPlayOrDiscardOption && !showCardPanic && (
          <div>
            <h2>¿Qué deseas hacer?</h2>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handlePlayCardClick(selectedCard)}
              style={buttonStyles}
            >
              Jugar
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleDiscardCard(selectedCard)}
              style={buttonStyles}
            >
              Descartar
            </Button>
          </div>
        )}
      </div>
      <div className="SelectPlayerButtons">
        {!showSelectPlayerButtons2 && showSelectPlayerButtons && (!playerPublicStatus.obstaculo_izquierda ||
         !playerPublicStatus.obstaculo_derecha) && (
          <div>
            <h2>Seleccionar jugador</h2>
            {!obstacleLeft && <Button
              variant="contained"
              color="primary"
              onClick={() => handlePlayerSelection(leftPlayer.id)}
              style={buttonStyles}
            >
              {leftPlayer.name}
            </Button>}
            {!obstacleRight && <Button
              variant="contained"
              color="primary"
              onClick={() => handlePlayerSelection(rightPlayer.id)}
              style={buttonStyles}
            >
              {rightPlayer.name}
            </Button>}
          </div>
        )}
      </div>
      <div className="SelectPlayerButtons">
        {showSelectPlayerButtons2 && (!playerPublicStatus.obstaculo_izquierda || !playerPublicStatus.obstaculo_derecha) && (
          <div>
            <h2>Seleccionar jugador</h2>
            {!playerPublicStatus.obstaculo_izquierda && <Button
              variant="contained"
              color="primary"
              onClick={() => handlePlayerSelection(leftPlayer.id)}
              style={buttonStyles}
            >
              {leftPlayer.name}
            </Button>}
            {!playerPublicStatus.obstaculo_derecha && <Button
              variant="contained"
              color="primary"
              onClick={() => handlePlayerSelection(rightPlayer.id)}
              style={buttonStyles}
            >
              {rightPlayer.name}
            </Button>}
          </div>
        )}
      </div>
      <div className="SelectPlayerButtons">
        {showSelectPlayersButtons && (
          <div>
            <h2>Seleccionar jugador</h2>
            {gameStatus.players.map((playerName) => (
              (!playerName.cuarentena && playerName.alive) ? (
                <Button
                  key={playerName.id} // Usar un identificador único para la clave
                  variant="contained"
                  color="primary"
                  onClick={() => handlePlayerSelection(playerName.id)}
                  style={buttonStyles}
                  disabled={!(playerName.id !== userID)}
                >
                  {playerName.name}
                </Button>) : null
            ))}
          </div>
        )}
      </div>
      <div className="selectAxeLftRgt">
        {!showNotificationBox && showAxeOptionLftRgt && (obstacleLeft || obstacleRight || playerPublicStatus.cuarentena) && (
          <div>
            <h2>¿Qué obstáculo desea eliminar?</h2>
            {leftPlayer.cuarentena && <Button
              variant="contained"
              color="primary"
              onClick={() => handleRemoveQuarantine(selectedCard.id, leftPlayer.id)}
              style={buttonStyles}
            >
              Cuarentena del jugador {leftPlayer.name}
            </Button>}
            {rightPlayer.cuarentena && <Button
              variant="contained"
              color="primary"
              onClick={() => handleRemoveQuarantine(selectedCard.id, rightPlayer.id)}
              style={buttonStyles}
            >
              Cuarentena del jugador {rightPlayer.name}
            </Button>}
            {playerPublicStatus.cuarentena && <Button
              variant="contained"
              color="primary"
              onClick={() => handleRemoveQuarantine(selectedCard.id, playerStatus.id)}
              style={buttonStyles}
            >
              Tu propia cuarentena
            </Button>}
            {playerPublicStatus.obstaculo_izquierda && <Button
              variant="contained"
              color="primary"
              onClick={() => handleLftPlayerObstacle(selectedCard.id)}
              style={buttonStyles}
            >
              Obstáculo con jugador {leftPlayer.name}
            </Button>}
            {playerPublicStatus.obstaculo_derecha && <Button
              variant="contained"
              color="primary"
              onClick={() => handleRgtPlayerObstacle(selectedCard.id)}
              style={buttonStyles}
            >
              Obstáculo con jugador {rightPlayer.name}
            </Button>}
          </div>
        )}
      </div>
      <div className="showAddObstacleOption">
        {showAddObstacleOption && (
          <div>
            <h2>¿Donde desea agregar la puerta atrancada?</h2>
            {(!obstacleLeft || (obstacleLeft && leftPlayer.cuarentena)) &&
              <Button
                variant="contained"
                color="primary"
                onClick={() => playCard(selectedCard.id, leftPlayer.id)}
                style={buttonStyles}
              >
                {leftPlayer.name}
              </Button>}
            {(!obstacleRight || (obstacleRight && rightPlayer.cuarentena)) &&
              <Button
                variant="contained"
                color="primary"
                onClick={() => playCard(selectedCard.id, rightPlayer.id)}
                style={buttonStyles}
              >
                {rightPlayer.name}
              </Button>}
          </div>
        )}
      </div>
      <div className="showResponseCards">
        {showQuarantineCards && !showResponseCards &&(
          <div>
            <h2>Cartas del rival en cuarentena: {findUserNameById(quarantinePlayer)}</h2>
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "row",
                justifyItems: "center",
              }}
            >
              {quarantineCard.map((card) => (
                <Card
                  id={card.id}
                  type={card.type}
                  number={card.number}
                  onClick={() => { }}
                />
              ))}
            </div>
            {/* Botón para continuar el juego */}
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleContinueGame()}
              style={buttonStyles}
            >
              Continuar
            </Button>
          </div>
        )}
      </div>
      {/* Muestra la cartas de respuesta de sospecha, Analisis, Whisky o Aterrador */}
      <div className="showResponseCards">
        {showResponseCards && (
          <div>
            <h2>Cartas del rival: : {findUserNameById(infoCardsPlayer)} </h2>
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "row",
                justifyItems: "center",
              }}
            >
              {showInfoCardsPlayers.map((card, index) => (
                <Card
                  id={index + 1}
                  type={card.name}
                  number={index + 1}
                  onClick={() => { }}
                />
              ))}
            </div>
            {/* Botón para continuar el juego */}
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleContinueGame()}
              style={buttonStyles}
            >
              Continuar
            </Button>
          </div>
        )}
      </div>
      <div className="showWhiskeyCards">
        {showWhiskeyCards && !showResponseCards &&(
          <div>
            <h2>Cartas del rival: :{findUserNameById(whiskeyPlayer)}</h2>
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "row",
                justifyItems: "center",
              }}
            >
              {whiskeyCards.map((card) => (
                <Card
                  id={card.id}
                  type={card.type}
                  number={card.number}
                  onClick={() => { }}
                />
              ))}
            </div>
            {/* Botón para continuar el juego */}
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleContinueGame()}
              style={buttonStyles}
            >
              Continuar
            </Button>
          </div>
        )}
      </div>
      {/* Muestra la opcion para defenderse */}
      <div className="SelectPlayOrDiscardOption">
        {showSelectDefenseButtons && (
          <div>
            <h3> Decide si quieres defenderte </h3>
            <Button
              variant="contained"
              color="primary"
              onClick={() => PlayDefenseCards(selectedCard, true)} // Una funcion para defenderse
              style={buttonStyles}
            >
              ¡Aplicar defensa!
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => PlayDefenseCards(selectedCard, false)} // Una funcion para no defenderse
              style={buttonStyles}
            >
              ¡No me quiero defender!
            </Button>
          </div>
        )}
      </div>
      {gameStatus.gameInfo.jugadorTurno === userID && (
        <ShiftsGames
          phaseShift={gameStatus.gameInfo.faseDelTurno}
        ></ShiftsGames>
      )}
      <div classname="Revelacion">
        {showCardsRevelacion && <h2 style={{color:"white"}}>Deseas revelar tu mano?</h2>}
        {showCardsRevelacion && (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={() => sendRevelacion(true,false)}
              style={buttonStyles}
            >
              Si
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() =>sendRevelacion(false,false)}
              style={buttonStyles}
            >
              No
            </Button>
            { playerCards && playerCards.some(card => card.type === 'Infeccion') &&
            <Button 
              variant="contained"
              color="primary"
              onClick={() =>sendRevelacion(false,true)}
              style={buttonStyles}
            >
              Enseñar Carta Infeccion
            </Button>
            }
          </>
        )}
      </div>
      <div>
        <Snackbar
          open={showMessengeCardStolen}
          anchorOrigin={{ vertical: "button", horizontal: "center" }}
          message={`Carta Robada`}
          autoHideDuration={4000}
          onClose={() => setShowMessengeCardStolen(false)}
        />
      </div>
    </Box>
  );
}

export default PageGame;
