
import React, { Component } from "react";
import { Grid, Row, Col, Table  } from "react-bootstrap";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import DatePicker from "react-datepicker";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import "react-datepicker/dist/react-datepicker.css";
import { Card } from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import axios from "axios";
import Dialog from 'react-bootstrap-dialog';
import PocetnaStranicaLekara from "views/PocetnaStranicaLekara.jsx";

import "klinickiCentar.css";

import Slikalekari from "assets/img/lekari.jpg";
import slikaPregledi from "assets/img/pregled.jpg"
import kalendarSlika from "assets/img/calendar.png"
import moment from "moment";
import slikaPacijent from "assets/img/pacijentImage.jpg";


class Pregled extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      uloga: props.uloga,
      email: props.email,
      token: props.token,
      emailPacijenta: props.emailPacijenta,
      idPregleda : props.idPregleda,
      id: "",  
      opis: "",
      idMedSestre: 0, 
      imeMS: "",
      prezimeMS: "",
      redirectToOdustani: false,
      listaDijagnoza: [],
      izabranaDijagnoza: null,
      sifraOznaceneDijagnoze: "",
      nazivOznaceneDijagnoze: "",
      listaLekova: [],
      izabraniLekovi:[],
      recepti: [],
      izabranLek: null,
      misljenje: "",
      //za zdravstveni karton
      zkOpen: false,
      visina: 0, 
      tezina: 0,
      krvnaGrupa: "",
      pacijent : [],
      zdravstveniKarton: [],
      listaIzvestaja: [],

      //za informacije o pregledu
      infPreOpen: false,
      pregled: [],
      
      
    };
    this.config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }
    
    this.handleChange = this.handleChange.bind(this);
    
    this.handleOdustani = this.handleOdustani.bind(this);

    //dijagnoze
    this.dodavanjeDijagnoze = this.dodavanjeDijagnoze.bind(this);
    this.listaDijagnoza = this.listaDijagnoza.bind(this);
    this.listaDijagnozaUKC= this.listaDijagnozaUKC.bind(this);
    this.biranjeDijagnoze = this.biranjeDijagnoze.bind(this);

    //za lekove
    this.listaLekova = this.listaLekova.bind(this);
    this.prekopirajListu = this.prekopirajListu.bind(this);
    this.listaLekovaUKC = this.listaLekovaUKC.bind(this);
    this.dodavanjeLeka = this.dodavanjeLeka.bind(this);
    this.biranjeLeka = this.biranjeLeka.bind(this);
    this.izabraniLekovi = this.izabraniLekovi.bind(this);

    this.zavrsiPregled = this.zavrsiPregled.bind(this);

    //metode za zdravstveni karton
    this.izmenaZK = this.izmenaZK.bind(this);
    this.ucitavanjeZKPacijenta = this.ucitavanjeZKPacijenta.bind(this);
    this.ucitavanjePacijenta = this.ucitavanjePacijenta.bind(this);
    
    //za pregled
    this.ucitavanjePregleda = this.ucitavanjePregleda.bind(this);
  }


  handleChange = e => {
    e.preventDefault();
    const { name, value } = e.target;

    this.setState({ [name]: value }, () => console.log(this.state));
  };
 
  handleOdustani(){
    this.setState({
      redirectToOdustani: true
    })
  }  

  componentWillMount() {
    this.listaDijagnoza();
    this.listaLekova();
    this.ucitavanjeZKPacijenta();
    this.ucitavanjePacijenta();
    this.ucitavanjePregleda();

    const url = "http://localhost:8025/api/lekari/getLekarByEmail";

  axios
    .get(url, this.config)
    .then(Response => {
      console.log("Preuzet lekar: ");
      console.log(Response.data);

      this.setState({
        id: Response.data.id
      });
      this.setState({
        imeMS: Response.data.ime
      })
      this.setState({
        prezimeMS: Response.data.prezime
      })

     
    })
    .catch(error => {
      console.log("Med sestra nije preuzeta");
    });
  }
 

  listaDijagnozaUKC(){
    let res=[];
    let lista = this.state.listaDijagnoza;
    // for (var i = 0; i < lista.length; i++) {
    //   res.push(<option value={lista[i].id}>{lista[i].oznaka}, {lista[i].naziv}, {lista[i].opis} </option>);
    // }

    for(var i=0; i< lista.length;i++){
      res.push(
        <tr key = {i}>
          
            <td>
              <input
                name="odabranaSala"
                type="radio"
                value={lista[i].id}
                checked={this.state.izabranaDijagnoza == lista[i].id}
                onChange={e => {
                  this.biranjeDijagnoze(e);
                }}
              ></input>
            </td>
           <td >{lista[i].oznaka}</td>
           <td >{lista[i].naziv}</td>
           <td >{lista[i].opis}</td>
          
          
         </tr>
       )
     }
    return res;
  }
  listaLekovaUKC(){
    let res=[];
    let lista = this.state.izabraniLekovi;
    

    for(var i=0; i< lista.length;i++){
      res.push(
        <tr key = {i}>
          
            <td>
              <input
                name="odabranaSala"
                type="checkbox"
                value={lista[i].id}
                checked={lista[i].oznacen}
                onChange={e=> this.biranjeLeka(e)}
                
              ></input>
            </td>
           <td >{lista[i].sifra}</td>
           <td >{lista[i].naziv}</td>
         </tr>
       )
    }
    return res;
  }
  listaDijagnoza(){
    console.log("--------lista dijagnoza");
    const url2 = 'http://localhost:8025/api/dijagnoze/listaDijagnoza/'; 
    console.log(url2);
    axios.get(url2, this.config)
      .then(response => {
        console.log("URL Dijagnoza");
        console.log(response);
        this.setState({
          listaDijagnoza: response.data
        });
      })
      .catch(error => {
          console.log("nije uspeo url dijagnoza");
          console.log(error);
      })
  }
  listaLekova(){
    console.log("--------lista dijagnoza");
    const url2 = 'http://localhost:8025/api/lekovi/listaLekova/'; 
    console.log(url2);
    axios.get(url2, this.config)
      .then(response => {
        console.log("URL Lista Lekova");
        console.log(response);
        this.setState({
          listaLekova: response.data
        }, ()=> this.prekopirajListu());
        
      })
      .catch(error => {
          console.log("nije uspeo url lekova");
          console.log(error);
      })
  }
  prekopirajListu(){
    for(var i = 0; i < this.state.listaLekova.length; i++){
      this.state.izabraniLekovi.push({
        
        id: this.state.listaLekova[i].id,
        sifra: this.state.listaLekova[i].sifra,
        naziv: this.state.listaLekova[i].naziv,
        oznacen: false
        
      })
    }
    this.izabraniLekovi();
  }

  biranjeDijagnoze(dijagnoza){

    const idL = dijagnoza.target.value;

    this.setState({
      izabranaDijagnoza: dijagnoza.target.value
    });

    console.log("Value id:" + dijagnoza.target.value);
    
    let lista = this.state.listaDijagnoza;

    for (var i = 0; i < lista.length; i++) {
      var naziv = lista[i].naziv;
      var id = lista[i].id;
      var sifra = lista[i].oznaka;

      if (id == dijagnoza.target.value) {
        this.setState({
          nazivOznaceneDijagnoze: naziv,
          sifraOznaceneDijagnoze: sifra
        }, ()=> this.dialog.hide());
       
        
      }
      
    }
    
  }

  biranjeLeka(lek){
    console.log("BIRANJE LEKA : " + lek.target.value);
    
    let lista = this.state.izabraniLekovi;
    console.log("duzina niza lekova: " + lista.length);
    
    for (var i = 0; i < lista.length; i++) {
        if (lista[i].id == lek.target.value) {
          if(lista[i].oznacen == false){
            console.log("PRE: " + lista[i].id + " " + lista[i].sifra + " oznacen " + lista[i].id);
            lista[i].oznacen = true;
            this.setState({
              izabraniLekovi: lista
            }, ()=> {
              this.izabraniLekovi();
              this.dialog.hide();
            })
            console.log("POSLE: " + lista[i].id + " " + lista[i].sifra + " oznacen " + lista[i].id);
            
            

          }else{
            console.log("PRE: " + lista[i].id + " " + lista[i].sifra + " oznacen " + lista[i].id);
            lista[i].oznacen = false;
            this.setState({
              izabraniLekovi: lista
            }, ()=> {
              this.izabraniLekovi();
              this.dialog.hide();
            })
            console.log("POSLE: " + lista[i].id + " " + lista[i].sifra + " oznacen " + lista[i].id);
            
            
            
          }    
        } 
    }
    
    

  }

  izabraniLekovi(){
    let rez=[];
    let lista = this.state.izabraniLekovi;
    this.state.recepti = [];
    for(var i=0; i< lista.length; i++){
      if(lista[i].oznacen == true){
        this.state.recepti.push( lista[i].id);
        
        rez.push(
          <tr key = {i}>
             <td >{lista[i].sifra}</td>
             <td >{lista[i].naziv}</td>
           </tr>
         )

      }

     }
    
    return rez;
  }

  dodavanjeDijagnoze(){
    console.log("DODAVANJE DIJAGNOZE");
    this.dialog.show({
      title: 'Dijagnoze',
      body: [
        
        <div>  
            
            <Table striped hover>
              <thead>
                <tr>
                  <th id="Idijagnoze"></th>
                  <th id="OznakaDijagnoze">Oznaka</th>
                  <th id="NazivDijagnoze">Naziv</th>
                  <th id="OpisDijagnoze">Opis</th>           
                </tr>
              </thead>
              <tbody>
                {this.listaDijagnozaUKC()}  
              </tbody>
          </Table>
        </div>
              
      ],
      
      
      bsSize: 'medium',
      onHide: (dialog) => {
        dialog.hide()
        console.log('closed by clicking background.')
      }
    })

   
  }

  dodavanjeLeka(){
    console.log("DODAVANJE LEKA");
    
    this.dialog.show({
      title: 'Lekovi',
      body: [
        
        <div>  
           
            <Table striped hover>
              <thead>
                <tr>
                  <th id="Idijagnoze"></th>
                  <th id="OznakaDijagnoze">Sifra</th>
                  <th id="NazivDijagnoze">Naziv</th>
                           
                </tr>
              </thead>
              <tbody>
                {this.listaLekovaUKC()}  
              </tbody>
          </Table>
        </div>
              
      ],
      
      bsSize: 'medium',
      onHide: (dialog) => {
        dialog.hide()
        console.log('closed by clicking background.')
      }
    })
  }

  zavrsiPregled(){
    
    console.log("PREGLED: ");
    console.log("Dijagnoza: "+this.state.izabranaDijagnoza);
    console.log("Sadrzaj: "+this.state.misljenje);
    console.log("Recepti broj: "+this.state.recepti.length);
    console.log("Svi oznaceni recepti:  ");
    for(var i= 0; i < this.state.recepti.length; i++){
      console.log(this.state.recepti[i]);
    }
    let lekovi = "";
    for(var i=0; i < this.state.izabraniLekovi.length; i++){
      if(this.state.izabraniLekovi[i].oznacen == true){
        lekovi += this.state.izabraniLekovi[i].naziv + ", ";
      }
    }
    console.log("Pregled : " + this.state.idPregleda);
    
    this.dialog.show({
      title: 'Izvestaj o pregledu',
      body: [
        
        <div>  
          <Grid>
            <Row>
              <h4>Misljenje: </h4>
              <h5>{this.state.misljenje}</h5>
            </Row>
            <Row>
              <h4>Dijagnoza: </h4>
              <h5>{this.state.sifraOznaceneDijagnoze + " " + this.state.nazivOznaceneDijagnoze}</h5>
            </Row>
            <Row>
              <h4>Recepti: </h4>
              <h5>{lekovi}</h5>
            </Row>
          </Grid>
            
        </div>
              
      ],
      actions: [
        Dialog.CancelAction(),
        Dialog.OKAction(() => {
          console.log("OK je kliknuto!");
          const url3 = "http://localhost:8025/api/izvestajOP/zavrsetakPregleda";
          axios
            .post(url3, { 
              dijagnozaID : this.state.izabranaDijagnoza,
              sadrzaj: this.state.misljenje,
              pregledID: this.state.idPregleda,
              recepti: this.state.recepti
            }, this.config)
            .then(response => {
              console.log("ZAVRSEN PREGLED! ");
              console.log(response.data);
              this.props.handleClick("PREGLED JE ZAVRSEN")
              this.setState({
                redirectToOdustani: true
              })
              
    
            })
            .catch(error => {
              console.log("NIJE USPEO PREGLED DA SE ZAVRSI! ");
            });
          
         
        })
      ], 
      bsSize: 'medium',
      onHide: (dialog) => {
        dialog.hide()
        console.log('closed by clicking background.')
      }
    })

     
    
  }

  izmenaZK(){
    console.log("IZMENA ZK");
    axios
    .put("http://localhost:8025/api/pacijenti/izmenaZK",{
        id: this.state.zdravstveniKarton.id,
        pacijentID: this.state.emailPacijenta,
        visina: this.state.visina,
        tezina: this.state.tezina,
        krvnaGrupa: this.state.krvnaGrupa
        
    }, this.config)
    .then(Response => {
      console.log("IZMENJEN ZDRAVSTVENI KARTON");
      console.log(Response.data);
      this.setState({
        zkOpen: false
      }, ()=> {
        this.props.handleClick("ZDRAVSTVENI KARTON JE IZMENJEN")
        this.ucitavanjeZKPacijenta()
      })
      // this.setState({
      //   zdravstveniKarton : Response.data,
      //   zkOpen: false
      // });
      
    })
    .catch(error => {
      console.log("NIJE USPELA IZMENA ZK");
      console.log(error);
    });

    

  }
  ucitavanjeZKPacijenta(){
    axios
    .get("http://localhost:8025/api/pacijenti/findZKMS/" + this.state.emailPacijenta, this.config)

    .then(Response => {
      console.log("URL 111");
      console.log(Response);
      this.setState({
        zdravstveniKarton : Response.data,
        listaIzvestaja: Response.data.listaIzvestaja
      });
      console.log(this.state);
    })
    .catch(error => {
      console.log("nije uspeo url1");
      console.log(error);
    });
  }
  ucitavanjePacijenta(){
    console.log("OVO JE PACIJENT " + this.state.emailPacijenta)
    axios
    .get('http://localhost:8025/api/pacijenti/findPacijentLekar/' + this.state.emailPacijenta ,
     this.config)
      .then(Response => {
        console.log("Ucitavanje pacijenta");
        console.log(Response);
        this.setState({
          pacijent: Response.data,
          emailPacijenta: Response.data.id,
          ime: Response.data.ime,
          prezime: Response.data.prezime,
          telefon: Response.data.telefon,
          adresa: Response.data.adresa,
          grad: Response.data.grad,
          drzava: Response.data.drzava,
          lbo: Response.data.lbo,
          jmbg: Response.data.jmbg
        }, ()=> {
          console.log("usaooo u proveru ");
          console.log(this.state.token);
          axios
          .post('http://localhost:8025/api/lekari/mogucPrikazZKPacijenta' ,
          { id: Response.data.id}, this.config)
            .then(Response => {
              console.log("Da li je odobren ili ne uvid u zk ");
              console.log(Response.data);
             if(Response.data == "MOZE"){
               console.log("MOZE DA PRISTUPI");
               this.setState({
                prikaziZK: true
               })
             }else{
               console.log("NE MOZE DA PRISTUPI")
               this.setState({
                prikaziZK: false
               })
             }
            })
            .catch(error => {
              console.log("nije uspeo url1");
              console.log(error);
            });
            
        });

        
        console.log(this.state);
      })
      .catch(error => {
        console.log("nije uspeo url1");
        console.log(error);
      });
  }

  ucitavanjePregleda(){
    axios
    .get("http://localhost:8025/api/pregledi/getPregledPac/" + this.state.pregledID, this.config)

    .then(Response => {
      console.log("uspesno ucitan pregled");
      console.log(Response);
      this.setState({
        pregled : Response.data
      }, ()=> console.log("uspesno preuzet pregled"));
      
    })
    .catch(error => {
      console.log("nije ucitao pregled");
      console.log(error);
    });
  }


  render() {
    console.log(this.props);

    if(this.state.redirectToOdustani === true){
      return (
        <BrowserRouter>
          <Switch>
            <Route
              path="/pocetnaStranicaLekara"
              render={props => <PocetnaStranicaLekara {...props}
                  token={this.state.token}
                  email={this.state.email} 
                  uloga={this.state.uloga}
                  handleClick={this.props.handleClick}
                //nije emailPacijenta vec je id al dobro
                  emailPacijenta={this.state.emailPacijenta}  
                />}
            />
            <Redirect from="/" to="/pocetnaStranicaLekara" />
          </Switch>
        </BrowserRouter>
      );
    }

    return (
        <Grid>
            {
              this.state.zkOpen ?
              <Row>
                <Col>
                  <Button className="izadjiDugme" 
                    onClick={this.izmenaZK}
                  >Izmeni</Button>
                  
                  <Button className="izadjiDugme" onClick={()=> this.setState({
                    zkOpen: false
                  })}>Izadji</Button>
                </Col>
                <Col md={8}>
                  <Card
                    title="Zdravstveni karton"
                    
                    content={
                      <div className="ct-chart">
                
                        <Table striped hover>
                        <tbody>
                          <tr>
                            <td>
                              <label>Ime: </label>
                            </td>
                            <td>
                              <input
                                type="text"
                                name="ime"
                                defaultValue={this.state.pacijent.ime}
                                disabled="disabled"
                                // placeholder={this.state.ime}
                                // noValidate
                                onChange={this.handleChange}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <label>Prezime: </label>
                            </td>
                            <td>
                              <input
                                type="text"
                                name="prezime"
                                defaultValue={this.state.pacijent.prezime}
                                disabled="disabled"
                                // placeholder={this.state.prezime}
                                // noValidate
                                onChange={this.handleChange}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <label>Jedinstveni broj osiguranika: </label>
                            </td>
                            <td>
                              <input
                                type="text"
                                name="lbo"
                                defaultValue={this.state.pacijent.lbo}
                                disabled="disabled"
                                // placeholder={this.state.lbo}
                                // noValidate
                                onChange={this.handleChange}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <label>Visina: </label>
                            </td>
                            <td>
                              <input
                                type="text"
                                name="visina"
                                defaultValue={this.state.zdravstveniKarton.visina}
                                // disabled="disabled"
                                // placeholder={this.state.visina}
                                // noValidate
                                onChange={this.handleChange}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <label>Tezina: </label>
                            </td>
                            <td>
                              <input
                                type="text"
                                name="tezina"
                                defaultValue={this.state.zdravstveniKarton.tezina}
                                // disabled="disabled"
                                // placeholder={this.state.tezina}
                                // noValidate
                                onChange={this.handleChange}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <label>Krvna grupa: </label>
                            </td>
                            <td>
                              <input
                                type="text"
                                name="krvnaGrupa"
                                defaultValue={this.state.zdravstveniKarton.krvnaGrupa}
                                // disabled="disabled"
                                // placeholder={this.state.krvnaGrupa}
                                // noValidate
                                onChange={this.handleChange}
                              />
                            </td>
                          </tr>
                        </tbody>
                      </Table>

                      </div>
                    }
                  
                  />
                </Col> 
                <Col md={4}>
              <Card
                // statsIcon="fa fa-clock-o"
                title="O pacijentu"
                // category="Ime"
                content={
                  <div id="a">
                    <div className="slikaKCdiv">
                      <h2>
                        <img
                          className="slikaPacijent"
                          src={slikaPacijent}
                        ></img>
                      </h2>
                    </div>
                    <Table striped hover>
                      <thead className="thead-dark">
                        
                        <tr>
                          <td>E-mail:</td>
                          <td>{this.state.pacijent.email}</td>
                        </tr>
                        <tr>
                          <td>LBO:</td>
                          <td>{this.state.pacijent.lbo}</td>
                        </tr>
                        <tr>
                          <td>JMBG:</td>
                          <td>{this.state.pacijent.jmbg}</td>
                        </tr>
                        <tr>
                          <td>Telefon:</td>
                          <td>{this.state.pacijent.telefon}</td>
                        </tr>
                      </thead>
                    </Table>

                  </div>
                }

            
                
              />
            </Col>
                <Col md={8}>
              <Card
                title="Posete lekarima"
                content={
                  <div>
                    <Table striped hover>
                      <thead>
                        <tr>
                          <th>Datum</th>
                          <th>Lekar</th>
                          <th>Izvestaj</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.listaIzvestaja.map(izvestaj => {
                          return (
                            <tr>
                              <td>
                                {moment(izvestaj.datum).format("DD.MM.YYYY.")}
                              </td>
                              <td>
                                {izvestaj.imeL} {izvestaj.prezimeL}
                              </td>
                              <td>{izvestaj.sadrzaj}</td>
                              {/* <td>
                                <Button>izmeni</Button>
                              </td> */}
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                }
              />
            </Col>
                <Col md={4}>
              <Card
                // statsIcon="fa fa-clock-o"
                title="Istorija bolesti"
                // category="Ime"
                content={
                  <div id="a">
                    <Table striped hover>
                      <thead className="thead-dark">
                        <tr>
                          <th>Datum</th>
                          <th>Bolest</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.listaIzvestaja.map(izvestaj => {
                          return (
                            <tr>
                              <td>
                                {moment(izvestaj.datum).format("DD.MM.YYYY.")}
                              </td>
                              <td>{izvestaj.dijagnozaN}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                }
              />
            </Col>

              </Row>
              :  null
            }
            {
              this.state.infPreOpen ?
              <Row>
                <Col>
                  <Button className="izadjiDugme" 
                    onClick={this.setState({infPreOpen: false})}
                  >Izadji</Button>
                  
                  
                </Col>
                <Col md={12}>
                  <Card
                    title="Informacije o pregledu"
                    
                    content={
                      <div className="ct-chart">
                
                        <Table striped hover>
                        <tbody>
                          <tr>
                            <td>
                              <label>TipPregleda: </label>
                            </td>
                            <td>
                              <input
                                type="text"
                                name="ime"
                                defaultValue={this.state.pregled.nazivTP}
                                disabled="disabled"
                                // placeholder={this.state.ime}
                                // noValidate
                                // onChange={this.handleChange}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <label>Datum i vreme: </label>
                            </td>
                            <td>
                              <input
                                type="text"
                                name="prezime"
                                defaultValue={moment(this.state.pregled.datum).format("DD.MM.YYYY. ") + this.state.pregled.termin + ":00" }
                                disabled="disabled"
                                // placeholder={this.state.prezime}
                                // noValidate
                                // onChange={this.handleChange}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <label>Sala: </label>
                            </td>
                            <td>
                              <input
                                type="text"
                                name="lbo"
                                defaultValue={this.state.pregled.salaBR + " " +  this.state.pregled.salaN}
                                disabled="disabled"
                                // placeholder={this.state.lbo}
                                // noValidate
                                // onChange={this.handleChange}
                              />
                            </td>
                          </tr>
                          
                        </tbody>
                      </Table>

                      </div>
                    }
                  
                  />
                </Col> 
              </Row>
              : null
            }
            { this.state.zkOpen === false && this.state.infPreOpen === false ?
              <Row>
                <Row className="linkoviPregled">
                  <Col lg={3} sm={6}>
                      {/* {this.renderRedirect()} */}
                      <div 
                      onClick={()=> this.setState({
                        zkOpen : true 
                      })}
                      >
                      <StatsCard
                        bigIcon={<div> <img src = { kalendarSlika} width="30" height="20" /></div>}
                        // statsText="Lista pacijenata"
                              // statsValue="105GB"
                        // statsIcon={<i className="fa fa-refresh" />}
                        statsIconText="Zdravstveni karton"
                      />
                      </div>                    
                  </Col>
                  
                  <Col lg={3} sm={6}>
                      {/* {this.renderRedirect()} */}
                      <div 
                      // onClick={this.handleListaPacijenata}
                      >
                          <StatsCard
                              bigIcon={<div> <img src = { kalendarSlika} width="30" height="20" /></div>}
                              // statsText="Lista pacijenata"
                              // statsValue="105GB"
                              // statsIcon={<i className="fa fa-refresh" />}
                              statsIconText="Informacije o pregledu"
                          />
                      </div>                    
                  </Col>  
                  <Col lg={3} sm={6}>
                      {/* {this.renderRedirect()} */}
                      <div 
                      // onClick={this.handleListaPacijenata}
                      >
                          <StatsCard
                              bigIcon={<div> <img src = { kalendarSlika} width="30" height="20" /></div>}
                              // statsText="Lista pacijenata"
                              // statsValue="105GB"
                              // statsIcon={<i className="fa fa-refresh" />}
                              statsIconText="Zakazi pregled"
                          />
                      </div>                    
                  </Col>
                  <Col lg={3} sm={6}>
                      {/* {this.renderRedirect()} */}
                      <div 
                      // onClick={this.handleListaPacijenata}
                      >
                          <StatsCard
                              bigIcon={<div> <img src = { kalendarSlika} width="30" height="20" /></div>}
                              // statsText="Lista pacijenata"
                              // statsValue="105GB"
                              // statsIcon={<i className="fa fa-refresh" />}
                              statsIconText="Zakazi operaciju"
                          />
                      </div>                    
                  </Col>                    
              </Row>
                <Row>
                <div className="formaPregleda">

                    <Card
                        title="Pregled"
                        // category="24 Hours performance"
                        // stats="Updated 3 minutes ago"
                        content={
                            <div className="formaPregleda" >
                            <Grid fluid>
                               
                                <Row >
                                    
                                        <Col md={4} lg={4} className="dijagnozaRecept">
                                            <h4 className="poljePregled">Dodavanje dijagnoze</h4>  
                                            
                                            <input className="poljePregled" 
                                             disabled="disabled" 
                                             type="text"
                                              name="lekNaziv"
                                              // defaultValue = "" 
                                              value={this.state.sifraOznaceneDijagnoze + " " + this.state.nazivOznaceneDijagnoze}
                                                // onChange={this.handleChange}
                                            ></input>
                                            <Button className="pregledDugme" 
                                            onClick={this.dodavanjeDijagnoze}
                                            >Dodavanje dijagnoze</Button>
                                            <Dialog ref={(el) => { this.dialog = el }} ></Dialog>
                                        </Col>
                                        <Col md={4} lg={4} className="dijagnozaRecept">
                                            <h4 className="poljePregled">Izdavanje recepta</h4>
                                            
                                            {/* mozda bolje tabela sa jednom kolonom  */}
                                            {/* <input className="poljePregled"  disabled="disabled"
                                             type="text"
                                              name="lekNaziv"
                                              // defaultValue = "" 
                                              // value={this.state. + " " + this.state.nazivOznaceneDijagnoze}
                                                // onChange={this.handleChange}
                                            ></input> */}
                                            <Table striped hover>
                                              <thead>
                                                <tr>
                                                  
                                                  <th id="OznakaDijagnoze">Sifra</th>
                                                  <th id="NazivDijagnoze">Naziv</th>
                                                          
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {this.izabraniLekovi()}
                                              </tbody>
                                          </Table>
                                            <Button className="pregledDugme" 
                                            onClick={this.dodavanjeLeka}
                                            >Izaberi lek</Button>
                                            {/* <Dialog ref={(el) => { this.dialog = el }} ></Dialog> */}

                                            

                                        </Col>
                                   
                                </Row>

                                <Row >
                                  <Col className="misljenjeOkvir">
                                    <h4 className="poljePregled">Misljenje</h4>
                                    <textarea
                                    className="misljenjePolje"
                                        type="text"
                                        name="misljenje"
                                        onChange={this.handleChange}
                                    >
                                    </textarea>  
                                  </Col>
                            </Row>
                                <Row >
                                    <Col>

                                        <Button 
                                        className="dugmeZavrsiPregled" 
                                        onClick={this.handleOdustani}
                                        >Odustani</Button>

                                        <Button 
                                        className="dugmeZavrsiPregled" 
                                        onClick={this.zavrsiPregled}
                                        >Zavrsi pregled</Button>

                                    </Col>
                                </Row>
                            </Grid>
                        
                            </div>
                        }
                    />
                </div>
            </Row>
              </Row>
              : null 
            }    
            <Row></Row>
           
        </Grid>
     
    );
  }
}

export default Pregled;
