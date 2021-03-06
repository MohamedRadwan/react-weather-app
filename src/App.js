import React from 'react';
import './App.css';
import Form from './app_component/form.component';
import 'weather-icons/css/weather-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Weather from './app_component/weather.component';

const API_KEY = '813e4344d361dfdb33174b6478db88c6';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      city: undefined,
      country: undefined,
      icon: undefined,
      main: undefined,
      celsius: undefined,
      temp_max: undefined,
      temp_min: undefined,
      description: '',
      error: false,
      serverError: undefined
    };
    this.weatherIcon = {
      Thunderstorm: 'wi-thunderstorm',
      Drizzle: 'wi-sleet',
      Rain: 'wi-storm-showers',
      Snow: 'wi-snow',
      Atmosphere: 'wi-fog',
      Clear: 'wi-day-sunny',
      Clouds: 'wi-day-fog'
    };
  }

  get_WeatherIcon(icons, rangeID) {
    switch (true) {
      case rangeID >= 200 && rangeID <= 232:
        this.setState({ icon: this.weatherIcon.Thunderstorm });
        break;
      case rangeID >= 300 && rangeID <= 321:
        this.setState({ icon: this.weatherIcon.Drizzle });
        break;
      case rangeID >= 500 && rangeID <= 531:
        this.setState({ icon: this.weatherIcon.Rain });
        break;
      case rangeID >= 600 && rangeID <= 622:
        this.setState({ icon: this.weatherIcon.Snow });
        break;
      case rangeID >= 701 && rangeID <= 781:
        this.setState({ icon: this.weatherIcon.Atmosphere });
        break;
      case rangeID === 800:
        this.setState({ icon: this.weatherIcon.Clear });
        break;
      case rangeID >= 801 && rangeID <= 804:
        this.setState({ icon: this.weatherIcon.Clouds });
        break;
      default:
        this.setState({ icon: this.weatherIcon.Clouds });
    }
  }
  getWeather = async e => {
    e.preventDefault();
    const city = e.target.elements.city.value;
    const country = e.target.elements.country.value;
    const units = e.target.elements.Select.value;
    if (city && country) {
      const api_call = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_KEY}&units=${units}`
      );
      const response = await api_call.json();
      console.log(response);

      if (
        Number(response.cod) === 401 ||
        Number(response.cod) === 404 ||
        Number(response.cod) === 429 ||
        Number(response.cod) === 500
      ) {
        this.setState({ serverError: response.message });
      } else {
        this.setState({
          city: `${response.name}, ${response.sys.country}`,
          celsius: response.main.temp,
          temp_max: response.main.temp_max,
          temp_min: response.main.temp_min,
          description: response.weather[0].description,
          error: false,
          serverError: undefined
        });
        this.get_WeatherIcon(this.weatherIcon, response.weather[0].id);
      }
    } else {
      this.setState({ error: true });
    }
  };
  state = {};
  render() {
    return (
      <div className='App'>
        <Form
          loadweather={this.getWeather}
          error={this.state.error}
          serverError={this.state.serverError}
        />
        <Weather
          city={this.state.city}
          country={this.state.country}
          temp_celsius={this.state.celsius}
          temp_max={this.state.temp_max}
          temp_min={this.state.temp_min}
          description={this.state.description}
          weatherIcon={this.state.icon}
        />
      </div>
    );
  }
}

export default App;
