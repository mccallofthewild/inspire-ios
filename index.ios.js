/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Fetch,
  AsyncStorage,
  NavigatorIOS,
  TouchableHighlight
} from 'react-native';

class Time extends Component{
  constructor(props){
    super(props);
    let t = this;
    t.state = {date: Date.now()}
    setInterval(()=>{t.setState({date: Date.now()})}, 1000)

  }
  render(){
    let date = new Date(this.state.date)
    let day = date.getDate().toString();
    let month = date.getMonth();
    let months = "January, February, March, April, May, June, July, August, September, October, November, December".split(', ');
    let readableMonth = `${months[month]}`;
    let readableDay = `${day}${day[day.length-1]==1? "st" : day[day.length-1]==2? "nd" : day[day.length-1]==3? "rd" : "th"}`
    var militaryHour = date.getHours();
    var hour = militaryHour%12;
    var minute = date.getMinutes().toString();
    var readableTimeOfDay = militaryHour<12? "morning" : militaryHour<17? "afternoon" : militaryHour<20? "evening" : "night";
    var readableTime = `${hour? hour : "12"}:${!!minute[1]? minute : "0" + minute}`;
    
    let TimeObj = {
      day: readableDay,
      month: readableMonth,
      time: readableTime,
      timeOfDay: readableTimeOfDay
    }
        return(
      <Text style={styles.accent}>{TimeObj[this.props.timeprop]}</Text>
    )
  }
}

class Weather extends Component {
  constructor(props){
    super(props)
    let g = this;

    let weatherUrl = 'http://api.openweathermap.org/data/2.5/weather?zip=83705,us&appid=a0a099831632f267bb1f75f12f317779'
    let getterUrl = 'https://bcw-getter.herokuapp.com/?url='
    let fullUrl = getterUrl + encodeURIComponent(weatherUrl)

    g.state = {weather: ''}

    async function getWeatherData (){
      await fetch(fullUrl)
        .then(async (response)=>{
            console.log(response)
              return await response.json()
        })
        .then((responseJSON)=>{
          try {
            AsyncStorage.setItem('weather', JSON.stringify(responseJSON));
            g.setState({weather: responseJSON})
          } catch (error) {
            console.error(error)
          }
          return responseJSON
        }
      )
      .catch((error)=>{console.error(error)})
    } 
    async function getStoredWeather(){
      let weatherObj;
      try{
        weatherObj = await AsyncStorage.getItem('weather')
        weatherObj = await JSON.parse(weatherObj)
      }catch(error){
        console.error(error)
      }
      // let weatherParsed = await weatherObj.json()
      if(!weatherObj){
        console.log(weatherObj)
        g.setState({weather: weatherObj })
      }else{
        try{
          weatherObj = await AsyncStorage.getItem('weather')
          let weatherStorage = await g.setState({weather: weatherObj})
          console.log(weatherObj)
        }catch(error){
          console.error(error);
        }
      }
    }
    getStoredWeather()
    setInterval(()=>{getStoredWeather()}, 60000)



  }
  render(){ 
    let tempweather = {"coord":{"lon":-116.2,"lat":43.61},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"base":"stations","main":{"temp":279.149,"pressure":912.41,"humidity":89,"temp_min":279.149,"temp_max":279.149,"sea_level":1026.85,"grnd_level":912.41},"wind":{"speed":2.84,"deg":113.002},"clouds":{"all":76},"dt":1477981474,"sys":{"message":0.1642,"country":"US","sunrise":1478010096,"sunset":1478046868},"id":5586437,"name":"Boise","cod":200}
        let weather = tempweather
    if(!!this.state.weather){
        console.log(this.state.weather)
        let weather = this.state.weather
    }
				var description = weather.weather[0].description;
				var kelvin = weather.main.temp;
				var celsius = kelvin - 273.15;
				var fahrenheit = (celsius - 32)*5/9;
        console.log(fahrenheit + "F")
				var humanTemperature = description.includes('rain')? {adjective:"rainy", article:"an", item:"umbrella"} : fahrenheit<50? {adjective:"chilly", item:"jacket"} : fahrenheit<80? {adjective:"beautiful", item:"smile"} : fahrenheit<100? {adjective:"hot", item:"sandals"} : 
				{adjective:"fiery lava pit from hell", item:"Mars exploration suit"};
        let newWeatherObj = {
          adjective: humanTemperature.adjective,
          item: humanTemperature.article? "your" + " " + humanTemperature.item : "your" + " " + humanTemperature.item,
        }
    return (
      <Text style={styles.accent}>{newWeatherObj[this.props.thing]}</Text>
    )
  }
}

class Welcome extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Hi McCall, it's <Time timeprop="time"></Time> on the <Time timeprop="day"></Time> of <Time timeprop="month"></Time>.
        </Text>
        <Text style={styles.welcome}>
        Oh, and it's a <Weather thing="adjective"></Weather> <Time timeprop="timeOfDay"></Time> in Boise so don't forget <Weather thing="item"></Weather>!
        </Text>
      </View>
    );
  }
}

class NextPage extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Hi McCall, it's <Time timeprop="time"></Time> on the <Time timeprop="day"></Time> of <Time timeprop="month"></Time>.
        </Text>
        <Text style={styles.welcome}>
        Oh, and it's a <Weather thing="adjective"></Weather> <Time timeprop="timeOfDay"></Time>         <TouchableHighlight onPress={() => this._handleNextPress(nextRoute)}>
        <Text style={{marginTop: 200, alignSelf: 'center'}}>
          See you on the other nav {this.props.myProp}!
        </Text>
      </TouchableHighlight> in Boise so don't forget <Weather thing="item"></Weather>!
        </Text>

      </View>
    );
  }
}

export default class inspire extends Component {
  _handleBackPress() {
    this.props.navigator.pop();
  }

  _handleNextPress(nextRoute) {
    this.props.navigator.push(nextRoute);
  }
  render(){
    return(
      <NavigatorIOS
        initialRoute={{
          component: Welcome,
          title:"Be Inspired"
        }}
        style={{flex:1}}
      >      </NavigatorIOS>
      
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#101010',
  },
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    margin: 30,
    fontFamily:'Bungee',
    color: '#FAFAFA',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  accent: {
    color: '#3EC1D3'
  }
});

AppRegistry.registerComponent('inspire', () => inspire);
