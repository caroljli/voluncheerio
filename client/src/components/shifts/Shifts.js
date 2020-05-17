import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getOrgs } from "../../actions/orgActions";
import axios from "axios";

class Shifts extends Component {
  constructor() {
    super();
    this.state = {
      data: '',
      organizations: [],
      volunteers: [],
    };
  }

  componentDidMount() {
    axios
    .get("/api/organizations/")
    .then(result => {
      this.setState({ organizations: result.data.data })
    }).then(
      axios
      .get("/api/volunteer/")
      .then(result2 => {
        this.setState({ volunteers: result2.data })
      })
    )
  }

  callApi = () => {
    // return null
    // return 
    // axios.get('/api/organizations/')
    // const response = await fetch('api/organizations/organizationInfo');
    // const body = await response.json();
    // if (response.status !== 200) throw Error(body.message);
    // return body;
  };

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  // create buttons for users
  createButtonsByVolunteer = (shiftID, organization) => {
    let arr = []
    this.state.volunteers.forEach((i) => {
      arr.push(
        <button onClick={
          (e) => {
            e.preventDefault(); 
            axios.post('/api/shifts/request', {
              shiftID: shiftID, 
              organization: organization, 
              volunteer: i.email,
              admin: this.props.auth.user.email
            }).then(result => {
              console.log(result)
            })
          }}
        class={"ui blue mini button"}>
        Request: {i.name}</button>
      )
    })
    return arr
  }

  // // testing
  // printAllOrgs = (orgs) => {
  //   if (Array.isArray(orgs)) {
  //       orgs.forEach((i) => {
  //           this.tempOrgCreate(i)
  //       })
  //   } else {
  //       return(<p>none</p>)
  //   }
  // }

  // tempOrgCreate = (org) => {
  //   return (
  //     <div>
  //       <p>organizations:</p>
  //       <p>{org.name}</p>
  //     </div>
  //   )
  // }

  // by shift
  createShiftCardByOrg = (shift) => {
    return (
      <div class="ui very padded segment">
        <h1 class="ui header" style={{fontFamily:"Avenir"}}>{shift.shiftID}</h1>
        <p style={{fontFamily:"Avenir", fontSize:15}}>{shift.organization}</p>
        <p style={{fontFamily:"Avenir", fontSize:15}}>{shift.start}</p>
        <p style={{fontFamily:"Avenir", fontSize:15}}>{shift.end}</p>
        <div>
          {this.createButtonsByVolunteer(shift.shiftID[0], shift.organization[0])}
        </div>
      </div>
    )
  }

   // by org
  createShiftCards = (org, index) => {
    console.log(org)
    return (
      <div class="seven wide column" key={index}>
        <a class="fluid ui button" href={'/organization/' + index} style={{fontFamily:"Avenir"}}>{org.name}</a>
        {this.renderShiftCardsByOrg(org.shifts)}
      </div>
    )
  }

  renderShiftCardsByOrg = (shifts) => {
    let gridValues = []
    if (Array.isArray(shifts)) {
      shifts.forEach((i) => {
        gridValues.push(this.createShiftCardByOrg(i))
      })
    } else if (shifts.length === 1) {
      gridValues.push(this.createShiftCardByOrg(shifts))
    }
    return gridValues
  }

  renderAllShifts = (orgs) => {
    orgs = this.state.organizations
    let gridValues = []
    if (Array.isArray(orgs)) {
      orgs.forEach((i, index) => {
        gridValues.push(this.createShiftCards(i, index))
      })
    } else if (orgs.length === 1) {
      gridValues.push(this.createShiftCards(orgs, 0))
    }
    return gridValues
  }

  render() {
    const { user } = this.props.auth;

    return (
      <div className="ui searchable stackable center aligned grid">
        <div className="fourteen wide column" style={{marginTop:60}}>
          <form>
            <button className="ui left labeled icon mini button" 
              style={{ fontFamily:"Avenir" }} 
              type="submit"
              formAction="/dashboard"
            >
              <i className="left arrow icon"></i>
              Back to Dashboard
            </button>
          </form>

          <div className="ui very padded segment" style={{marginTop:60}}>
            <h1 className="ui header" style={{fontFamily:"Avenir"}}>
              <b>Hello,</b> {user.name}!
            </h1>
            <p style={{fontFamily:"Avenir", fontSize:20}}>
                Here are all the available shifts from every organization. 👩‍💻
                {/* test: { this.printAllOrgs(this.state.organizations) } */}
            </p>
          </div>
        </div>

        {this.renderAllShifts(this.state.organizations)}

      </div>
    );
  }
}

Shifts.propTypes = {
  auth: PropTypes.object.isRequired,
  getOrgs: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getOrgs }
)(Shifts);