
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
import ListaPacijenataLekar from "views/ListaPacijenataLekar.jsx";
import "klinickiCentar.css";

import Slikalekari from "assets/img/lekari.jpg";
import slikaPregledi from "assets/img/pregled.jpg"
import kalendarSlika from "assets/img/calendar.png"


class Pregled extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      uloga: props.uloga,
      email: props.email,
      token: props.token,
      emailPacijenta: props.emailPacijenta,
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
      izabraniLekovi: [],
      izabranLek: null


      
    };
    this.config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }
    this.izaberiTip = this.izaberiTip.bind(this);
    this.zahtevOdmorOdsustvo = this.zahtevOdmorOdsustvo.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeDatePocetka = this.handleChangeDatePocetka.bind(this);
    this.handleChangeDateKraja = this.handleChangeDateKraja.bind(this);
    this.handleOdustani = this.handleOdustani.bind(this);

    //dijagnoze
    this.dodavanjeDijagnoze = this.dodavanjeDijagnoze.bind(this);
    this.listaDijagnoza = this.listaDijagnoza.bind(this);
    this.listaDijagnozaUKC= this.listaDijagnozaUKC.bind(this);
    this.biranjeDijagnoze = this.biranjeDijagnoze.bind(this);

    //za lekove
    this.listaLekova = this.listaLekova.bind(this);
    this.listaLekovaUKC = this.listaLekovaUKC.bind(this);
    this.dodavanjeLeka = this.dodavanjeLeka.bind(this);
    this.biranjeLeka = this.biranjeLeka.bind(this);
    this.izabraniLekovi = this.izabraniLekovi.bind(this);

    
  }

  izaberiTip(izbor) {
    
    console.log("izbor odmor odsustvo");

    console.log(izbor.target.value);

    this.setState({
      tipOdmorOdsustvo : izbor.target.value
      
    },() => console.log(this.state.tipOdmorOdsustvo));
  
  };
  handleChange = e => {
    e.preventDefault();
    const { name, value } = e.target;

    this.setState({ [name]: value }, () => console.log(this.state));
  };
  handleChangeDatePocetka = date => {
    console.log(date)
    this.setState(
      {
        datumPocetka: date
      },
      () => console.log(this.state)
    );
  };
  handleChangeDateKraja = date => {
    console.log(date)
    this.setState(
      {
        datumKraja: date
      },
      () => console.log(this.state)
      
    );
  };
  handleOdustani(){
    this.setState({
      redirectToOdustani: true
    })
  }  

  componentWillMount() {
    this.listaDijagnoza();
    this.listaLekova();


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
  zahtevOdmorOdsustvo() {

    const url = "http://localhost:8025/api/odmorodsustvo/posaljiZahtevLekar";
    axios
      .post(url,{ 
        datumOd : this.state.datumPocetka,
        datumDo : this.state.datumKraja,
        opis : this.state.opis,
        status: false,
        idLekara : this.state.id,
        imeL: this.state.imeMS,
        prezimeL: this.state.prezimeMS,
        emailL: this.state.email,
        tip : this.state.tipOdmorOdsustvo
      }, this.config)
      .then(Response => {
        
        console.log("uspesno poslat zahtev")
        console.log(Response.data);

      })
      .catch(error => {
        console.log("Zahtev nije poslat");
      });
  };
 

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
    let lista = this.state.listaLekova;
    // for (var i = 0; i < lista.length; i++) {
    //   res.push(<option value={lista[i].id}>{lista[i].oznaka}, {lista[i].naziv}, {lista[i].opis} </option>);
    // }

    for(var i=0; i< lista.length;i++){
      res.push(
        <tr key = {i}>
          
            <td>
              <input
                name="odabranaSala"
                type="checkbox"
                value={lista[i].id}
                // checked={this.state.izabranaDijagnoza == lista[i].id}
                // onChange={e => {
                //   this.biranjeDijagnoze(e);
                // }}
                
                onChange={e=> this.biranjeLeka(e)}
                // onChange={e => this.biranjeDijagnoze(e)}
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
        });
      })
      .catch(error => {
          console.log("nije uspeo url lekova");
          console.log(error);
      })
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
    console.log("lek izabran : " + lek.target.value);
    
    //nije potrebno
    this.setState({
      izabranLek: lek.target.value
    });

    // console.log("Value id:" + dijagnoza.target.value);
    let lista1 = this.state.izabraniLekovi;
    let zaBrisanje = null;
    for(var i = 0; i < lista1.length; i++){

      if(lista1[i].id == lek.target.value){
        console.log("brise se")
        zaBrisanje = lista1[i].id;


      }else{
        console.log("dodaje se")
        let lista = this.state.listaLekova;

        for (var i = 0; i < lista.length; i++) {

          var naziv = lista[i].naziv;
          var id = lista[i].id;
          var sifra = lista[i].sifra;

          if (id == lek.target.value) {
            
            this.state.izabraniLekovi.push({
              id: id,
              sifra: sifra,
              naziv: naziv
            })
            // this.setState({
            //   nazivOznaceneDijagnoze: naziv,
            //   sifraOznaceneDijagnoze: sifra
            // }, ()=> this.dialog.hide());
    
          }
          
        }
      }
    }
    if(zaBrisanje != null){
      lista1.pop({
        id: id,
        sifra: sifra,
        naziv: naziv
      })
    }
    
    
  }

  izabraniLekovi(){
    let rez=[];
    let lista = this.state.izabraniLekovi;

    for(var i=0; i< lista.length;i++){
      rez.push(
        <tr key = {i}>
           <td >{lista[i].sifra}</td>
           <td >{lista[i].naziv}</td>
         </tr>
       )
     }
    return rez;
  }

  dodavanjeDijagnoze(){
    console.log("DODAVANJE DIJAGNOZE");
    this.dialog.show({
      title: 'Dijagnoze',
      body: [
        
        <div>  
            {/* <select
            // className="lekarTelefonLabel"
            //   name="lekadID"
              onChange={e => this.biranjeDijagnoze(e)}
            >
                {this.listaDijagnozaUKC()}
            </select>       */}
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
            {/* <select
            // className="lekarTelefonLabel"
            //   name="lekadID"
              onChange={e => this.biranjeDijagnoze(e)}
            >
                {this.listaDijagnozaUKC()}
            </select>       */}
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



  render() {
    console.log(this.props);

    if(this.state.redirectToOdustani === true){
      return (
        <BrowserRouter>
          <Switch>
            <Route
              path="/listaPacijenataLekar"
              render={props => <ListaPacijenataLekar {...props}
                  token={this.state.token}
                  email={this.state.email} 
                  uloga={this.state.uloga}
                //nije emailPacijenta vec je id al dobro
                  emailPacijenta={this.state.emailPacijenta}  
                   />}
            />
            <Redirect from="/" to="/listaPacijenataLekar" />
          </Switch>
        </BrowserRouter>
      );
    }

    return (
        <Grid>
            <Row className="linkoviPregled">
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
                            statsIconText="Informacije o pacijentu"
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
                                            <input className="poljePregled"  disabled="disabled"
                                             type="text"
                                              name="lekNaziv"
                                              // defaultValue = "" 
                                              // value={this.state. + " " + this.state.nazivOznaceneDijagnoze}
                                                // onChange={this.handleChange}
                                            ></input>
                                            <Table striped hover>
                                              <thead>
                                                <tr>
                                                  
                                                  <th id="OznakaDijagnoze">Sifra</th>
                                                  <th id="NazivDijagnoze">Naziv</th>
                                                          
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {/* {this.state.izabraniLekovi()} */}
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
                                        name="opis"
                                        onChange={this.handleChange}
                                    >

                                    </textarea>
                                    {/* <input
                                        className="misljenjePolje"
                                        type="text"
                                        name="opis"
                                        // defaultValue={ime}
                                        // placeholder={this.state.ime}
                                        // noValidate
                                        onChange={this.handleChange}
                                    />  */}
                                    </Col>
                            </Row>
                                <Row >
                                    <Col  >
                                        <Button 
                                        className="dugmeZavrsiPregled" 
                                        onClick={this.handleOdustani}
                                        >Odustani</Button>
                                        <Button 
                                        className="dugmeZavrsiPregled" 
                                        // onClick={this.zahtevOdmorOdsustvo}
                                        >Zavrsi pregled</Button>
                                    </Col>
                                </Row>
                            </Grid>
                        
                            </div>
                        }
                    />
                </div>
            </Row>
            
        </Grid>
     
    );
  }
}

export default Pregled;
