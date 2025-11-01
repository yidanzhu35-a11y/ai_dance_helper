/**
 * Voice Interaction Module for Dance Video Playback App
 * Implements continuous listening, wake word detection, ASR, and command processing
 */

// Command mapping from recognized text to video actions
const commandMap = {
  "播放": "play",
  "暂停": "pause",
  "回到开头": "restart",
  "快一点": "speedUp",
  "慢一点": "slowDown"
};

// Video control functions (will be passed in from the main app)
let videoControls = {};

// State variables
let isListening = false;
let recognition = null;
let mediaRecorder = null;
let audioChunks = [];
let silenceTimer = null;
let wakeWordDetected = false;

/**
 * Initialize the voice interaction system
 * @param {Object} controls - Video control functions from the main app
 */
export function initializeVoiceInteraction(controls) {
  videoControls = controls;
  
  // Check if Web Speech API is available
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    console.warn('Web Speech API is not supported in this browser');
    return false;
  }
  
  return true;
}

/**
 * Start the voice interaction system
 */
export function startVoiceInteraction() {
  if (isListening) return;
  
  isListening = true;
  wakeWordDetected = false;
  
  // Initialize Web Speech API recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'zh-CN';
  
  recognition.onresult = handleSpeechResult;
  recognition.onerror = handleSpeechError;
  recognition.onend = () => {
    if (isListening) {
      recognition.start(); // Restart recognition if still listening
    }
  };
  
  try {
    recognition.start();
    console.log('🎙️ Voice interaction started - Listening for wake word "小舞小舞"');
  } catch (error) {
    console.error('Error starting voice recognition:', error);
    isListening = false;
  }
}

/**
 * Stop the voice interaction system
 */
export function stopVoiceInteraction() {
  isListening = false;
  wakeWordDetected = false;
  
  if (recognition) {
    recognition.stop();
    recognition = null;
  }
  
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
  
  if (silenceTimer) {
    clearTimeout(silenceTimer);
    silenceTimer = null;
  }
  
  console.log('🔇 Voice interaction stopped');
}

/**
 * Handle speech recognition results
 * @param {Event} event - Speech recognition event
 */
function handleSpeechResult(event) {
  for (let i = event.resultIndex; i < event.results.length; i++) {
    const result = event.results[i];
    const transcript = result[0].transcript.trim();
    
    if (result.isFinal) {
      console.log(`🗣️ Recognized speech: "${transcript}"`);
      
      if (!wakeWordDetected) {
        // Check for wake word
        if (transcript.includes('小舞小舞')) {
          console.log('🎯 Wake word detected!');
          wakeWordDetected = true;
          
          // Start recording next speech for ASR
          startASRRecording();
        }
      } else {
        // Process command after wake word
        processCommand(transcript);
        wakeWordDetected = false;
      }
    } else {
      // Handle interim results for wake word detection
      if (transcript.includes('小舞小舞')) {
        console.log('🎯 Wake word detected (interim)!');
        wakeWordDetected = true;
      }
    }
  }
}

/**
 * Handle speech recognition errors
 * @param {Event} event - Speech recognition error event
 */
function handleSpeechError(event) {
  console.error('Speech recognition error:', event.error);
  if (isListening) {
    // Try to restart recognition
    setTimeout(() => {
      if (isListening && recognition) {
        recognition.start();
      }
    }, 1000);
  }
}

/**
 * Start recording audio for ASR processing
 */
function startASRRecording() {
  console.log('✨ Recording speech for ASR...');
  
  // Reset audio chunks
  audioChunks = [];
  
  // Get microphone access
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      // Create media recorder
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        // Send recorded audio to ASR service
        sendToASRService();
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Start recording
      mediaRecorder.start();
      
      // Stop recording after 5 seconds
      silenceTimer = setTimeout(() => {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
        }
      }, 5000);
    })
    .catch(error => {
      console.error('Error accessing microphone:', error);
    });
}

/**
 * Send recorded audio to ASR service
 */
async function sendToASRService() {
  if (audioChunks.length === 0) return;
  
  console.log('📡 Sending audio to ASR service...');
  
  try {
    // Combine audio chunks
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    
    // In a real implementation, you would send this to your ASR service
    // For now, we'll simulate the ASR response
    // const formData = new FormData();
    // formData.append('audio', audioBlob);
    
    // Example fetch call to ASRT service:
    /*
    const response = await fetch('http://localhost:8000/asr', {
      method: 'POST',
      body: formData
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('ASR Result:', result);
      processCommand(result.text);
    } else {
      console.error('ASR service error:', response.status);
    }
    */
    
    // Simulate ASR result for demo purposes
    setTimeout(() => {
      // This is just for demonstration - in reality, the ASR service would provide the text
      const simulatedCommands = ["播放", "暂停", "回到开头", "快一点", "慢一点"];
      const randomCommand = simulatedCommands[Math.floor(Math.random() * simulatedCommands.length)];
      console.log(`🤖 Simulated ASR result: "${randomCommand}"`);
      processCommand(randomCommand);
    }, 1000);
    
  } catch (error) {
    console.error('Error sending audio to ASR service:', error);
  }
}

/**
 * Process recognized command
 * @param {string} text - Recognized text from ASR
 */
function processCommand(text) {
  console.log(`📝 Processing command: "${text}"`);
  
  // Exact match
  if (commandMap[text]) {
    executeCommand(commandMap[text]);
    return;
  }
  
  // Fuzzy match using simple string similarity (Levenshtein distance)
  const bestMatch = findBestMatch(text, Object.keys(commandMap));
  if (bestMatch.similarity > 0.6) { // Threshold for fuzzy matching
    console.log(`🔄 Fuzzy match found: "${bestMatch.command}" (similarity: ${bestMatch.similarity.toFixed(2)})`);
    executeCommand(commandMap[bestMatch.command]);
    return;
  }
  
  // Silent fail - no match found
  console.log('❌ No matching command found - silent fail');
}

/**
 * Find the best matching command using string similarity
 * @param {string} input - Input text to match
 * @param {string[]} commands - List of possible commands
 * @returns {Object} Best match with similarity score
 */
function findBestMatch(input, commands) {
  let bestMatch = { command: null, similarity: 0 };
  
  for (const command of commands) {
    const similarity = calculateSimilarity(input, command);
    if (similarity > bestMatch.similarity) {
      bestMatch = { command, similarity };
    }
  }
  
  return bestMatch;
}

/**
 * Calculate string similarity using a simple approach
 * @param {string} s1 - First string
 * @param {string} s2 - Second string
 * @returns {number} Similarity score between 0 and 1
 */
function calculateSimilarity(s1, s2) {
  // Simple character-level similarity
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

/**
 * Calculate Levenshtein distance between two strings
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {number} Edit distance
 */
function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  
  const matrix = [];
  
  // Initialize matrix
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  // Fill matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}

/**
 * Execute the specified video command
 * @param {string} command - Command to execute
 */
function executeCommand(command) {
  console.log(`✅ Executing command: ${command}`);
  
  switch (command) {
    case 'play':
      if (videoControls.play) videoControls.play();
      break;
    case 'pause':
      if (videoControls.pause) videoControls.pause();
      break;
    case 'restart':
      if (videoControls.restart) videoControls.restart();
      break;
    case 'speedUp':
      if (videoControls.speedUp) videoControls.speedUp();
      break;
    case 'slowDown':
      if (videoControls.slowDown) videoControls.slowDown();
      break;
    default:
      console.warn(`Unknown command: ${command}`);
  }
}