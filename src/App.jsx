import React, { Component } from "react";


import {
  Routes,
  Route,
} from "react-router-dom";

// //utils
// import axios from 'axios';

// pages
import Login from "./Login";
import Rooms from "./Rooms";
const RouteNotFound = (props)=>{
  return (
    <div>
      <h1>Página não encontrada 404</h1>
    </div>
  )
}
class App extends Component {
  render() {
    return (
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/rooms/*" element={<Rooms />} />
          <Route path="*" element={<RouteNotFound />} />
        </Routes >
      </div>
    )
  }
}

export default App;

// function App() {
//   return (
//     <div className="container-2 w-container">
//         <form className="lobby" method="post">
//             <h1 className="heading">Seja bem-vindo</h1>
//             <div>Informe seu nome para começar:</div>
//             <input className="div-block-3" name="name" style={{ width: '100%' }} /><br/>
//             <input type="submit" className="w-button" value="Entrar" />
//         </form>
//       </div>
//   );
// }


