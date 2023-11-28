import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";

const buttonStyles = {
  width: "120px",
  background: "#8B0000", // Dark red color
  color: "#ffffff", // White text color
  marginRight: 2,
  marginTop: "2%",
  fontSize: "15px",
  padding: "15px 30px",
  fontFamily: "KCWaxMuseum, sans-serif",
  "&:hover": {
    background: "#610101", // Darker red color on hover
  },
};

const ButtonFinishGame = ({gameID,playerID}) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const finishGame = () => {
    const url = "https://lacosa.adaptable.app/game/finish";
    const form = {
      game_id: gameID,
      player_id: playerID,
    };
    console.log(gameID,playerID)
    axios
      .post(url,form)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div style={{width:"20%"}}>
      <Button variant="contained" style={buttonStyles} onClick={handleClickOpen} size="small">
        Finalizar Partida
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title"   style={{backgroundColor:"white",zIndex:"999"}}>
          {"Estas seguro de finalizar la partida?"}
        </DialogTitle>
        <DialogContent 
         style={{backgroundColor:"white"}}>
          <DialogContentText id="alert-dialog-description" >
            Si todos los jugadores no estan infectados.Pierdes la partida.
          </DialogContentText>
        </DialogContent>
        <DialogActions  style={{backgroundColor:"white"}}>
          <Button onClick={handleClose}>Atras</Button>
          <Button onClick={finishGame} autoFocus>
            Finalizar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ButtonFinishGame;
