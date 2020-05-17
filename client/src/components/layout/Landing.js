import React, { Component } from "react";
// import { Link } from "react-router-dom";

class Landing extends Component {
  render() {
    return (
      <div className="ui searchable stackable center aligned grid">
        <div className="six wide column">
          <div className="ui very padded segment" style={{marginTop:60}}>
            <h1 className="ui header" style={{fontFamily:"Avenir"}}>
              Hello! Welcome to Voluncheerio! 🍳
              <div className="sub header">Positive change through dynamic management.</div>
            </h1>
        </div>
        <div className="six wide column">
          <form style={{marginTop:60}}>
            <button className="ui big button" type="submit" formAction="/login" style={{fontFamily:"Avenir"}}>
              Login
            </button>
            <button className="ui big button" type="submit" formAction="/register" style={{fontFamily:"Avenir", marginLeft:10}}>
              Register
            </button>
          </form>
          
        </div>
       </div>
      </div>

    )
  }
}

export default Landing;
