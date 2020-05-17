import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { createOrg, deleteOrg } from "../../actions/orgActions";
import axios from "axios";
import AWS from "aws-sdk";

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      newOrgName: "",
      newOrgEmail: "",
      newOrgAbout: "",
      newOrgPhone: "",
      newOrgPhoto: "",
      newBio: "",
      newAbout: "",
      bio: "",
      about: "",
      userOrgs: [],
      orgChanged: false,
      organizations: [],
    };
  }

  componentDidMount = () => {
    axios
    .get("/api/organizations/")
    .then(result => {
      this.setState({ organizations: result.data.data });
      this.updateOrgs();
    })
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  onDeleteClick = (name) => {
    this.props.deleteOrg(name);
    window.location.reload(false);
  }

  updateAbout = (name) => {
    // e.preventDefault();
    axios
    .post('/api/organizations/updateAbout', {
      name: name,
      newAbout: this.state.newAbout
    })
    .then((res) => {
      this.setState({ about: this.state.newAbout })
    })
    return false
  }

  updateOrgs = () => {
    axios
    .post("/api/organizations/filter", {
      email: this.props.auth.user.email
    }).then(result => {
      this.setState({ userOrgs: result.data })
      console.log(result.data)
    })
  }

  updateBio = (e) => {
    e.preventDefault();
    axios
    .post('/api/users/updateBio', {
      email: this.props.auth.user.email,
      newBio: this.state.newBio
    })
    .then((res) => {
      this.setState({ bio: this.state.newBio })
    })
    return false
  }

  onCreateNewOrg = (e) => {
    e.preventDefault();

    this.props.createOrg(
      this.state.newOrgName,
      [this.props.auth.user.email],
      this.state.newOrgAbout,
      this.state.newOrgEmail,
      this.state.newOrgPhone,
      this.state.newOrgPhoto,
    )
    this.updateOrgs();
    window.location.reload(false);
  }

  createOrganizationCard = (org, key) => {
    org = org
    this.state.about = org.about
    return (
      <div className="ui card" key={'org'+key} style={{marginRight: 5, marginLeft: 5, width: "70%"}}>
        <div className="content">
          <a className="header" style={{fontFamily:"Avenir", color: "#03c6fc"}} href={'/organization/' + (key + 1)} >{org.name}</a>
          <div className="meta">
            <p className="ui" style={{fontFamily:"Avenir"}}> { (this.state.about.length > 0) ? this.state.about : org.about } </p>
            
          </div>
        </div>
        <div className="image">
          <img className="ui image" 
              src={org.picture} 
              // style={{width: 240, height: 180, backgroundSize: "cover", marginBottom: ".5em"}} 
              alt={org.name + ' picture'}/>
        </div>
        <div class="content">
          <div className="description">
            <p className="ui paragraph" style={{fontFamily:"Avenir"}}><b>Admins: </b>{org.admins}</p>
            <p className="ui paragraph" style={{fontFamily:"Avenir"}}><b>Active Shifts: </b>{org.shifts.length}</p>
          </div>

          {/* <hr width="50%" style={{marginTop: "1em", marginBottom: "2em"}}></hr> */}
        </div>
        <div class="content">
          <a className="header" style={{fontFamily:"Avenir", marginTop: 10}}>Contact Information</a>
          <ul style={{marginTop: 10}}>
            <li><p className="ui" style={{fontFamily:"Avenir"}}><a target="_blank" href={"mailto:" + org.email}>{org.email}</a></p></li>
            <li><p className="ui" style={{fontFamily:"Avenir"}}>{org.phone}</p></li>
          </ul>
        </div>
        <div class="extra content">
            {/* TODO: "/organizations/" + name */}
            {/* <button onClick={e => e.preventDefault()}
              className="ui mini blue button" style={{
                paddingHorizontal: 250,
                paddingVertical: 150
              }}>
                <div className="">View</div>
              </button> */}

            <form noValidate onSubmit={(e) => {
              e.preventDefault();
              this.updateAbout(org.name);
              window.location.reload();
              return false;}
            }>
                <div className="ui input">
                  <input
                    placeholder="New description!"
                    onChange={this.onChange}
                    value={this.state.newAbout}
                    id="newAbout"
                    type="text"
                    style={{height: 30}}
                  />
                </div>
                <button
                  className="ui mini blue button"
                  style={{
                    fontFamily: "Avenir",
                    marginBottom: 10,
                    marginTop: 5
                  }}
                >
                  Update description
              </button>
              <br>
              </br>
            </form>
            <p>Update photo
            <input style={{marginBottom: 20, fontFamily:"Avenir", fontSize: 12}}
                  accept="image/*"
                  type='file'
                  onChange={(e) => {
                      e.preventDefault();
                      this.uploadPhoto(e, org.name);
                  }}>
              </input>
              <br></br>  
            </p>
              

            <button onClick={
                (e) => {
                  e.preventDefault(); 
                  this.onDeleteClick(org.name)
                }
              }
              className="ui mini red button" style={{
                paddingHorizontal: 250,
                paddingVertical: 150
              }}>
              <div className="">Delete</div>
              {/* <div class="hidden content">Confirm</div> */}
            </button>
          </div>
      </div>
    )
  }

  renderShiftCardsByOrg = (shifts) => {
    let gridValues = []
    if (Array.isArray(shifts)) {
      shifts.forEach((i) => {
        gridValues.push(this.createShiftCardByOrg(i,  gridValues.length - 1))
      })
    } else if (shifts.length === 1) {
      gridValues.push(this.createShiftCardByOrg(shifts, 0))
    }
    return gridValues
  }

  createShiftCards = (org) => {
    return (
      <div key={"shift-cards-" + org.name}>
        {this.renderShiftCardsByOrg(org.shifts)}
      </div>
    )
  }

  createShiftCardByOrg = (shift, key) => {
    return (
      <div class="ui segments" key={'shift' + key} >
        <div className="ui segment">
          <div className="content" style={{fontFamily:"Avenir"}}>
            <h3 className="ui header" style={{fontFamily:"Avenir", color:"#03c6fc"}}>ID: {shift.shiftID}</h3>
          </div>
        </div>
        <div class="ui segment">
          <div className="content" style={{fontFamily:"Avenir"}}>
            <p>{shift.organization}</p>
            <p class="date"><strong>{shift.start}</strong> to <strong>{shift.end}</strong></p>
          </div>
        </div>
      </div>
      
    )
  }

  shiftGrid = (orgs) => {
    orgs = this.state.organizations
    let gridValues = []
    if (Array.isArray(orgs)) {
      orgs.forEach((i) => {
        gridValues.push(this.createShiftCards(i))
      })
    } else if (orgs.length === 1) {
      gridValues.push(this.createShiftCards(orgs))
    }
    return gridValues
  }

  // updated render orgs
  renderOrgGrid = (orgs) => {
    orgs = this.state.organizations
    let gridValues = []
    if (Array.isArray(orgs)) {
      orgs.forEach((i) => {
        if (i.admins.includes(this.props.auth.user.email)) {
          gridValues.push(this.createOrganizationCard(i, gridValues.length - 1))
        }
      })
    } else if (orgs.length === 1) {
      if (orgs.admins.includes(this.props.auth.user.email)) {
        gridValues.push(this.createOrganizationCard(orgs, 0))
      }
    }
    return gridValues
  }

  getManagedOrgNumber = () => {
    let count = 0
    this.state.organizations.forEach((i) => {
      if (i.admins.includes(this.props.auth.user.email)) {
        count = count + 1
      }
    })
    return (count)
  }

  render() {
    const { user } = this.props.auth;
    return (
      <div className="ui searchable stackable center aligned grid">
        <div className="fourteen wide column" style={{marginTop:60}}>
          {/* <form>
            <button className="ui left labeled icon mini button" 
              style={{ fontFamily:"Avenir" }} 
              type="submit"
              formAction="/"
            >
              <i className="left arrow icon"></i>
              Back to Home
            </button>
          </form> */}
          <div class="ui segments">
            <div className="ui very padded segment">
              <h1 className="ui header" style={{fontFamily:"Avenir"}}>
                <b>Hello,</b> {user.name}!
                  <p>
                    Welcome to your admin dashboard! 😊
                  </p>
              </h1>
              <br></br>
              <p style={{fontFamily:"Avenir", fontSize:20, marginBottom: 40}}>
                  View and manage your organizations and shifts below.
              </p>
              {/* <hr width="10%" style={{marginTop: "1em", marginBottom: "2em"}}></hr> */}
              {/* LOGOUT */}
              <button
                className="ui red button"
                style={{
                  fontFamily: "Avenir"
                }}
                onClick={this.onLogoutClick}
              >
                Logout
              </button>
            </div>
            <div className="ui segment">
              {/* BIO */}
              <form noValidate onSubmit={this.updateBio} style={{marginBottom: 10, marginTop: 0}}>
              <p style={{fontFamily:"Avenir", fontSize:20, marginBottom: 0, marginTop: 10}}>&nbsp;
                    { (this.state.bio.length > 0) ? this.state.bio : user.bio}
                    <br></br>
                    </p>
                <div className="ui input">
                  <input
                    placeholder="New bio here!"
                    onChange={this.onChange}
                    value={this.state.newBio}
                    id="newBio"
                    type="text"
                    style={{width: 400}}
                  />
                </div>
                <button
                  className="ui blue button"
                  style={{
                    fontFamily: "Avenir",
                    marginTop: 30
                  }}
                >
                  Update your bio!
              </button>
              </form>
            </div>
          </div>
        </div>

        {/* ORGANIZATIONS */}
        <div className="seven wide column">
          <div class="ui segments">
            <div className="ui padded segment">
              <h2 className="ui header" style={{fontFamily:"Avenir", marginTop: "1em"}}>My Organizations</h2>
              <p style={{fontFamily:"Avenir", fontSize:15, marginTop: 20}}>
                  Wow! You're managing <b>{this.getManagedOrgNumber()}</b> organizations!
                </p>
              <br></br>
              <div className="ui centered grid">
                <br></br>
                {this.renderOrgGrid()}
                <br></br>
              </div>
            </div>
            <div class="ui very padded segment">
              <h4 className="ui header" style={{fontFamily:"Avenir", fontSize:15}}>
                  Create New Organization
              </h4>
              <form noValidate onSubmit={this.onCreateNewOrg}>
                <div className="ui input">
                  <input
                    placeholder="Name"
                    onChange={this.onChange}
                    value={this.state.newOrgName}
                    id="newOrgName"
                    type="text"
                  />
                </div>
                <div className="ui input">
                  <input
                    placeholder="About us"
                    onChange={this.onChange}
                    value={this.state.newOrgAbout}
                    id="newOrgAbout"
                    type="text"
                  />
                </div>
                <div className="ui input">
                  <input
                    placeholder="Contact email"
                    onChange={this.onChange}
                    value={this.state.newOrgEmail}
                    id="newOrgEmail"
                    type="text"
                  />
                </div>
                <div className="ui input" style={{marginTop: 0}}>
                  <input
                    placeholder="Phone number"
                    onChange={this.onChange}
                    value={this.state.newOrgPhone}
                    id="newOrgPhone"
                    type="text"
                  />
                </div>
                <div className="ui input">
                  <input
                    placeholder="Image"
                    onChange={this.onChange}
                    value={this.state.newOrgPhoto}
                    id="newOrgPhoto"
                    type="text"
                  />
                </div>
                <div className="column">
                  <button className="ui button"
                    style={{
                      fontFamily: "Avenir",
                      marginTop: 30
                    }}
                    type="submit"
                  >
                    Add New Organization
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
          
          <div className="seven wide column">
            <div className="ui very padded segment">
              <h2 className="ui header" style={{fontFamily:"Avenir"}}>My Shifts</h2>
              <p style={{fontFamily:"Avenir", fontSize:15, marginTop: 20}}>
                Upcoming and Past Shifts
              </p>
              <div className="three wide column">
                <br></br>
                {this.shiftGrid()}
                <br></br>
              </div>
              <br></br>
              <form>
                <button className="ui right labeled icon button" 
                  style={{ fontFamily:"Avenir" }} 
                  type="submit"
                  formAction="/shifts"
                >
                  <i className="right arrow icon"></i>
                  View All Available Shifts
                </button>
              </form>
              <br></br>
            </div>
          </div>

        </div>
    );
  }

  uploadPhoto = (e, org) => {
    let file = e.target.files[0]

    // config AWS
    AWS.config.region = 'us-east-1'
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-1:aa925d77-9f5c-4c68-8488-8834df463cc9',
    })

    let s3 = new AWS.S3()
    s3.putObject({
        Bucket: 'cis350-photos', 
        ContentType: file.type,
        Key: 'files/' + org + '.' + file.name.split('.')[1], 
        Body: file, 
    }, (err, data) => {
        if (err) {
            console.log('ERROR UPLOADING FILE:' + err)
        } else {
            console.log("Successfully uploaded your photo to CIS 350")
            axios.post('/api/organizations/updatePhoto', {
                name: org,
                picture: 'http://cis350-photos.s3.amazonaws.com/files/' + org + '.' + file.name.split('.')[1]
            }).then(() => {
                window.location.reload() // refresh
            })
        }
    })
  }
}

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  deleteOrg: PropTypes.func.isRequired,
  createOrg: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser, deleteOrg, createOrg }
)(Dashboard);
