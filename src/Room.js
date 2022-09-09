import React from "react";

const Room = (props) => {
    return (
        <div className="room">
            <div className="messages">
                <div className="message">
                    <span className="author"></span>
                    <br />
                    <span className="msg-body">{JSON.stringify(props.state)}</span>
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
    )
}

export default Room