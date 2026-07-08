import { useState, useEffect } from 'react'
import axios from 'axios'

export const GetWeather = ({ city }) => {
    const capitalCity = city[0]
    const apiKey = import.meta.env.VITE_KEY;
    const url = 'http://api.openweathermap.org/data/2.5/weather?q=' + capitalCity + '&units=metric&APPID=' + apiKey + ''
    const [weather, setWeather] = useState([])

    useEffect(() => {
        axios
            .get(url)
            .then(response => {
                setWeather(response.data)
            })
    }, [url])
    

    const temperature = weather?.main?.temp
    const feelsLike = weather?.main?.feels_like
    const wind = weather?.wind?.speed
    const humidity = weather?.main?.humidity
    const description = weather?.weather?.[0].description
    const icon = weather?.weather?.[0].icon

    return (
        <div>
            
            <h3> The weather in {capitalCity} right now:  {description} </h3>
            
            {/* prevents trying to get the image if url contains still undefined icon at first render */}
            {icon !== undefined && <img
                src={'http://openweathermap.org/img/wn/' + icon + '@4x.png'}
                alt='weather icon'
            />}

            <p> Temperature: {' '}  {temperature} °C ( feels like {feelsLike} °C)</p>

            <p> Wind: {' '} {wind} m/s </p>

            <p> Humidity: {' '} {humidity} % </p>

        </div>
    )
}