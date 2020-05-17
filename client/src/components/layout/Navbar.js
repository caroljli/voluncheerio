import React, { Component } from "react";
// import { Link } from "react-router-dom";

class Navbar extends Component {
  render() {
    return (
      <h1 className="ui center aligned header" style={{marginTop:30, fontFamily:"Avenir", color:"#03c6fc", alignContent: "center"}}>
        <a style={{color:"black"}}>volun</a>cheer<a style={{color:"black"}}>io</a>
      </h1>
    );
  }
}

export default Navbar;
