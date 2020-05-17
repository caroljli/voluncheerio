import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getOrgs } from "../../actions/orgActions";
import axios from "axios";
import AWS from 'aws-sdk';
axios.defaults.withCredentials = true

class Organization extends Component {
    constructor(props, { match }) {
        super();
        this.state = {
            data: '',
            organizations: [],
            volunteers: [],
            orgId: props.match.params.orgName,
        }
    }

    componentDidMount() {
        axios
        .get("/api/organizations/")
        .then(result => {
          this.setState({ organizations: result.data.data })
        }).then(
          axios
          .get("/api/shifts/getVolunteers")
          .then(result2 => {
            this.setState({ volunteers: result2.data })
            console.log(this.state.volunteers)
          })
        )
    }

    callApi = () => {}

    getVolunteers = (org) => {
        console.log(org)
        let vols = ''
        let count = 0
        this.state.volunteers.forEach((i) => {
            if (i.organization === org) {
                i.volunteers.forEach((j) => {
                    vols = vols + j + ', '
                    count = count + 1
                })
            }
        })
        console.log(vols)
        if (count === 0) {
            return 'None so far!'
        }
        return vols.slice(0, -2)
        // TODO: finish this
        // axios.post("getVolunteersByOrg", {
        //     org: org
        // }).then(result3 => {
        //     this.setState({ volunteers: result3.data })
        // })
    }

    renderOrgPage = (org, key) => {
        return (
            <div className="ui searchable stackable center aligned grid" key={key}>
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

                    <br></br>

                    <div className="ui very padded segment" style={{marginTop:60, marginBottom: 30}}>
                        <h1 className="ui header" style={{fontFamily:"Avenir"}}>
                        <b>{org.name}</b>
                        </h1>
                        <p style={{fontFamily:"Avenir", fontSize:20}}>
                            You are now viewing the public organization page of <b>{ org.name }</b>
                            {/* { this.printAllOrgs(orgs) } */}
                        {/* <br style={{marginTop: 60}}></br><br></br> */}
                        {/* <input style={{marginBottom: 5, fontFamily:"Avenir", fontSize: 12}}
                            accept="image/*"
                            type='file'
                            onChange={(e) => {
                                e.preventDefault();
                                this.uploadPhoto(e, org.name);
                            }}>
                        </input> */}
                        </p>
                    </div>
                </div>

                <div className="five wide column">
                    <div className="ui left aligned container">
                        <h1 className="ui header" style={{fontFamily:"Avenir", fontSize:25}}>About the Organization</h1>
                        <h2 className="ui header" style={{fontFamily:"Avenir", fontSize:20}}><strong>Admins</strong></h2>
                        <div className="ui message" style={{width: "90%"}}>
                            <p style={{fontFamily:"Avenir", fontSize:15, fontWeight:600}}>{org.admins}</p>
                        </div>

                        <h2 className="ui header" style={{fontFamily:"Avenir", fontSize:20}}><strong>Contact Information</strong></h2>
                        <div className="ui message" style={{width: "90%"}}>
                            <a style={{fontFamily:"Avenir", fontSize:15, fontWeight:600}}>{ org.email }</a>
                            <p style={{fontFamily:"Avenir", fontSize:15, fontWeight:600}}>{ org.phone }</p>
                        </div>
                        
                        <h2 className="ui header" style={{fontFamily:"Avenir", fontSize:20}}><strong>Volunteers</strong></h2>
                        <div className="ui message" style={{width: "90%"}}>
        <p style={{fontFamily:"Avenir", fontSize:15, fontWeight:600}}>{this.getVolunteers(org.name)}</p>
                        </div>

                        <h2 className="ui header" style={{fontFamily:"Avenir", fontSize:20}}><strong>Description</strong></h2>
                        <div className="ui message" style={{width: "90%"}}>
                            <p style={{fontFamily:"Avenir", fontSize:15, fontWeight:600}}>{ org.about }</p>
                        </div>
                        
                    </div>
                </div>
                <div className="nine wide column">
                    <div className="ui left aligned container">
                        <img className="ui fluid image" src={org.picture}></img>
                    </div>
                </div>

            </div>
        )
    }

    getCurrentOrg = (orgs) => {
        orgs = this.state.organizations
        let orgId = this.state.orgId
        let gridValues = []
        
        if (Array.isArray(orgs)) {
          orgs.forEach((i, index) => {
            if (index == orgId) {
                gridValues.push(this.renderOrgPage(i, index))
            } else {
                return (<p>index not found</p>)
            }
          })
        } else if (orgs.length == 1) {
            gridValues.push(this.renderOrgPage(orgs, 0))
        } else {
            return (<p>page not found</p>)
        }

        return gridValues

    }

    printAllOrgs = (orgs) => {
        orgs = this.state.organizations
        let gridValues = []
        if (Array.isArray(orgs)) {
            orgs.forEach((i, index) => {
                gridValues.push(this.tempOrgCreate(i))
            })
        } else {
            return(<p>none</p>)
        }

        return gridValues
    }

    tempOrgCreate = (org) => {
        return (
          <div>
            <p>organizations:</p>
            <p>{org.name}</p>
          </div>
        )
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    render() {
        return (
        <div>
            { this.getCurrentOrg() }
            {/* { this.printAllOrgs() } */}
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

Organization.propTypes = {
  auth: PropTypes.object.isRequired,
  getOrgs: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getOrgs }
)(Organization);
