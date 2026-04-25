import { useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  IconButton,
  Collapse,
  Fab
} from "@mui/material";
import {
  Chat as ChatIcon,
  Send as SendIcon,
  Close as CloseIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from "@mui/icons-material";
import API from "../api/axios.js";

const Chatbot = ({ analyticsData, summaryData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AgroPulse Analytics Assistant. I can help you understand your sensor data, explain trends, and guide you through the dashboard. What would you like to know?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Prepare context from analytics and summary data
      let context = "";
      if (analyticsData || summaryData) {
        const contextData = {
          hasData: !!(analyticsData || summaryData),
          dataPoints: analyticsData?.forecast?.length || 0,
          anomalies: analyticsData?.anomalies?.length || 0,
          clusters: analyticsData?.clusters?.length || 0,
          correlations: analyticsData?.correlations ? "Available" : "Not available",
          currentReadings: summaryData?.latest ? {
            temperature: summaryData.latest.temperature,
            humidity: summaryData.latest.humidity,
            moisture: summaryData.latest.moisture,
            ph: summaryData.latest.ph,
            timestamp: summaryData.latest.timestamp
          } : null,
          averages: summaryData?.averages ? {
            temperature: summaryData.averages.temperature,
            humidity: summaryData.averages.humidity,
            moisture: summaryData.averages.moisture,
            ph: summaryData.averages.ph
          } : null
        };
        context = `Current analytics context: ${JSON.stringify(contextData)}`;
      }

      const response = await API.post("/chatbot/chat", {
        message: inputMessage,
        context: context
      });

      const botMessage = {
        id: messages.length + 2,
        text: response.data.response,
        sender: "bot",
        timestamp: new Date(),
        fallback: response.data.fallback
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage = {
        id: messages.length + 2,
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
        error: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "What do the sensor readings mean?",
    "Explain the anomalies I see",
    "How does temperature affect crops?",
    "What are the optimal conditions?",
    "Guide me through the dashboard"
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <Fab
        color="primary"
        aria-label="chat"
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 1000
        }}
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </Fab>

      {/* Chatbot Panel */}
      <Collapse in={isOpen} orientation="up">
        <Paper
          elevation={8}
          sx={{
            position: "fixed",
            bottom: 80,
            right: 16,
            width: 400,
            height: 600,
            display: "flex",
            flexDirection: "column",
            zIndex: 1000,
            borderRadius: 2
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              bgcolor: "primary.main",
              color: "white",
              borderRadius: "8px 8px 0 0",
              display: "flex",
              alignItems: "center",
              gap: 1
            }}
          >
            <BotIcon />
            <Typography variant="h6">AgroPulse Assistant</Typography>
            <IconButton
              size="small"
              onClick={() => setIsOpen(false)}
              sx={{ color: "white", ml: "auto" }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </Box>

          {/* Messages */}
          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              p: 2,
              bgcolor: "#f5f5f5"
            }}
          >
            <List>
              {messages.map((message) => (
                <ListItem key={message.id} sx={{ alignItems: "flex-start", px: 0 }}>
                  <ListItemAvatar sx={{ minWidth: 40 }}>
                    <Avatar sx={{ bgcolor: message.sender === "bot" ? "primary.main" : "secondary.main" }}>
                      {message.sender === "bot" ? <BotIcon /> : <PersonIcon />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="body1">{message.text}</Typography>
                        {message.fallback && (
                          <Chip label="Offline" size="small" color="warning" />
                        )}
                        {message.error && (
                          <Chip label="Error" size="small" color="error" />
                        )}
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {message.timestamp.toLocaleTimeString()}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
              {isLoading && (
                <ListItem sx={{ alignItems: "flex-start", px: 0 }}>
                  <ListItemAvatar sx={{ minWidth: 40 }}>
                    <Avatar sx={{ bgcolor: "primary.main" }}>
                      <BotIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontStyle: "italic", color: "text.secondary" }}>
                        Thinking...
                      </Typography>
                    }
                  />
                </ListItem>
              )}
            </List>
            <div ref={messagesEndRef} />
          </Box>

          {/* Quick Questions */}
          <Box sx={{ p: 1, borderTop: 1, borderColor: "divider" }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
              Quick questions:
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {quickQuestions.map((question, index) => (
                <Chip
                  key={index}
                  label={question}
                  size="small"
                  variant="outlined"
                  onClick={() => handleQuickQuestion(question)}
                  sx={{ fontSize: "0.7rem" }}
                />
              ))}
            </Box>
          </Box>

          {/* Input */}
          <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Ask me about your analytics..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              <Button
                variant="contained"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                sx={{ minWidth: 40 }}
              >
                <SendIcon />
              </Button>
            </Box>
          </Box>
        </Paper>
      </Collapse>
    </>
  );
};

export default Chatbot;