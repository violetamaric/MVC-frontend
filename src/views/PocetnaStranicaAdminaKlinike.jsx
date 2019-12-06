
import React, { Component } from "react";
import ChartistGraph from "react-chartist";
import { Grid, Row, Col, Table } from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import { UserCard } from "components/UserCard/UserCard.jsx";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import { Tasks } from "components/Tasks/Tasks.jsx";


import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import {
  dataPie,
  legendPie,
  dataSales,
  optionsSales,
  responsiveSales,
  legendSales,
  dataBar,
  optionsBar,
  responsiveBar,
  legendBar
} from "variables/Variables.jsx";
import slikaLekar from "assets/img/images.jpg";
import Login from "login.js";
import axios from "axios";

class PocetnaStranicaAdminaKlinike extends React.Component {
  constructor(props){
    super(props);
    console.log("POCETNA STRANICA ADMINA KLINIKE");
    console.log(props);
    this.state = {
      email: props.email,
      uloga: props.uloga, 
      ime: "",
      telefon: "",
      prezime: "",
      idKlinike: "",
      naziv: "",
      adresa: "",
      opis: "",
      ocena: "",
      listaPacijenata:[],
     // redirectToProfilPacijenta: false,
      
    };
   // this.listaPacijenataLekara = this.listaPacijenataLekara.bind(this);

  }

//   handleClick = e => {
//     e.preventDefault();
//     console.log("CLICK *** ");  
//     console.log("PPPPPPPPPPPP: " + e.telefon);
//     // this.props.onClick(this.props.value);
//     // console.log(e.lista.email);
//     console.log("prikaz profila pacijenta");
//     this.setState({
//       redirectToProfilPacijenta: true,
//       emailPacijenta: this.state.emailPacijenta,
  
//     });
//   };

  componentWillMount(){
    console.log("wmount")
    console.log("Preuzimanje admina klinike.....")
    const url = 'http://localhost:8025/api/adminKlinike/getAdminKlinikeByEmail/' + this.state.email;
    axios.get(url)
      .then(Response => {
        console.log("Preuzet admin klinike: ");
        console.log(Response.data);

        this.setState({
          email: Response.data.email,
          ime: Response.data.ime,
          prezime: Response.data.prezime,
          telefon: Response.data.telefon,
          idKlinike: Response.data.idKlinike,
        });
        console.log("Id klinike: " + this.state.idKlinike);
        console.log("ucitaj mi kliniku");
        const urlKlinike = 'http://localhost:8025/api/klinike/' + this.state.idKlinike;    
        console.log(urlKlinike);
        axios.get(urlKlinike)
          .then(klinika => {
            console.log("Preuzeta klinika");
            console.log(klinika.data);
   
            this.setState({
              naziv: klinika.data.naziv,
              adresa: klinika.data.adresa,
              opis: klinika.data.opis,
              ocena: klinika .data.ocena,
             
            });
       
          })
      
      })
      
      .catch(error => {
        console.log("Administrator klinike  nije preuzet")
      })

      //za kliniku ovdje
    
  }


  createLegend(json) {
    var legend = [];
    for (var i = 0; i < json["names"].length; i++) {
      var type = "fa fa-circle text-" + json["types"][i];
      legend.push(<i className={type} key={i} />);
      legend.push(" ");
      legend.push(json["names"][i]);
    }
    return legend;
  }


//   listaPacijenataLekara(){
//     let res=[];
//     let lista = this.state.listaPacijenata;
//     for(var i=0; i< lista.length;i++){
//       console.log( "Pacijent : "  + lista[i].email);
//       this.state.emailPacijenta = lista[i].email;
//       console.log(this.state.emailPacijenta);
//       res.push(
       
//         <tr key = {i}>
//           {/* <td key={lista[i].id}>{lista[i].id}</td>
//           <td key={lista[i].naziv}>{lista[i].ime}</td>
//           <td key={lista[i].adresa}>{lista[i].prezime}</td>
//           <td key={lista[i].opis}>{lista[i].email}</td> */}
//           <td key={lista[i].id}>{lista[i].id}</td>
//           <td>{lista[i].ime}</td>
//           <td>{lista[i].prezime}</td>
//           <td key={lista[i].email}>{lista[i].email}</td>
//           <td onClick={this.handleClick} ><button> Prikazi profil </button></td>
//           {/* <td><link to="/admin/login">Prikazi profil</link></td> */}
//          {/* <td key={lista[i].ocena}>{lista[i].ocena}</td> */}
     
//          </tr>
//       )
//     }
//     return res;
//   }

  render() {
    // console.log("Ispisi  props u pocetna stranica lekara: "); 
    // console.log(this.props);

    // const redirectToProfilPacijenta = this.state.redirectToProfilPacijenta;
    const email = this.state.email;
    const uloga = this.state.uloga;
    const ime = this.state.ime;
    const prezime = this.state.prezime;
    const telefon = this.state.telefon;
    const idKlinike = this.state.idKlinike;
    const naziv = this.state.naziv;
    const adresa = this.state.adresa;
    const opis = this.state.opis;
    const ocena = this.state.ocena;
    // console.log(nazivKlinike);
    // console.log(telefon);
    // console.log("Render ps email: " + email);
    // console.log("Render ps uloga: " + uloga);
    // console.log("Render ps ime: " + ime);
    // console.log("Render ps prezime: " + prezime);
    // console.log("Render ps telefon: " + telefon)

    // if (redirectToProfilPacijenta === true) {
    //   return (
    //     <BrowserRouter>
    //       <Switch>
    //         <Route
    //           path="/profilPacijenta"
    //           render={props => <ProfilPacijenta {...props} emailPacijenta={emailPacijenta} />}
    //         />
    //         <Redirect from="/" to="/profilPacijenta" />
    //       </Switch>
    //     </BrowserRouter>
    //   );
    // }

    
    return (
      <div className="content">
        <Grid fluid>
     
          <Row>
         
            
            <Col md={4}>
            <Card
                // statsIcon="fa fa-clock-o"
                title="Administator klinike"
                // category="Ime"
                content={
                  <div id="a">
                    {/* <div className="slikaKCdiv">
                      <h2> 
                        <img className="slikaLekar" src={slikaLekar}></img>
                      </h2>
                    </div> */}
                    <div className="typo-line">
                      <h2>
                        <p className="category">Ime:</p>
                        <label className="adresaKC"> {this.state.ime} </label>
                      </h2>
                    </div>
                    <div className="typo-line">
                      <h2>
                        <p className="category">Prezime:</p>
                        <label className="adresaKC">{this.state.prezime} </label>
                      </h2>
                    </div>
                    <div className="typo-line">
                      <h2>
                        <p className="category">Telefon:</p>
                <label className="adresaKC">{this.state.telefon}</label>
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
            <Col md={5}>
              <Card
              
                title="Klinika"
                // category="24 Hours performance"
                // stats="Updated 3 minutes ago"
             //   ctTableFullWidth
               // ctTableResponsive
                content={
                  <div id="a">
                    <div className="typo-line">
                      <h2>
                        <p className="category">Naziv klinike:</p>
                        <label className="adresaKC"> {this.state.naziv} </label>
                      </h2>
                    </div>
                    <div className="typo-line">
                      <h2>
                        <p className="category">Adresa:</p>
                        <label className="adresaKC"> {this.state.adresa} </label>
                      </h2>
                    </div>
                    <div className="typo-line">
                      <h2>
                        <p className="category">Opis:</p>
                        <label className="adresaKC">{this.state.opis} </label>
                      </h2>
                    </div>
                    <div className="typo-line">
                      <h2>
                        <p className="category">Ocena:</p>
                        <label className="adresaKC">{this.state.ocena}</label>
                      </h2>
                    </div>
                    
                    
                    
                  </div>
                }
                // legend={
                //   <div className="legend">{this.createLegend(legendSales)}</div>
                // }
              />
            </Col>
            <Row>
            <Col md={3}>
              <StatsCard
                
                bigIcon={<i className="pe-7s-server text-warning" />}
                // statsText="Lista pacijenata"
                // statsValue="105GB"
                // statsIcon={<i className="fa fa-refresh" />}
                 statsIconText="Pregledi"
              />
          </Col>
            {/* <h1>{this.state}</h1> */}
          <Col md={3}>
              <StatsCard
                bigIcon={<i className="pe-7s-wallet text-success" />}
                // statsText="Pocetak pregleda"
                // statsValue="$1,345"
                // statsIcon={<i className="fa fa-calendar-o" />}
                 statsIconText="Lekari"
              />
            </Col>
            {/* <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-graph1 text-danger" />}
                // statsText="Profil korisnika"
                // statsValue="23"
                // statsIcon={<i className="fa fa-clock-o" />}
                 statsIconText="Profil korisnika"
              />
            </Col> */}
            <Col md={3}>
              <StatsCard
                bigIcon={<i className="pe-7s-graph1 text-danger" />}
                // statsText="Profil korisnika"
                // statsValue="23"
                // statsIcon={<i className="fa fa-clock-o" />}
                 statsIconText="Sale"
              />
            </Col>
            {/* <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="fa fa-twitter text-info" />}
                statsText=""
                // statsValue="+45"
                // statsIcon={<i className="fa fa-refresh" />}
                 statsIconText="Zakazivanje pregleda i operacija"
              />
            </Col> */}
          </Row>
          </Row>
{/* 
          <Row>
            <Col md={6}>
              <Card
                id="chartActivity"
                title="2014 Sales"
                category="All products including Taxes"
                stats="Data information certified"
                statsIcon="fa fa-check"
                content={
                  <div className="ct-chart">
                    <ChartistGraph
                      data={dataBar}
                      type="Bar"
                      options={optionsBar}
                      responsiveOptions={responsiveBar}
                    />
                  </div>
                }
                legend={
                  <div className="legend">{this.createLegend(legendBar)}</div>
                }
              />
            </Col>

            <Col md={6}>
              <Card
                title="Tasks"
                category="Backend development"
                stats="Updated 3 minutes ago"
                statsIcon="fa fa-history"
                content={
                  <div className="table-full-width">
                    <table className="table">
                      <Tasks />
                    </table>
                  </div>
                }
              />
            </Col>
          </Row> */}
        </Grid>
      </div>
    );
  }
}

export default PocetnaStranicaAdminaKlinike;