import React, { Component } from "react";
import { Navigate } from "react-router-dom";

//utils
import axios from 'axios';

class Login extends Component {
   
    constructor(props){
        super(props)
        this.state = {
            success: false
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    
    handleSubmit(e) {
        axios.post('http://192.168.1.110:3001/auth', {
            name: this.name.value
        }).then(payload =>{
            const token = payload.data.token 
            window.localStorage.setItem('token', token)
            this.setState({success: true})
        })
        e.preventDefault()
    }
    render() {
        if(this.state.success){
            return <Navigate to="/rooms" replace={true} />
        }
        return (
            <div className="container-2 w-container">
                <form className="lobby" method="post" onSubmit={this.handleSubmit}>
                    <h1 className="heading">Seja bem-vindo</h1>
                    <div>Informe seu nome para começar:</div>
                    <input className="div-block-3" name="name" style={{ width: '100%' }} ref={(ref) => this.name = ref} /><br />
                    <input type="submit" className="w-button" value="Entrar" />
                </form>
            </div>
        )
    }
}

export default Login