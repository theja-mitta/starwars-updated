import React from 'react';
import axios from 'axios';
import { Grid, Form, Table, Label, Segment, Dimmer, Loader, Image } from 'semantic-ui-react';
import '../style.css';
import planetLogo from '../assets/planet.jpeg';

export default class Planets extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      searchTerm: '',
      planets: [],
      planet: {},
      isFetching: null,
      sortedPlanets: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.searchPlanet = this.searchPlanet.bind(this);
    this.sortPlanets = this.sortPlanets.bind(this);
    this.onPlanetClick = this.onPlanetClick.bind(this);
  }

  getPlanets(url, planets, resolve, reject) {
    axios.get(url)
      .then(response => {
        const retrivedPlanets = planets.concat(response.data.results)
        this.setState({ isFetching: true })
        if (response.data.next !== null) {
          this.getPlanets(response.data.next, retrivedPlanets, resolve, reject)
        } else {
          resolve(retrivedPlanets)
        }
      })
      .catch(error => {
        console.log(error)
        reject('Something wrong. Please refresh the page and try again.')
      })
  }

  handleLogout() {
    this.props.history.push("/");
  }

  searchPlanet() {
    let  { searchTerm } = this.state;
    if(searchTerm.length > 0) {
      new Promise((resolve, reject) => {
        this.getPlanets(`https://swapi.co/api/planets/?page=1&search=${searchTerm}`, [], resolve, reject)
      })
      .then(response => {
        if(response.length === 0) this.setState({ planets: [], planet: {}, sortedPlanets: [], isFetching: false });
        else this.setState({ planets: response, isFetching: false }, this.sortPlanets);
      })
    } else {
      this.setState({ planets: [], planet: {}, sortedPlanets: [] });
    }
  }

  sortPlanets() {
    let { planets, sortedPlanets } = this.state;
    let unknownPlanets = sortedPlanets.concat(planets).filter(planet => isNaN(planet.population));
    let knownPlanets = sortedPlanets.concat(planets).filter(planet => !(isNaN(planet.population)));
    let filteredPlanets = knownPlanets.concat(unknownPlanets).sort(function(obj1, obj2) { 
      if (parseInt(obj1.population) < parseInt(obj2.population)) 
          return -1 
      if (parseInt(obj1.population) > parseInt(obj2.population))
          return 1
      return 0 
    });
    this.setState({ sortedPlanets: filteredPlanets });
  }

  onPlanetClick(planet) {
    this.setState({ planet });
  }

  loadSpinner() {
    if(this.state.isFetching !== null) {
      if(this.state.isFetching !== false) {
        return (
              <React.Fragment><Dimmer active><Loader>Loading</Loader></Dimmer><Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' /></React.Fragment>
        );
      }
    }
  }

  handleChange(e) {
    this.setState({ searchTerm: e.target.value }, this.searchPlanet);
  }

  render() {
    let { sortedPlanets, planet } = this.state;
      return (
        <div>
          <Grid>
            <Grid.Column width={4} />
            <Grid.Column width={6}>
              <Form style={{ marginTop: '100px' }} onSubmit={this.onSubmit}>
                <Form.Input
                  inline
                  label="Search for planets"
                  name="search-term"
                  onChange={this.handleChange}
                />
              </Form>
            </Grid.Column>
            <Grid.Column width={6} style={{ marginTop: '100px' }}>
              <Form.Button onClick={this.handleLogout}>Logout!</Form.Button>
            </Grid.Column>
            <Grid.Column width={16} style={{ marginTop: '30px', textAlign: 'center' }}>
              <Segment>
                {this.loadSpinner()}
                {<ul className="planets">
                  {(sortedPlanets.length !== 0) ? sortedPlanets.map((planet, index) => (
                    <li key={planet.name} onClick={() => this.onPlanetClick(planet)} style={{backgroundColor: `#800020${index*2}` }}>
                      <Label as='a' color='blue' ribbon>
                        {planet.population}
                      </Label>
                      <div className="image">
                        <img src={planetLogo} alt="planet" />
                      </div>
                      <div className="overlay">{planet.name}</div>
                    </li>
                  )) : <div><p>OOPS! No Planets found.</p><p>Please make a search with new keyword this time :)</p></div>}
                </ul>}
              </Segment>
            </Grid.Column>
            { Object.keys(planet).length > 0 ? <Grid.Column width={16} style={{ margin: '30px', textAlign: 'center' }}>
                  <Table celled>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Rotation Period</Table.HeaderCell>
                        <Table.HeaderCell>Orbital Period</Table.HeaderCell>
                        <Table.HeaderCell>Diameter</Table.HeaderCell>
                        <Table.HeaderCell>Climate</Table.HeaderCell>
                        <Table.HeaderCell>Gravity</Table.HeaderCell>
                        <Table.HeaderCell>Terrain</Table.HeaderCell>
                        <Table.HeaderCell>Surface Water</Table.HeaderCell>
                        <Table.HeaderCell>Population</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell>
                          <Label ribbon>{planet.name}</Label>
                        </Table.Cell>
                        <Table.Cell>{planet.rotation_period}</Table.Cell>
                        <Table.Cell>{planet.orbital_period}</Table.Cell>
                        <Table.Cell>{planet.diameter}</Table.Cell>
                        <Table.Cell>{planet.climate}</Table.Cell>
                        <Table.Cell>{planet.gravity}</Table.Cell>
                        <Table.Cell>{planet.terrain}</Table.Cell>
                        <Table.Cell>{planet.surface_water}</Table.Cell>
                        <Table.Cell>{planet.population}</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                </Table>
              </Grid.Column>  : ''   
            }   
          </Grid>
        </div>
      );
  }

}