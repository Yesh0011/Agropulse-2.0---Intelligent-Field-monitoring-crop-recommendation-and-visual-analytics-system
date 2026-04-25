import express from "express";
import axios from "axios";

const router = express.Router();

// Hugging Face API configuration (free tier)
const HF_API_URL = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium";
const HF_API_KEY = process.env.HF_API_KEY || "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"; // Replace with your key

// System prompt for agricultural analytics
const SYSTEM_PROMPT = `You are an intelligent agricultural analytics assistant for AgroPulse. You provide advanced explanations that connect sensor readings to crop health, irrigation decisions, and dashboard visualizations.

Focus on:
1. Interpreting soil moisture, temperature, humidity, and pH readings in crop management.
2. Explaining anomalies and what abnormal values indicate.
3. Using charts like the anomaly scatter chart, forecast chart, correlation heatmap, cluster scatter plot, hourly patterns, and seasonal trend graphs.
4. Translating analytics into actionable recommendations for irrigation, planting, and risk mitigation.

Always be accurate, concise, and refer to dashboard visuals when relevant. Use the provided context to make answers specific and practical.`;
// ======================
// CHATBOT ENDPOINT (LOCAL AI)
// ======================
router.post("/chat", async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    // Generate intelligent response based on message content
    const response = await generateIntelligentResponse(message, context);

    res.json({
      success: true,
      response: response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Chatbot error:", error.message);

    // Fallback to basic responses
    const fallbackResponse = generateFallbackResponse(req.body.message, req.body.context);

    res.json({
      success: true,
      response: fallbackResponse,
      timestamp: new Date().toISOString(),
      fallback: true
    });
  }
});

// ======================
// ANALYTICS CONTEXT HELPER
// ======================
router.get("/context", async (req, res) => {
  try {
    // Get recent analytics summary for context
    const summary = {
      capabilities: [
        "Real-time sensor monitoring (soil moisture, temperature, humidity, pH)",
        "Anomaly detection for unusual patterns",
        "Clustering analysis for crop grouping",
        "Time series forecasting",
        "Correlation analysis between environmental factors",
        "Seasonal pattern recognition",
        "Decision support for irrigation and planting"
      ],
      data_types: ["soilMoisture", "temperature", "humidity", "ph"],
      time_ranges: ["hourly", "daily", "weekly", "seasonal"],
      insights: [
        "Optimal soil moisture: 40-60%",
        "Temperature range: 20-30°C for most crops",
        "pH levels: 6.0-7.0 for balanced nutrient uptake",
        "Humidity monitoring helps prevent fungal diseases"
      ]
    };

    res.json({
      success: true,
      context: summary
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get context"
    });
  }
});

// ======================
// INTELLIGENT RESPONSE GENERATOR
// ======================
async function generateIntelligentResponse(message, context) {
  const lowerMessage = message.toLowerCase();

  // Parse context if available
  let analyticsContext = {};
  try {
    if (context && typeof context === 'string') {
      analyticsContext = JSON.parse(context.replace('Current analytics context: ', ''));
    }
  } catch (e) {
    console.log('Could not parse context:', e.message);
  }

  const currentReadings = analyticsContext.currentReadings;
  const averages = analyticsContext.averages;

  // Handle specific current value queries
  if (lowerMessage.includes('current temperature') || lowerMessage.includes('what is the temperature')) {
    if (currentReadings?.temperature != null) {
      const temp = currentReadings.temperature;
      const status = temp >= 20 && temp <= 30 ? "optimal" : temp > 30 ? "high" : "low";
      return `The current temperature is ${temp}°C, which is ${status} for most crops. Temperature affects plant metabolism and water needs - values between 20-30°C support healthy growth.`;
    }
    return "I don't have access to the current temperature reading right now. Please check the live status section of your dashboard.";
  }

  if (lowerMessage.includes('current moisture') || lowerMessage.includes('what is the moisture')) {
    if (currentReadings?.moisture != null) {
      const moisture = currentReadings.moisture;
      const status = moisture >= 40 && moisture <= 60 ? "optimal" : moisture < 40 ? "low (may need irrigation)" : "high (risk of root stress)";
      return `The current soil moisture is ${moisture}%, which is ${status}. Optimal moisture for most crops is 40-60%.`;
    }
    return "I don't have access to the current moisture reading right now. Please check the live status section of your dashboard.";
  }

  if (lowerMessage.includes('current humidity') || lowerMessage.includes('what is the humidity')) {
    if (currentReadings?.humidity != null) {
      const humidity = currentReadings.humidity;
      const status = humidity >= 40 && humidity <= 70 ? "optimal" : humidity > 70 ? "high (increased disease risk)" : "low (may stress plants)";
      return `The current humidity is ${humidity}%, which is ${status}. Humidity affects plant transpiration and disease pressure.`;
    }
    return "I don't have access to the current humidity reading right now. Please check the live status section of your dashboard.";
  }

  if (lowerMessage.includes('current ph') || lowerMessage.includes('what is the ph')) {
    if (currentReadings?.ph != null) {
      const ph = currentReadings.ph;
      const status = ph >= 6.0 && ph <= 7.0 ? "optimal" : ph < 6.0 ? "acidic" : "alkaline";
      return `The current soil pH is ${ph}, which is ${status}. Most crops prefer pH between 6.0-7.0 for good nutrient uptake.`;
    }
    return "I don't have access to the current pH reading right now. Please check the live status section of your dashboard.";
  }

  // Handle seasonal trend queries
  if (lowerMessage.includes('seasonal trend') || lowerMessage.includes('seasonal pattern')) {
    return "The seasonal trend chart shows how temperature, moisture, and humidity change over time in your field. This helps identify recurring patterns throughout the growing season. For example, you might see temperature peaks during midday, moisture fluctuations with irrigation cycles, or humidity changes with weather patterns. Use this chart to understand long-term environmental cycles and plan your crop management accordingly.";
  }

  // Handle chart/graph queries more specifically
  if (lowerMessage.includes('what is') && (lowerMessage.includes('chart') || lowerMessage.includes('graph'))) {
    if (lowerMessage.includes('seasonal')) {
      return "The seasonal trend chart displays time-based patterns of your sensor data. It shows how temperature, soil moisture, and humidity vary over the course of your monitoring period, helping you identify seasonal cycles and long-term trends.";
    }
    if (lowerMessage.includes('hourly')) {
      return "The hourly pattern chart shows sensor readings grouped by hour of the day. This reveals daily cycles like temperature peaks during midday or moisture changes after irrigation.";
    }
    if (lowerMessage.includes('forecast')) {
      return "The forecast chart predicts future sensor values based on historical patterns. It helps you anticipate upcoming conditions and plan irrigation or crop protection measures.";
    }
    if (lowerMessage.includes('anomaly') || lowerMessage.includes('scatter')) {
      return "The anomaly scatter chart highlights unusual sensor readings that deviate from normal patterns. These outliers might indicate equipment issues, environmental changes, or areas needing attention.";
    }
    if (lowerMessage.includes('correlation') || lowerMessage.includes('heatmap')) {
      return "The correlation heatmap shows relationships between different environmental factors. Strong correlations (close to 1.0 or -1.0) indicate factors that influence each other significantly.";
    }
  }

  try {
    // Prepare the conversation with system prompt and user message
    const enhancedPrompt = `${SYSTEM_PROMPT}\n\nCurrent sensor readings: ${currentReadings ? `Temperature: ${currentReadings.temperature}°C, Humidity: ${currentReadings.humidity}%, Moisture: ${currentReadings.moisture}%, pH: ${currentReadings.ph}` : 'Not available'}\n\nUser question: ${message}\n\nAssistant:`;

    console.log('Calling Hugging Face API with prompt:', enhancedPrompt.substring(0, 200) + '...');

    // Call Hugging Face API
    const response = await axios.post(
      HF_API_URL,
      {
        inputs: enhancedPrompt,
        parameters: {
          max_new_tokens: 150,
          temperature: 0.7,
          do_sample: true,
          return_full_text: false,
          top_p: 0.9
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      }
    );

    console.log('Hugging Face API response received');

    // Extract the generated response
    const generatedText = response.data[0]?.generated_text || "I'm sorry, I couldn't generate a response right now.";

    // Clean up the response (remove any unwanted prefixes)
    let cleanResponse = generatedText.trim();

    // If the response includes the prompt, remove it
    if (cleanResponse.startsWith("Assistant:")) {
      cleanResponse = cleanResponse.replace("Assistant:", "").trim();
    }

    // Remove any remaining prompt artifacts
    cleanResponse = cleanResponse.replace(/^User question:.*$/gm, '').trim();
    cleanResponse = cleanResponse.replace(/^Assistant:/gm, '').trim();

    if (cleanResponse.length > 0) {
      console.log('Returning AI response:', cleanResponse.substring(0, 100) + '...');
      return cleanResponse;
    } else {
      console.log('AI response was empty, using fallback');
      return generateFallbackResponse(message, context);
    }

  } catch (error) {
    console.error("Hugging Face API error:", error.message);
    console.error("Error details:", error.response?.data || error.code);
    // Fallback to basic responses if API fails
    return generateFallbackResponse(message, context);
  }
}

// ======================
// FALLBACK RESPONSE GENERATOR
// ======================
function generateFallbackResponse(message, context) {
  const lowerMessage = message.toLowerCase();

  // Parse context for current readings
  let analyticsContext = {};
  try {
    if (context && typeof context === 'string') {
      analyticsContext = JSON.parse(context.replace('Current analytics context: ', ''));
    }
  } catch (e) {
    console.log('Could not parse context:', e.message);
  }

  const currentReadings = analyticsContext.currentReadings;

  // Handle specific current value queries in fallback
  if (lowerMessage.includes('current temperature') || lowerMessage.includes('what is the temperature')) {
    if (currentReadings?.temperature != null) {
      const temp = currentReadings.temperature;
      const status = temp >= 20 && temp <= 30 ? "optimal" : temp > 30 ? "high" : "low";
      return `The current temperature is ${temp}°C, which is ${status} for most crops.`;
    }
  }

  if (lowerMessage.includes('current moisture') || lowerMessage.includes('what is the moisture')) {
    if (currentReadings?.moisture != null) {
      const moisture = currentReadings.moisture;
      const status = moisture >= 40 && moisture <= 60 ? "optimal" : moisture < 40 ? "low" : "high";
      return `The current soil moisture is ${moisture}%, which is ${status}.`;
    }
  }

  if (lowerMessage.includes('current humidity') || lowerMessage.includes('what is the humidity')) {
    if (currentReadings?.humidity != null) {
      const humidity = currentReadings.humidity;
      const status = humidity >= 40 && humidity <= 70 ? "optimal" : humidity > 70 ? "high" : "low";
      return `The current humidity is ${humidity}%, which is ${status}.`;
    }
  }

  if (lowerMessage.includes('current ph') || lowerMessage.includes('what is the ph')) {
    if (currentReadings?.ph != null) {
      const ph = currentReadings.ph;
      const status = ph >= 6.0 && ph <= 7.0 ? "optimal" : ph < 6.0 ? "acidic" : "alkaline";
      return `The current soil pH is ${ph}, which is ${status}.`;
    }
  }

  // Pattern matching for common queries
  if (lowerMessage.includes('moisture') || lowerMessage.includes('soil')) {
    return "Soil moisture is crucial for plant health. Optimal levels are typically 40-60%. The dashboard shows real-time moisture readings and trends. Low moisture usually means irrigation is needed, while consistently high levels may indicate drainage problems.";
  }

  if (lowerMessage.includes('temperature')) {
    return "Temperature affects crop growth and stress. Most crops thrive between 20-30°C. Use the dashboard temperature chart to monitor heat or cold risk and to time irrigation or protection measures accordingly.";
  }

  if (lowerMessage.includes('anomaly') || lowerMessage.includes('unusual')) {
    return "Anomalies highlight sensor readings that differ from normal patterns. The anomaly scatter chart helps you see these outliers so you can investigate whether the issue is environmental or technical.";
  }

  if (lowerMessage.includes('forecast') || lowerMessage.includes('predict')) {
    return "Forecasting uses historical sensor data to predict upcoming conditions. The forecast chart helps you plan irrigation and crop management before stress occurs.";
  }

  if (lowerMessage.includes('correlation') || lowerMessage.includes('relationship')) {
    return "Correlation analysis reveals how environmental factors move together. A strong relationship between temperature and humidity can affect disease risk and water demand.";
  }

  if (lowerMessage.includes('cluster') || lowerMessage.includes('group')) {
    return "Clustering groups similar sensor conditions together. In agriculture, this can reveal field zones that need different irrigation or crop management strategies.";
  }

  if (lowerMessage.includes('seasonal trend') || lowerMessage.includes('seasonal pattern')) {
    return "The seasonal trend chart shows how temperature, moisture, and humidity change over time in your field. This helps identify recurring patterns throughout the growing season. For example, you might see temperature peaks during midday, moisture fluctuations with irrigation cycles, or humidity changes with weather patterns. Use this chart to understand long-term environmental cycles and plan your crop management accordingly.";
  }

  if (lowerMessage.includes('dashboard') || lowerMessage.includes('chart') || lowerMessage.includes('graph')) {
    return "The dashboard includes live sensor values, forecast charts, anomaly plots, correlation heatmaps, cluster analytics, and seasonal trend charts. Ask about a specific chart for a guided interpretation.";
  }

  if (lowerMessage.includes('help') || lowerMessage.includes('guide')) {
    return "I can help you explore the AgroPulse dashboard, interpret sensor readings, and explain analytics. Ask about specific metrics, charts, anomalies, or optimal conditions.";
  }

  // Default response
  return "I'm here to help you understand your agricultural sensor data and dashboard analytics. Ask about soil moisture, temperature, humidity, pH, anomalies, forecasts, correlations, or chart interpretations for a useful answer.";
}

export default router;