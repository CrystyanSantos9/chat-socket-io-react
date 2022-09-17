import React, { Component } from 'react'
import io from 'socket.io-client'

import { Routes, Route, Link } from 'react-router-dom'
import Room from './Room'
import SelectRoom from './SelectRoom'

class Rooms extends Component {
  constructor(props) {
    super(props)
    const token = window.localStorage.getItem('token')
    const socket = io('http://192.168.1.110:3001?token=' + token)

    this.state = {
      rooms: [],
      msgs: [],
    }

    //Eventos socket.io

    socket.on('newMsg', (msg) => {
      // se mensagem nao existe
      if (!this.state.msgs[msg.room]) {
        //pegamos tudo o que já existe no estado atual
        // manter o estado original imutável criando um novo objeto
        const msgs = { ...this.state.msgs }
        //criando um posição dentro do novo estado para  mensagem nova e única
        // a posicao é o id da room, logo todas as mensagens ficarão associadas a room
        msgs[msg.room] = [msg]
        this.setState({
          msgs: msgs,
        })
      } else {
        //se a mensagem já existe
        // copiamos tudo que está no estado original
        const msgs = { ...this.state.msgs }
        //e só adicionamos dentro no objeto de room
        msgs[msg.room].push(msg)
        this.setState({
          msgs: msgs,
        })
      }
    })

    //recebe mensagem enviada e mostra na sala para todos
    socket.on('newAudio', (msg) => {
      // se mensagem nao existe para essa lala que vai virm em msg 
      if (!this.state.msgs[msg.room]) {
        //pegamos tudo o que já existe no estado atual
        // manter o estado original imutável criando um novo objeto
        const msgs = { ...this.state.msgs }
        //criando um posição dentro do novo estado para selecionar a sala que carregamos ao clicar em sala
        // a posicao é o id da room, logo todas as mensagens ficarão associadas a room
        msgs[msg.room] = [msg]
        this.setState({
          msgs: msgs,
        })
      } else {
        //se a mensagem já existe
        // copiamos tudo que está no estado original
        const msgs = { ...this.state.msgs }
        //e só adicionamos dentro no objeto de room
        msgs[msg.room].push(msg)
        this.setState({
          msgs: msgs,
        })
      }
    })

    //recebe mensagens quando clicar nas salas
    socket.on('msgsList', (msgs) => {
      if (msgs.length > 0) {
        // copiamos tudo o que está no estado mensagens todas as mensagens
        const msgsTmp = { ...this.state.msgs }
        // selecionamos a sala e carregamos todas as mensagens dessa sala nele
        msgsTmp[msgs[0].room] = msgs

        this.setState({
          //alterando o estado de msgs para as que estamos carregando do banco
          msgs: msgsTmp,
        })
      }
    })

    // evento para escutar a criação de nova sala
    socket.on('newRoom', (room) => {
      this.setState({ rooms: [...this.state.rooms], room })
    })

    socket.on('roomList', (rooms) => {
      this.setState({ rooms: rooms })
    })

    this.socket = socket
  }

  render() {
    return (
      <div className="container w-container">
        <div className="rooms">
          <h1 className="title-rooms">Salas Disponíveis</h1>
          <ul className="room-list w-list-unstyled">
            {this.state.rooms.map((room) => {
              return (
                <li key={room._id} className="room-item">
                  <Link to={`/rooms/${room._id}`}>{room.name}</Link>
                </li>
              )
            })}
            {/* <li className="room-item">Sala 2</li>
            <li className="room-item">
              Sala 3 <span className="notifications">(2)</span>
            </li> */}
          </ul>

          <div className="add-room">+</div>
        </div>

        <Routes>
          <Route exact path="/" element={<SelectRoom />} />
          <Route
            path="/:room"
            element={<Room errors={this.state.errors} socket={this.socket} msgs={this.state.msgs} />}
          />
        </Routes>
      </div>
    )
  }
}

export default Rooms
