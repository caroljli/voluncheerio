import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      adminOf: "",
      bio: "",
      password2: "",
      errors: {}
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
      adminOf: [],
      bio: ""
    };

    this.props.registerUser(newUser, this.props.history);
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="ui searchable stackable center aligned grid">
          <div className="six wide column" style={{marginTop:60}}>
            <form>
              <button className="ui left labeled icon mini button" style={{fontFamily:"Avenir"}} type="submit" formAction="/">
                <i className="left arrow icon"></i>
                Back to Home
              </button>
            </form>
            <div className="ui very padded segment" style={{marginTop:60}}>
              <h1 className="ui header" style={{fontFamily:"Avenir"}}>
                Register for a New Account.
                <div className="sub header">Enter your credentials below.</div>
              </h1>
            <form noValidate onSubmit={this.onSubmit} style={{marginTop:30}}>
              <div className="ui input">
                <input
                  placeholder="Name"
                  onChange={this.onChange}
                  value={this.state.name}
                  error={errors.name}
                  id="name"
                  type="text"
                  className={classnames("", {
                    invalid: errors.name
                  })}
                />
                <span className="red-text">{errors.name}</span>
              </div>
              <div className="ui input">
                <input
                  placeholder="Email"
                  onChange={this.onChange}
                  value={this.state.email}
                  error={errors.email}
                  id="email"
                  type="email"
                  className={classnames("", {
                    invalid: errors.email
                  })}
                />
                <span className="red-text">{errors.email}</span>
              </div>
              <div className="ui input">
                <input
                  placeholder="Password"
                  onChange={this.onChange}
                  value={this.state.password}
                  error={errors.password}
                  id="password"
                  type="password"
                  className={classnames("", {
                    invalid: errors.password
                  })}
                />
                <span className="red-text">{errors.password}</span>
              </div>
              <div className="ui input">
                <input
                  placeholder="Confirm Password"
                  onChange={this.onChange}
                  value={this.state.password2}
                  error={errors.password2}
                  id="password2"
                  type="password"
                  className={classnames("", {
                    invalid: errors.password2
                  })}
                />
                <span className="red-text">{errors.password2}</span>
              </div>
              <div className="col s12" style={{ paddingLeft: "11.250px" }}>
              <button className="ui button"
                style={{
                  fontFamily: "Avenir",
                  marginTop: 30
                }}
                type="submit"
              >
                Submit
              </button>
              </div>
            </form>
            </div>
          </div>
        </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));

      // <div className="container">
      //   <div className="row">
      //     <div className="col s8 offset-s2">
      //       <Link to="/" className="btn-flat waves-effect">
      //         <i className="material-icons left">keyboard_backspace</i> Back to
      //         home
      //       </Link>
      //       <div className="col s12" style={{ paddingLeft: "11.250px" }}>
      //         <h4>
      //           <b>Register</b> below
      //         </h4>
      //         <p className="grey-text text-darken-1">
      //           Already have an account? <Link to="/login">Log in</Link>
      //         </p>
      //       </div>
      //       <form noValidate onSubmit={this.onSubmit}>
      //         <div className="input-field col s12">
      //           <input
      //             onChange={this.onChange}
      //             value={this.state.name}
      //             error={errors.name}
      //             id="name"
      //             type="text"
      //             className={classnames("", {
      //               invalid: errors.name
      //             })}
      //           />
      //           <label htmlFor="name">Name</label>
      //           <span className="red-text">{errors.name}</span>
      //         </div>
      //         <div className="input-field col s12">
      //           <input
      //             onChange={this.onChange}
      //             value={this.state.email}
      //             error={errors.email}
      //             id="email"
      //             type="email"
      //             className={classnames("", {
      //               invalid: errors.email
      //             })}
      //           />
      //           <label htmlFor="email">Email</label>
      //           <span className="red-text">{errors.email}</span>
      //         </div>
      //         <div className="input-field col s12">
      //           <input
      //             onChange={this.onChange}
      //             value={this.state.password}
      //             error={errors.password}
      //             id="password"
      //             type="password"
      //             className={classnames("", {
      //               invalid: errors.password
      //             })}
      //           />
      //           <label htmlFor="password">Password</label>
      //           <span className="red-text">{errors.password}</span>
      //         </div>
      //         <div className="input-field col s12">
      //           <input
      //             onChange={this.onChange}
      //             value={this.state.password2}
      //             error={errors.password2}
      //             id="password2"
      //             type="password"
      //             className={classnames("", {
      //               invalid: errors.password2
      //             })}
      //           />
      //           <label htmlFor="password2">Confirm Password</label>
      //           <span className="red-text">{errors.password2}</span>
      //         </div>
      //         <div className="col s12" style={{ paddingLeft: "11.250px" }}>
      //           <button
      //             style={{
      //               width: "150px",
      //               borderRadius: "3px",
      //               letterSpacing: "1.5px",
      //               marginTop: "1rem"
      //             }}
      //             type="submit"
      //             className="btn btn-large waves-effect waves-light hoverable blue accent-3"
      //           >
      //             Sign up
      //           </button>
      //         </div>
      //       </form>
      //     </div>
      //   </div>
      // </div>
