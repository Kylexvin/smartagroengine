/**
 * Smart Greenhouse Physics Engine
 * Advanced agricultural optimization using environmental physics principles
 */

// Optimal growing condition ranges for common greenhouse crops
const OPTIMAL_CONDITIONS = {
  temperature: { min: 18, max: 26, unit: '°C' },
  humidity: { min: 60, max: 75, unit: '%' },
  uvIndex: { min: 3, max: 7, unit: 'UV Index' },
  windSpeed: { max: 15, unit: 'kph' },
  cloudCover: { max: 40, unit: '%' },
  pressure: { min: 1010, max: 1025, unit: 'mb' }
};

// Crop-specific thresholds for different plant types
const CROP_THRESHOLDS = {
  leafy_greens: { temp_max: 24, humidity_max: 70 },
  tomatoes: { temp_max: 28, humidity_max: 65 },
  cucumbers: { temp_max: 30, humidity_max: 80 },
  herbs: { temp_max: 25, humidity_max: 60 }
};

/**
 * Generate comprehensive greenhouse management advice based on physics principles
 */
export const generateAdvice = (weather) => {
  const advice = [];
  const {
    temp_c,
    humidity,
    uv,
    wind_kph,
    cloud,
    precip_mm,
    pressure_mb,
    condition,
    is_day
  } = weather;

  // 1. THERMAL DYNAMICS & HEAT STRESS ANALYSIS
  if (temp_c > 30 && humidity < 40) {
    advice.push({
      category: 'thermal_management',
      priority: 'high',
      title: 'Heat Stress Risk Detected',
      message: `Critical: Temperature ${temp_c}°C with low humidity ${humidity}% creates severe water stress conditions.`,
      actions: [
        'Immediately increase irrigation frequency by 40%',
        'Open all ventilation systems to maximum',
        'Deploy shade cloth (30-50% shade)',
        'Consider evaporative cooling systems'
      ],
      physics: 'High temperature + low humidity increases transpiration rate exponentially (Penman-Monteith equation)'
    });
  } else if (temp_c > 26) {
    advice.push({
      category: 'thermal_management',
      priority: 'medium',
      title: 'Temperature Management Required',
      message: `Temperature ${temp_c}°C exceeds optimal range (18-26°C).`,
      actions: [
        'Increase ventilation by 20%',
        'Monitor plant stress indicators',
        'Adjust irrigation schedule'
      ],
      physics: 'Enzymatic processes slow down above 26°C, affecting photosynthesis efficiency'
    });
  }

  // 2. RADIATION PHYSICS & UV ANALYSIS
  if (uv > 8) {
    advice.push({
      category: 'radiation_protection',
      priority: 'high',
      title: 'UV Radiation Damage Risk',
      message: `Extreme UV index ${uv} can cause photoinhibition and leaf burn.`,
      actions: [
        'Install UV-filtering panels immediately',
        'Deploy 40-60% shade cloth during peak hours (10 AM - 4 PM)',
        'Monitor leaf temperature (should not exceed 35°C)',
        'Increase foliar spray frequency'
      ],
      physics: 'UV-B radiation (280-320nm) damages photosystem II, reducing quantum yield'
    });
  } else if (uv > 6) {
    advice.push({
      category: 'radiation_protection',
      priority: 'medium',
      title: 'Moderate UV Protection Needed',
      message: `UV index ${uv} requires protective measures for sensitive crops.`,
      actions: [
        'Consider light shade cloth (20-30%)',
        'Monitor leaf color changes'
      ],
      physics: 'Optimal UV for plant development is 3-6; above this triggers stress responses'
    });
  }

  // 3. LIGHT AVAILABILITY & PHOTOSYNTHESIS
  if (cloud > 70 && is_day) {
    advice.push({
      category: 'light_management',
      priority: 'medium',
      title: 'Low Light Conditions',
      message: `Cloud cover ${cloud}% significantly reducing photosynthetically active radiation (PAR).`,
      actions: [
        'Activate supplemental LED grow lights (400-700nm spectrum)',
        'Extend photoperiod by 2-4 hours',
        'Reduce nitrogen uptake as photosynthesis is limited',
        'Monitor CO₂ levels (reduce if needed)'
      ],
      physics: 'Light compensation point: minimum 200-400 μmol/m²/s PPFD for positive net photosynthesis'
    });
  }

  // 4. FLUID DYNAMICS & WIND STRESS
  if (wind_kph > 20) {
    advice.push({
      category: 'structural_protection',
      priority: 'high',
      title: 'Wind Damage Prevention',
      message: `Wind speed ${wind_kph} kph exceeds safe threshold for greenhouse structures.`,
      actions: [
        'Secure all loose panels and equipment',
        'Close side vents temporarily',
        'Check structural anchoring systems',
        'Deploy windbreaks if available'
      ],
      physics: 'Wind pressure = 0.613 × V²; speeds >20kph create dangerous pressure loads'
    });
  } else if (wind_kph > 15) {
    advice.push({
      category: 'ventilation_optimization',
      priority: 'medium',
      title: 'Natural Ventilation Opportunity',
      message: `Wind speed ${wind_kph} kph ideal for natural ventilation.`,
      actions: [
        'Optimize vent opening angles (30-45°)',
        'Reduce mechanical ventilation by 30%'
      ],
      physics: 'Bernoulli principle: higher wind speeds create lower pressure, enhancing natural airflow'
    });
  }

  // 5. HUMIDITY & VAPOR PRESSURE DEFICIT (VPD)
  const vpd = calculateVPD(temp_c, humidity);
  if (humidity > 85) {
    advice.push({
      category: 'disease_prevention',
      priority: 'high',
      title: 'Fungal Disease Risk',
      message: `Humidity ${humidity}% creates ideal conditions for pathogen development.`,
      actions: [
        'Increase air circulation immediately',
        'Reduce watering frequency by 25%',
        'Apply preventive fungicide spray',
        'Install dehumidification systems'
      ],
      physics: `VPD: ${vpd.toFixed(2)} kPa - Low VPD (<0.8) reduces transpiration, promoting fungal growth`
    });
  } else if (humidity < 40) {
    advice.push({
      category: 'humidity_management',
      priority: 'medium',
      title: 'Low Humidity Stress',
      message: `Humidity ${humidity}% may cause excessive transpiration.`,
      actions: [
        'Install misting systems',
        'Increase irrigation frequency',
        'Reduce ventilation during hot periods'
      ],
      physics: `High VPD: ${vpd.toFixed(2)} kPa - Excessive water loss through stomata`
    });
  }

  // 6. PRECIPITATION & WATER MANAGEMENT
  if (precip_mm > 10) {
    advice.push({
      category: 'water_management',
      priority: 'medium',
      title: 'Excess Water Management',
      message: `Heavy rainfall ${precip_mm}mm detected - waterlogging risk.`,
      actions: [
        'Suspend irrigation for 24-48 hours',
        'Improve drainage systems',
        'Monitor root zone oxygen levels',
        'Check for water pooling around structures'
      ],
      physics: 'Waterlogged soil reduces oxygen availability, affecting root respiration and nutrient uptake'
    });
  }

  // 7. ATMOSPHERIC PRESSURE EFFECTS
  if (pressure_mb < 1010) {
    advice.push({
      category: 'atmospheric_monitoring',
      priority: 'low',
      title: 'Low Pressure System',
      message: `Atmospheric pressure ${pressure_mb}mb indicates weather system changes.`,
      actions: [
        'Monitor weather forecasts closely',
        'Prepare for potential temperature/humidity fluctuations'
      ],
      physics: 'Low pressure systems often bring unstable weather, affecting plant stress levels'
    });
  }

  // 8. INTEGRATED STRESS ANALYSIS
  const stressScore = calculatePlantStressScore(weather);
  if (stressScore > 7) {
    advice.push({
      category: 'emergency_response',
      priority: 'critical',
      title: 'Multiple Stress Factors Detected',
      message: `Plant stress score: ${stressScore}/10 - Immediate intervention required.`,
      actions: [
        'Implement emergency protocols',
        'Monitor plants hourly',
        'Document all interventions',
        'Consider crop protection insurance claims'
      ],
      physics: 'Cumulative stress factors have exponential, not additive effects on plant physiology'
    });
  }

  return advice.length > 0 ? advice : [{
    category: 'optimal_conditions',
    priority: 'low',
    title: 'Excellent Growing Conditions',
    message: 'Current weather conditions are optimal for greenhouse operations.',
    actions: ['Continue current management practices', 'Monitor for any changes'],
    physics: 'All environmental parameters within optimal ranges for photosynthesis and plant development'
  }];
};

/**
 * Calculate Vapor Pressure Deficit (VPD) - critical for plant transpiration
 */
const calculateVPD = (temp_c, humidity) => {
  const saturatedVP = 0.6108 * Math.exp((17.27 * temp_c) / (temp_c + 237.3));
  const actualVP = saturatedVP * (humidity / 100);
  return saturatedVP - actualVP;
};

/**
 * Calculate overall plant stress score (0-10 scale)
 */
const calculatePlantStressScore = (weather) => {
  let stress = 0;
  const { temp_c, humidity, uv, wind_kph, cloud } = weather;

  // Temperature stress
  if (temp_c > 30) stress += 3;
  else if (temp_c > 26 || temp_c < 15) stress += 1;

  // Humidity stress
  if (humidity > 85 || humidity < 40) stress += 2;

  // UV stress
  if (uv > 8) stress += 2;
  else if (uv > 6) stress += 1;

  // Wind stress
  if (wind_kph > 20) stress += 2;

  // Light stress
  if (cloud > 80) stress += 1;

  return Math.min(stress, 10);
};

/**
 * Calculate optimal greenhouse conditions based on current weather
 */
export const calculateOptimalConditions = (weather) => {
  const { temp_c, humidity, cloud } = weather;
  
  return {
    targetTemperature: {
      day: Math.max(20, Math.min(26, temp_c - 2)),
      night: Math.max(16, Math.min(22, temp_c - 4)),
      unit: '°C'
    },
    targetHumidity: {
      range: humidity > 75 ? '60-70%' : humidity < 50 ? '65-75%' : '60-75%',
      current: `${humidity}%`
    },
    lightingRecommendation: {
      artificial: cloud > 60 ? 'Required' : 'Optional',
      duration: cloud > 70 ? '14-16 hours' : '12-14 hours',
      intensity: '400-600 μmol/m²/s PPFD'
    },
    ventilationSettings: {
      level: temp_c > 25 ? 'High' : temp_c > 20 ? 'Medium' : 'Low',
      airChanges: temp_c > 25 ? '60-80/hour' : '30-40/hour'
    }
  };
};

/**
 * Assess crop-specific risk factors
 */
export const assessCropRisk = (weather) => {
  const { temp_c, humidity, uv, wind_kph } = weather;
  
  const risks = [];
  
  // Disease risk assessment
  if (humidity > 80 && temp_c > 20 && temp_c < 30) {
    risks.push({
      type: 'disease',
      level: 'high',
      description: 'Ideal conditions for fungal diseases (Botrytis, Powdery Mildew)',
      prevention: 'Increase air circulation, reduce leaf wetness duration'
    });
  }
  
  // Heat stress risk
  if (temp_c > 28) {
    risks.push({
      type: 'heat_stress',
      level: temp_c > 32 ? 'critical' : 'high',
      description: 'Excessive temperature affecting photosynthesis and fruit set',
      prevention: 'Cooling systems, shade cloth, increased ventilation'
    });
  }
  
  // Pollination risk
  if (humidity < 50 || humidity > 80 || temp_c > 30) {
    risks.push({
      type: 'pollination',
      level: 'medium',
      description: 'Conditions may affect pollen viability and transfer',
      prevention: 'Manual pollination assistance, optimize humidity levels'
    });
  }

  return {
    totalRisks: risks.length,
    riskLevel: risks.some(r => r.level === 'critical') ? 'critical' : 
              risks.some(r => r.level === 'high') ? 'high' : 'medium',
    risks
  };
};