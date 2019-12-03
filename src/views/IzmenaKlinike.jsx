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
import slikaLekar from "assets/img/images.jpg"
import axios from "axios";

class IzmenaKlinike extends Component {
  constructor(props){
    super(props);
    console.log("IZMENA KLINIKE");
    this.state = {
      email: props.email,
      uloga: props.uloga, 
      ime: "",
      telefon: "",
      prezime: "",

    }

  }


  componentWillMount(){
    // console.log("wmount!!!!")
    // const url = 'http://localhost:8025/api/adminKlinike/getAdminKlinikeByEmail/' + this.state.email;
    // axios.get(url)
    //   .then(Response => {
    //     console.log("Preuzet admin klinike: ");
    //     console.log(Response.data);
      
    //     this.setState({
    //       email: Response.data.email
    //     });
    //     this.setState({
    //       ime: Response.data.ime
    //     });

    //     this.setState({
    //       prezime: Response.data.prezime
    //     });
    //     this.setState({
    //       telefon: Response.data.telefon
    //     });
    //   })
      
    //   .catch(error => {
    //     console.log("Admin klinike nije preuzet")
    //   })
  }
  handleChange = e => {
    // e.preventDefault();
    // this.setState({[e.target.name]: e.target.value});
    // console.log(this.state)
    // console.log("On change !!!")

  };
  
  handleSumbit = e => {
    // e.preventDefault();
    // console.log("KLIK SUBMITTT")
    // // let formErrors = { ...this.state.formErrors };
    //   console.log("Izmjena : ---------------")  
    //   console.log(this.state.ime);
    //   console.log(this.state.prezime);
    // axios
    //   .put("http://localhost:8025/api/adminKlinike/update", {
    //     ime: this.state.ime,
    //     prezime: this.state.prezime,
    //     telefon: this.state.telefon,
    //     email: this.state.email
    //   })
    //   .then(response => {
    //     console.log(response.data);
 
      
    //     this.setState({
    //       ime: response.data.ime
    //     });

    //     this.setState({
    //       prezime: response.data.prezime
    //     });

    //     this.setState({
    //       telefon: response.data.telefon
    //     });

    //     // this.setState({
    //     //   redirectToReferrer: true
    //     // });
    //   })
    //   .catch(error => {
    //     console.log("Izmena nije uspela! ")
    //   });
  };

  render() {
    const email = this.state.email;
    const uloga = this.state.uloga;
    const ime = this.state.ime;
    const prezime = this.state.prezime;
    const telefon = this.state.telefon;


    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={8}>
              <Card
                title="Izmena podataka"
                content={
                  <form onSubmit={this.handleSumbit} className="formaIzmenaProfilaLekara">
                     <div className="ime">
                        <label htmlFor="ime">Naziv: </label>
                        <input
                          type="text"
                          name="ime"
                          
                          defaultValue={ime}
                          // placeholder={this.state.ime}
                          // noValidate
                          onChange={this.handleChange}
                        />
                      </div>
                      <div className="prezime">
                        <label htmlFor="prezime">Adresa: </label>
                        <input
                          type="text"
                          name="prezime"
                          defaultValue={prezime}
                          // placeholder="prezime"
                          // noValidate
                          onChange={this.handleChange}
                        />
                      </div>
                      <div className="prezime">
                        <label htmlFor="prezime">Opis: </label>
                        <input
                          type="text"
                          name="prezime"
                          defaultValue={prezime}
                          // placeholder="prezime"
                          // noValidate
                          onChange={this.handleChange}
                        />
                      </div>
                     
                      {/* <div className="klinikaK">
                        <label htmlFor="klinikaK">klinika: </label>
                        <input
                          type="text"
                          name="klinikaK"
                          placeholder="klinikaK"
                          // noValidate
                          // onChange={this.handleChange}
                        />
                      </div> */}
                      {/* <div className="klinika">
                        <label htmlFor="klinika">Klinika: </label>
                        <input
                          type="text"
                          name="klinika"
                          placeholder="klinika"
                          // noValidate
                          // onChange={this.handleChange}
                        />
                      </div> */}
                     
                      <div className="izmeniPodatkeLekar">
                         <button type="submit">Izmeni podatke</button>
                      </div>
                  </form>
           
                }
              />
            </Col>
            <Col md={4}>
            <Card
                // statsIcon="fa fa-clock-o"
                title="O klinici"
                // category="Ime"
                content={
                  <div id="a">
                    <div className="slikaKCdiv">
                      <h2> 
                        <img className="slikaLekar" src={slikaLekar}></img>
                      </h2>
                    </div>
                    
                    <div className="typo-line">
                      <h2>
                        <p className="category">Naziv:</p>
                        <label className="adresaKC">ucitati data</label>
                      </h2>
                    </div>
                    <div className="typo-line">
                      <h2>
                        <p className="category">Adresa:</p>
                        <label className="opisKC">ucitati data</label>
                      </h2>
                    </div>
                    
                    <div className="typo-line">
                      <h2>
                        <p className="category">Opis:</p>
                        <label className="opisKC">ucitati data</label>
                      </h2>
                    </div>
                    
                    
                    
                  </div>
                }
                
                // category="opis ... naziv adresa i opis  "
                // stats="Campaign sent 2 days ago"
                // content={
                //   <div
                //     id="chartPreferences"
                //     className="ct-chart ct-perfect-fourth"
                //   >
                //     <ChartistGraph data={dataPie} type="Pie" />
                //   </div>
                // }
                // legend={
                //   <div className="legend">{this.createLegend(legendPie)}</div>
                // }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default IzmenaKlinike;
