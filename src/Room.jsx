import React from "react";
import { useEffect, useCallback } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import "./chatsocket-io.webflow.css";

const Room = (props) => {
  let params = useParams();
  const [roomId, setRoomId] = useState("");
  const [errors, setErros] = useState("");

  // const reload = () => {
  //   const path = location.pathname
  //   console.log("Page Reloaded ", path)
  //   navigate(path)
  // }

  const errorHandling = useCallback(async () => {
    await props.socket.once("error", (error) => {
      if (error !== "") {
        console.log(error);
        setErros(error);
      } else {
        setErros("");
      }
    });
  }, [params]);

  useEffect(() => {
    if (params) {
      // ADICIONEI -- verifica ação no reload
      // trata o reload de página
      // roomId = '' vazio pega o id do histórico do router dom
      if (roomId === "") {
        const initialRoomId = params.room;
        setRoomId(initialRoomId);
        props.socket.emit("join", initialRoomId);
      }

      // trata a mudança de pagina
      if (params.room !== roomId && roomId !== "") {
        const newRoomId = params.room;
        setRoomId(newRoomId);
        props.socket.emit("join", newRoomId);
      }
    }
  }, [params, props.socket]);

  function handleKey(event) {
    if (roomId !== "" && event.keyCode === 13) {
      props.socket.emit("sendMsg", {
        msg: event.target.value,
        room: roomId,
      });
      //limpa tela depois de enviar
      event.target.value = "";
    }
  }

  function renderContent(msg){
    // se o conteudo for texto 
    // recebe o objo msg { com prop type para derminar a renderizacao }
    console.log(msg)
    if(msg.type === 'text'){
      return msg.message
    }else{
      return <audio audio={msg.message} controls="true"></audio>
    }
  }
  // lidando com diferentes tipos de dado
  function renderMessage(msg){
      return(
        <div key={msg._id}className="message">
          <span className="author">{msg.author} - {msg.when}</span>
          <br />
          {/* // colocamos a exibição do conteudo aqui / para lidar com o formato de saída */}
          <span className="msg-body">{renderContent(msg)}</span>
        </div>    
      )
  }

  return (
    <div className="room">
      {errorHandling() && errors !== "" ? <h3>{errors}</h3> : ""}
      <div className="messages">
      <div className="message">
        <span className="msg-body"> Estou na sala : {JSON.stringify(roomId)} </span>
       {console.log(Object.values(props.msgs))}
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
