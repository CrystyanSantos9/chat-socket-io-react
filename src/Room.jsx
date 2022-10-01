import React from 'react'
import { useEffect, useCallback } from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import './chatsocket-io.webflow.css'

const Room = (props) => {
  let params = useParams()
  const [roomId, setRoomId] = useState('')
  const [errors, setErros] = useState('')
  const [audioPermission, setAudioPermission] = useState(false)

  let mediaRecorder = {}
  navigator.mediaDevices.getUserMedia({ audio: true }).then(
    (stream) => {
      setAudioPermission(true)
      mediaRecorder = new MediaRecorder(stream)
      let chunks = []
      mediaRecorder.ondataavailable = (data) => {
        // data received
        chunks.push(data.data)
      }
      mediaRecorder.onstop = () => {
        //data sent
        //api file reader
        const reader = new window.FileReader()
        //crio um objeto binário, falando que dentro tem um aúdio
        const blob = new Blob(chunks, { type: 'audio/ogg; codec=opus' })
        //Para construir url com dados dentro usando base64
        reader.readAsDataURL(blob)
        //quando ele terminar de criar a url com dados dentro
        reader.onloadend = () => {
          props.socket.emit('sendAudio', {
            data: reader.result,
            room: roomId,
          })
        }
        chunks = []
      }
    },
    (err) => {
      mediaRecorder = null
      setAudioPermission(false)
    },
  )

  // const reload = () => {
  //   const path = location.pathname
  //   console.log("Page Reloaded ", path)
  //   navigate(path)
  // }

  const errorHandling = useCallback(async () => {
    await props.socket.once('error', (error) => {
      if (error !== '') {
        console.log(error)
        setErros(error)
      } else {
        setErros('')
      }
    })
  }, [params])

  useEffect(() => {
    if (params) {
      if (roomId === '') {
        const initialRoomId = params.room
        setRoomId(initialRoomId)
        props.setRoom(initialRoomId)
        props.socket.emit('join', initialRoomId)
      }

      if (params.room !== roomId && roomId !== '') {
        const newRoomId = params.room
        setRoomId(newRoomId)
        props.setRoom(newRoomId)
        props.socket.emit('join', newRoomId)
      }
    }
  }, [params])

  function onMouseUp() {
    console.log('On Mouse UP')
    mediaRecorder.stop()
  }

  function onMouseDown() {
    console.log('On Mouse DOWN')
    mediaRecorder.start()
  }

  function handleKey(event) {
    if (roomId !== '' && event.keyCode === 13) {
      props.socket.emit('sendMsg', {
        msg: event.target.value,
        room: roomId,
      })
      //limpa tela depois de enviar
      event.target.value = ''
    }
  }

  function renderContent(msg) {
    // se o conteudo for texto
    // recebe o objo msg { com prop type para derminar a renderizacao }
    if (msg.type === 'text') {
      return msg.message
    } else {
      return (
        <audio controls>
          <source src={msg.message} type="audio/ogg" />
        </audio>
      )
    }
  }
  // lidando com diferentes tipos de dado
  function renderMessage(msg) {
    return (
      <div key={msg._id} className="message">
        <span className="author">
          {msg.author} - {msg.when}
        </span>
        <br />
        {/* // colocamos a exibição do conteudo aqui / para lidar com o formato de saída */}
        <span className="msg-body">{renderContent(msg)}</span>
      </div>
    )
  }

  return (
    <div className="room">
      {errorHandling() && errors !== '' ? <h3>{errors}</h3> : ''}
      <div className="messages">
        <div className="message">
          <span className="msg-body"> Estou na sala : {JSON.stringify(roomId)} </span>
          {props.msgs[roomId] && props.msgs[roomId].map(renderMessage)}
        </div>
      </div>
      <div className="new-message-form w-form">
        <form style={{ display: 'flex' }}>
          <textarea
            id="field"
            name="field"
            maxLength="5000"
            placeholder="Digite sua mensagem e pressione &lt;Enter&gt;"
            autoFocus={true}
            className="msg w-input"
            onKeyUp={handleKey}
          ></textarea>
          <span>
            <button type="button" className="send-audio w-button" onMouseUp={onMouseUp} onMouseDown={onMouseDown}>
              Enviar
              <br />
              Áudio
            </button>
            {/* <!-- <button type="button" className="start-counter w-button">Contar tempo<br></button> --> */}
            <div className="slidecontainer">
              <input type="range" min="1" max="10" defaultValue="1" className="slider" id="myRange" />
            </div>
          </span>
        </form>
      </div>
    </div>
  )
}

export default Room
