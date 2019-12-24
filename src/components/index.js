import React from 'react';
import { Grid, Form, Header, Message } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { getPeopleData } from '../actions';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      error: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.getPeopleData();
  }

  onSubmit(e) {
    e.preventDefault();
  
    this.setState({ error: false });

    const { username, password } = this.state;

    // Find if the array contains an object by comparing the property value
    if(this.props.people !== [] && this.props.people.some(character => character.name === username && character.birth_year === password)){
        alert("you're logged in. yay!");
        this.props.history.push("/Planets");
    } else{
        this.setState({ error: true });
    } 
  }
  
  handleChange(e, { name, value }) {
    this.setState({ [name]: value });
  }


  render() {
    const { error } = this.state;

    return (
      <Grid>
        <Grid.Column width={6} />
        <Grid.Column width={4}>
          <Form style={{   marginTop: '200px' }} error={error} onSubmit={this.onSubmit}>
            <Header as="h1">Login</Header>
            {error && <Message
              error={error}
              content="That username/password is incorrect. Try again!"
            />}
            <Form.Input
              inline
              label="Username"
              name="username"
              onChange={this.handleChange}
            />
            <Form.Input
              inline
              label="Password"
              type="password"
              name="password"
              onChange={this.handleChange}
            />
            <Form.Button type="submit">Login!</Form.Button>
          </Form>
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  return { people: state.data.people };
};

export default connect(mapStateToProps, { getPeopleData })(App);