import axios from 'axios';
import { generateAdvice, calculateOptimalConditions, assessCropRisk } from '../utils/physicsEngine.js';
import dotenv from 'dotenv';

dotenv.config();

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = 'https://api.weatherapi.com/v1'; // Or your preferred weather API base URL


// Enhanced error handling for API calls
const handleWeatherAPIError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    switch (status) {
      case 400:
        return { message: 'Invalid location provided', status: 400 };
      case 401:
        return { message: 'Weather API key invalid or expired', status: 401 };
      case 403:
        return { message: 'Weather API quota exceeded', status: 403 };
      case 404:
        return { message: 'Location not found', status: 404 };
      default:
        return { message: data.error?.message || 'Weather service error', status };
    }
  }
  return { message: 'Failed to connect to weather service', status: 503 };
};

// Get current weather and generate greenhouse advice
export const getWeatherAdvice = async (req, res) => {
  try {
    const { location } = req.params;
    
    if (!location || location.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'Location parameter is required'
      });
    }

    if (!WEATHER_API_KEY) {
      return res.status(500).json({
        status: 'error',
        message: 'Weather API key not configured'
      });
    }

    console.log(`🌤️  Fetching weather data for: ${location}`);

    // Fetch current weather data
    const weatherResponse = await axios.get(
      `${BASE_URL}/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(location)}&aqi=yes`
    );

    const weatherData = weatherResponse.data;
    const { current, location: locationData } = weatherData;

    // Generate comprehensive greenhouse advice
    const advice = generateAdvice(current);
    const optimalConditions = calculateOptimalConditions(current);
    const riskAssessment = assessCropRisk(current);

    // Enhanced response with more agricultural insights
    const response = {
      status: 'success',
      timestamp: new Date().toISOString(),
      location: {
        name: locationData.name,
        region: locationData.region,
        country: locationData.country,
        coordinates: {
          lat: locationData.lat,
          lon: locationData.lon
        },
        timezone: locationData.tz_id,
        localTime: locationData.localtime
      },
      weather: {
        temperature: {
          celsius: current.temp_c,
          fahrenheit: current.temp_f,
          feelsLike: current.feelslike_c
        },
        humidity: current.humidity,
        pressure: current.pressure_mb,
        wind: {
          speed_kph: current.wind_kph,
          speed_mph: current.wind_mph,
          direction: current.wind_dir,
          degree: current.wind_degree,
          gust_kph: current.gust_kph
        },
        precipitation: {
          mm: current.precip_mm,
          inches: current.precip_in
        },
        cloudCover: current.cloud,
        uvIndex: current.uv,
        visibility: current.vis_km,
        condition: {
          text: current.condition.text,
          icon: current.condition.icon,
          code: current.condition.code
        },
        isDay: current.is_day === 1,
        airQuality: current.air_quality || null
      },
      greenhouse: {
        advice,
        optimalConditions,
        riskAssessment,
        priority: advice.filter(item => item.priority === 'high').length > 0 ? 'high' : 
                 advice.filter(item => item.priority === 'medium').length > 0 ? 'medium' : 'low'
      }
    };

    console.log(`✅ Successfully processed weather data for ${locationData.name}`);
    res.status(200).json(response);

  } catch (error) {
    console.error('Weather API Error:', error.message);
    const apiError = handleWeatherAPIError(error);
    
    res.status(apiError.status).json({
      status: 'error',
      message: apiError.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Get location suggestions for autocomplete
export const getLocationSuggestions = async (req, res) => {
  try {
    const { query } = req.params;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        status: 'error',
        message: 'Query must be at least 2 characters long'
      });
    }

    const searchResponse = await axios.get(
      `${BASE_URL}/search.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(query)}`
    );

    const suggestions = searchResponse.data.map(location => ({
      id: `${location.lat}_${location.lon}`,
      name: location.name,
      region: location.region,
      country: location.country,
      lat: location.lat,
      lon: location.lon
    }));

    res.status(200).json({
      status: 'success',
      suggestions,
      count: suggestions.length
    });

  } catch (error) {
    console.error('Location search error:', error.message);
    const apiError = handleWeatherAPIError(error);
    
    res.status(apiError.status).json({
      status: 'error',
      message: apiError.message
    });
  }
};

// Get weather history for trend analysis
export const getWeatherHistory = async (req, res) => {
  try {
    const { location, days } = req.params;
    const daysNum = parseInt(days) || 7;
    
    if (daysNum > 30) {
      return res.status(400).json({
        status: 'error',
        message: 'Maximum 30 days of history allowed'
      });
    }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - daysNum);

    const historyResponse = await axios.get(
      `${BASE_URL}/history.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(location)}&dt=${startDate.toISOString().split('T')[0]}&end_dt=${endDate.toISOString().split('T')[0]}`
    );

    const historyData = historyResponse.data;
    
    res.status(200).json({
      status: 'success',
      location: historyData.location,
      forecast: historyData.forecast,
      period: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        days: daysNum
      }
    });

  } catch (error) {
    console.error('Weather history error:', error.message);
    const apiError = handleWeatherAPIError(error);
    
    res.status(apiError.status).json({
      status: 'error',
      message: apiError.message
    });
  }
};