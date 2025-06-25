import express from 'express';
import { getWeatherAdvice, getLocationSuggestions, getWeatherHistory } from '../controllers/weatherController.js';

const router = express.Router();

// Get current weather and greenhouse advice for specific location
router.get('/:location', getWeatherAdvice);

// Get location suggestions (for autocomplete)
router.get('/search/:query', getLocationSuggestions);

// Get weather history and trends (bonus feature)
router.get('/history/:location/:days', getWeatherHistory);

export default router;