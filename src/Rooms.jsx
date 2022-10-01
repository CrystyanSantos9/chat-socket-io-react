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
    this.roomsEndRef = React.createRef()
    this.state = {
      rooms: [],
      msgs: [],
      showMessage: false,
    }

    //Eventos socket.io

    socket.on('newMsg', (msg) => {
      console.log('roomId selecionado', this.roomId)
      if (!this.state.msgs[msg.room]) {
        const msgs = { ...this.state.msgs }
        msgs[msg.room] = [msg]
        this.setState({
          msgs: msgs,
        })
      } else {
        const msgs = { ...this.state.msgs }
        msgs[msg.room].push(msg)
        this.setState({
          msgs: msgs,
        })
      }

      // se a sala que recebeu mensagem é diferente
      if (msg.room !== this.roomId) {
        // Achar a sala, que recebeu mensagem, e não está selecionada
        const room = this.state.rooms.find((room) => room._id === msg.room)
        console.log('Sala que recebeu mensagem : ', room)
        // precisamos armazenar o valor do índice, posicao dessa sala
        // para quando copiarmos o rooms e salvarmos uma nova sala
        // passarmos para rooms a posicao da que já existe nele
        const indexRoom = this.state.rooms.indexOf(room)
        console.log(indexRoom)
        // copiamos o array de rooms
        const rooms = [...this.state.rooms]
        if (!room.count) {
          room.count = 0
        }
        room.count = room.count + 1
        // salvamos rooms com o contado atualizado, novamente em rooms
        rooms[indexRoom] = room
        // no fim alteramos o estado de rooms
        this.setState({ rooms: rooms })
      }
    })

    //recebe mensagem enviada e mostra na sala para todos
    socket.on('newAudio', (msg) => {
      // se mensagem nao existe para essa lala que vai vir em msg
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
      // se a sala que recebeu mensagem é diferente
      if (msg.room !== this.roomId) {
        // Achar a sala, que recebeu mensagem, e não está selecionada
        const room = this.state.rooms.find((room) => room._id === msg.room)
        console.log('Sala que recebeu mensagem : ', room)
        // precisamos armazenar o valor do índice, posicao dessa sala
        // para quando copiarmos o rooms e salvarmos uma nova sala
        // passarmos para rooms a posicao da que já existe nele
        const indexRoom = this.state.rooms.indexOf(room)
        console.log(indexRoom)
        // copiamos o array de rooms
        const rooms = [...this.state.rooms]
        if (!room.count) {
          room.count = 0
        }
        room.count = room.count + 1
        // salvamos rooms com o contado atualizado, novamente em rooms
        rooms[indexRoom] = room
        // no fim alteramos o estado de rooms
        this.setState({ rooms: rooms })
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
      this.setState((state) => ({ ...state, rooms: [...state.rooms, room] }))
      // this.setState({ rooms: [...this.state.rooms], room })
    })

    socket.on('roomList', (rooms) => {
      this.setState({ rooms: rooms })
    })

    // binds
    this.socket = socket
    this.addNewRoom = this.addNewRoom.bind(this)
    this.setRoom = this.setRoom.bind(this)
    this.styles = this.styles.bind(this)
    // Final do Construtor
  }

  setRoom(roomId) {
    this.roomId = roomId
    const room = this.state.rooms.find((room) => room._id === this.roomId)
    if (room) {
      const index = this.state.rooms.indexOf(room)

      const rooms = [...this.state.rooms]
      if (room.count) {
        room.count = 0
      }
      rooms[index] = room
      this.setState({ rooms: rooms })
    }
  }

  addNewRoom() {
    const roomName = prompt('Informe o nome da sala')
    if (roomName) {
      this.socket.emit('addRoom', roomName)
    }
  }

  styles(roomSelected) {
    if (roomSelected === this.roomId) {
      const styleSelected = {
        color: 'green',
      }
      return styleSelected
    }
  }

  setShowMessage() {
    this.setState((state) => (state.showMessage = true))
  }

  setShowMessageOff() {
    this.setState((state) => (state.showMessage = false))
  }

  // Para fazer a página ir até a última sala
  // needs ref = pega um ponto da tela, no caso ela vai pegar todas as informações
  // da posição e momento em que a div se encontra depois de atualizar a tela
  // precisa do itens de montagem

  scrollToBottom() {
    this.roomsEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  componentDidMount() {
    this.scrollToBottom()
  }

  componentDidUpdate() {
    this.scrollToBottom()
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
                  <Link to={`/rooms/${room._id}`} style={this.styles(room._id)}>
                    {room.name} {!!room.count && <span>({room.count})</span>}
                  </Link>
                </li>
              )
            })}
            <div ref={this.roomsEndRef} />
          </ul>

          <div
            className="add-room"
            onMouseOut={this.setShowMessageOff.bind(this)}
            onMouseOver={this.setShowMessage.bind(this)}
            onClick={this.addNewRoom}
          >
            <span className={!this.state.showMessage ? 'add-room-message' : 'add-room-message show'}>
              Adicionar nova sala{' '}
            </span>
            +
          </div>
        </div>

        <Routes>
          <Route exact path="/" element={<SelectRoom />} />
          <Route
            path="/:room"
            element={
              <Room errors={this.state.errors} socket={this.socket} msgs={this.state.msgs} setRoom={this.setRoom} />
            }
          />
        </Routes>
      </div>
    )
  }
}

export default Rooms
