import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useParams, useLocation, useNavigate   } from "react-router-dom";
import "./chatsocket-io.webflow.css";

const Room = (props) => {
  let params = useParams();
  const navigate = useNavigate();
  const location = useLocation()
  const [roomId, setRoomId] = useState('');

  const reload = () => {
    const path = location.pathname
    console.log("Page Reloaded ", path)
    navigate(path)
  }
  
  useEffect(()=>{
    if(params){
      // trata o reload de página
      // roomId = '' vazio pega o id do histórico do router dom 
      if(roomId === ''){
        const initialRoomId = params.room
        setRoomId(initialRoomId)
        props.socket.emit("join", initialRoomId);
      }

      // trata a mudança de pagina 
      if(params.room !== roomId && roomId !==''){
        const newRoomId = params.room
        setRoomId(newRoomId)
        props.socket.emit("join", newRoomId);
      }
     
    }
  },[params])

  function handleKey(event){
    if(roomId !== '' && event.keyCode === 13 ){
        // props.socket.emit('sendMsg', {
        //     msg: $('.msg').val(),
        //     room: selectedRoom
        // })
    }
  }
  
  return (
    <div className="room">
      <div className="messages">
        <div className="message">
          <span className="author"></span>
          <br />
          <span className="msg-body"> Estou na sala : {JSON.stringify(roomId)}</span>
        </div>
      </div>
      <div className="new-message-form w-form">
        <form>
          <textarea
            id="field"
            name="field"
            maxLength="5000"
            placeholder="Digite sua mensagem e pressione &lt;Enter&gt;"
            autoFocus={true}
            className="msg w-input"
            onKeyUp={handleKey}
          ></textarea>
          <span style={{ display: "flex" }}>
            <button type="button" className="send-audio w-button">
              Enviar
              <br />
              Áudio
            </button>
            {/* <!-- <button type="button" className="start-counter w-button">Contar tempo<br></button> --> */}
            <div className="slidecontainer">
              <input
                type="range"
                min="1"
                max="10"
                defaultValue="1"
                className="slider"
                id="myRange"
              />
            </div>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Room;
