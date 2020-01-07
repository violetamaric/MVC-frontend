import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl
} from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import { UserCard } from "components/UserCard/UserCard.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import "izmenaProfila.css";

//dodam link za sliku  mozda od doktora!!
import avatar from "assets/img/faces/face-3.jpg";
import "login.js";
import { log } from "util";
import Login from "login";
import slikaPacijent from "assets/img/pacijentImage.jpg";
import axios from "axios";
// import Dialog from 'react-bootstrap-dialog';

class IzmenaProfilaAdminaKC extends Component {
  constructor(props) {
    super(props);
    console.log("IZMENA PROFILA Admina KC");
    this.state = {
      email: props.email,
      uloga: props.uloga,
      token: props.token,
      ime: "",
      prezime: "",
      lozinka: "",
      imeN: "",
      prezimeN: "",
      lozinkaN: "" ,
      menjanjeLozinke: "password",
      is_checked: false,
    };
    this.config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    this.handleCheckBox = this.handleCheckBox.bind(this);
  }

  componentWillMount() {
    
    const url =
      "http://localhost:8025/api/administratoriKC/pronadjenAdministratorKC";
    axios
      .get(url, this.config)
      .then(Response => {
        console.log("Preuzet admin: ");
        console.log(Response.data);

        this.setState({
          email: Response.data.email
        });
        this.setState({
          ime: Response.data.ime
        });
        this.setState({
          prezime: Response.data.prezime
        });
        this.setState({
          lozinka: Response.data.lozinka
        });
      })
      .catch(error => {
        console.log("Admin KC nije preuzet");
      });
  }
  handleChange = e => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
    console.log(this.state);
    console.log("On change !!!");
  };

  handleSumbit = e => {
    e.preventDefault();
    console.log("KLIK SUBMITTT");
    // let formErrors = { ...this.state.formErrors };
    console.log("Izmena : ---------------");
    console.log(this.state.imeN);
    console.log(this.state.prezimeN);
    axios
      .put("http://localhost:8025/api/administratoriKC/izmena", {
        ime: this.state.imeN,
        prezime: this.state.prezimeN,
        email: this.state.email,
        adresa: this.state.lozinkaN
      }, this.config)
      .then(response => {
        console.log(response.data);

        this.setState({
          ime: response.data.ime
        });

        this.setState({
          prezime: response.data.prezime
        });

        this.setState({
          lozinka: response.data.lozinka
        });
        

      })
      .catch(error => {
        console.log("Izmena nije uspela! ");
      });
  };
  handleCheckBox() {
    if(this.state.is_checked == true){
      this.setState({ is_checked: false });
      this.setState({ menjanjeLozinke : "password"});
    }else{
      this.setState({ is_checked: true });
      this.setState({ menjanjeLozinke : "text"});
    }
    
  }

  render() {
    const email = this.state.email;
    const uloga = this.state.uloga;
    const ime = this.state.ime;
    const prezime = this.state.prezime;
    const lozinka = this.state.lozinka;
    const imeN = this.state.imeN;
    const prezimeN = this.state.prezimeN;
    const lozinkaN = this.state.lozinkaN;
 

    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={8}>
              <Card
                title="Izmena podataka"
                content={
                  <form
                    onSubmit={this.handleSumbit}
                    className="formaIzmenaProfilaAdminaKC"
                  >
                    <div className="ime">
                      <label htmlFor="ime">Email: </label>
                      <input
                        type="text"
                        name="ime"
                        defaultValue={email}
                        disabled= "disabled"
                        // placeholder={this.state.ime}
                        // noValidate
                        // onChange={this.handleChange}
                      />
                    </div>
                    <div className="ime">
                      <label htmlFor="ime">Ime: </label>
                      <input
                        type="text"
                        name="imeN"
                        defaultValue={ime}

                        // placeholder={this.state.ime}
                        // noValidate
                        onChange={this.handleChange}
                      />
                    </div>
                    <div className="prezime">
                      <label htmlFor="prezime">Prezime: </label>
                      <input
                        type="text"
                        name="prezimeN"
                        defaultValue={prezime}
                        // placeholder="prezime"
                        // noValidate
                        onChange={this.handleChange}
                      />
                    </div>

                   
                    <div className="lozinka">
                      <label htmlFor="lozinka">Lozinka: </label>
                      <input
                        type={this.state.menjanjeLozinke}
                        name="lozinkaN"
                        defaultValue={lozinka}
                        // placeholder={this.state.adresa}
                        // noValidate
                        onChange={this.handleChange}
                      />
                      <div className="checkbox">
                        <input
                          id="check"
                          type="checkbox"
                          onChange={this.handleCheckBox}
                          checked={this.state.is_checked}
                              
                        />
                        <label htmlFor="check">prikazi lozinku</label>
                      </div> 
                    </div>

                    <div className="izmeniPodatkeAdminKC">
                      <Button type="submit">Izmeni podatke</Button>
                    </div>
                  </form>
                  
                }
              />
            </Col>
            <Col md={4}>
              <Card
                // statsIcon="fa fa-clock-o"
                title="O Adminu"
                // category="Ime"
                content={
                  <div id="a">
                    {/* <div className="slikaKCdiv">
                      <h2>
                        <img
                          className="slikaPacijent"
                          src={slikaPacijent}
                        ></img>
                      </h2>
                    </div> */}

                    <div className="typo-line">
                      <h2>
                        <p className="category">Email: </p>
                        <label className="emailAdminaKC">{email}</label>
                      </h2>
                    </div>
                    <div className="typo-line">
                      <h2>
                        <p className="category">Ime: </p>
                        <label className="imeAdminaKC">{ime}</label>
                      </h2>
                    </div>
                    <div className="typo-line">
                      <h2>
                        <p className="category">Prezime: </p>
                        <label className="prezimeAdminaKC">{prezime}</label>
                      </h2>
                    </div>
                    {/* <div className="typo-line">
                      <h2>
                        <p className="category">Lozinka: </p>
                        <label className="lozinkaAdminaKC">{lozinka}</label>
                      </h2>
                    </div> */}
                  </div>
                }

              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default IzmenaProfilaAdminaKC;
