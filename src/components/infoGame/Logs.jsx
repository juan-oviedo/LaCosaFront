import React, { useState, useEffect } from "react";
import axios from "axios";

const mode = process.env.REACT_APP_MODE;
let url;
if (mode === "dev") {
  url = process.env.REACT_APP_URL_DEVELOPMENT;
}
else if (mode === "prod") {
  url = process.env.REACT_APP_URL_PRODUCTION;
}
else {
  throw new Error("Invalid mode");
}

function Logs ({gameID, wsLog}) {
  const [logs, setlogs] = useState([]);

  const fetchLogs = async () => {
    try {
      const response = await axios.get(`${url}/chat/get_game_logs/${gameID}`);
      setlogs(response.data);
      } catch (error) {
      console.error("Error fetching logs:", error);
      }
  }

  useEffect(() => {
    fetchLogs();
    // // Set up an interval to fetch logs every 30 seconds
    // const intervalId = setInterval(fetchLogs, 30000);
    // return () => clearInterval(intervalId);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsLog]);

    return (
    <div>
    <h3 className="log-title">Logs</h3>
      <div className="log-messages">
        {logs.map((log, index) => (
          <div
          key={`${log.id}_${index}`} // Using a combination of message.id and index
          >
            <span className="log-player">{log.player_name}: </span> 
            {(log.action === "Descarto una carta" || log.action === "Robo una carta del mazo" || log.action ==="Hacha")
            && (
            <span>{log.action}</span>
            )}
            {(log.action === "Accion" || log.action === "Mato a un jugador" || log.action === "Panico")
            && log.target_name && (
            <span>{log.action} a {log.target_name}</span>
            )}
            {log.action === "Cambio cartas" && (
            <span>{log.action} con {log.target_name}</span>
            )}
            {log.action === "Se defendio" && (
            <span>{log.action} de {log.target_name}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Logs;