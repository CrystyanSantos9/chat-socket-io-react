import React, { Component } from "react";
import io from "socket.io-client";


import {
  Routes,
  Route,
  Link,
} from "react-router-dom";
import Room from "./Room";
import SelectRoom from "./SelectRoom";

class Rooms extends Component {
  constructor(props) {
    super(props);
    const token = window.localStorage.getItem("token");
    const socket = io("http://192.168.1.110:3001?token=" + token);
   

    this.state = {
      rooms: [],
      msgs: {},
    };

    //Eventos socket.io

    socket.on("newMsg", (msg) => {
      // if (selectedRomm === msg.room) {
      //   addMsg(msg)
      // } else {
      //   // atualizar contador de msgs não lidas
      //   const id = msg.room
      //   //uso span para peagr o valor dento do span dentro da classe
      //   //usamos text para pegar e alterar o valor do elemento html e não value
      //   let count = parseInt($('#'+id+' .notifications span').text())
      //   //adiciona mais mensagem não lida
      //   count+=1
      //   $('#'+id+' .notifications span').text(count)
      // }
    });

    //recebe mensagem enviada e mostra na sala para todos
    socket.on("newAudio", (msg) => {
      // if (selectedRomm === msg.room) {
      //   addMsg(msg)
      // } else {
      //   // atualizar contador de msgs não lidas
      // }
    });

    //recebe mensagens quando clicar nas salas
    socket.on("msgsList", (msgs) => {
      // $('.messages').html('') //limpamos a tela
      // msgs.map(addMsg) //para cada mensagem presente no array, enviamos ela para a função template
    });

    // evento para escutar a criação de nova sala
    socket.on("newRoom", (room) => {
      this.setState({ rooms: [...this.state.rooms], room });
    });

    socket.on("roomList", (rooms) => {
      this.setState({ rooms: rooms });
    });

    this.socket = socket
  }
    
  render() {
    return (
      <div className="container w-container">
       
        <div className="rooms">
          <h1 className="title-rooms">Salas Disponíveis</h1>
          <ul className="room-list w-list-unstyled">
          {
            this.state.rooms.map(room=>{
              return (
              <li key={room._id} className="room-item">
                <Link to={`/rooms/${room._id}`}>{room.name}</Link>
              </li>
              )
            })
          }
            {/* <li className="room-item">Sala 2</li>
            <li className="room-item">
              Sala 3 <span className="notifications">(2)</span>
            </li> */}
          </ul>
        
          <div className="add-room">+</div>
        </div>
            
        <Routes>
          <Route exact path="/" element={<SelectRoom/>} />
          <Route path="/:room" element={<Room socket={this.socket}/>} /> 
        </Routes>    
        
      </div>
    );
  }
}

export default Rooms;
