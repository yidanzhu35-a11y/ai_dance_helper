# Voice Interaction Feature

This document explains how to set up and use the voice interaction feature in the Dance Video Playback App.

## Overview

The voice interaction feature allows users to control video playback using voice commands in Chinese. The system works through the following pipeline:

1. Continuous listening for a wake word ("小舞小舞")
2. Wake word detection triggers ASR (Automatic Speech Recognition)
3. Recognized speech is processed into video commands
4. Commands are executed to control video playback

## Setup

### Prerequisites

- Modern web browser with Web Speech API support (Chrome recommended)
- Microphone access

### ASR Service

The system is designed to work with the ASRT (ASR Toolkit) service:
- GitHub: https://github.com/nl8590687/ASRT_SpeechRecognition
- The service should be running at `http://localhost:8000/asr`

To set up the ASRT service:
1. Clone the repository: `git clone https://github.com/nl8590687/ASRT_SpeechRecognition.git`
2. Install dependencies: `pip install -r requirements.txt`
3. Start the HTTP server: `python asrserver_http.py`

## Supported Voice Commands

The following Chinese voice commands are supported:

| Command | Action |
|---------|--------|
| 播放 | Play video |
| 暂停 | Pause video |
| 回到开头 | Restart video from beginning |
| 快一点 | Increase playback speed |
| 慢一点 | Decrease playback speed |

The system also supports fuzzy matching for similar phrases.

## Integration with Video Controls

The voice interaction system integrates with the existing video control functions:
- Play/Pause
- Restart
- Speed control (cycle through 0.7x, 0.8x, 0.9x, 1.0x, 1.1x, 1.2x)

## Files

- `src/voiceInteraction.js` - Main voice interaction logic
- `src/components/VoiceInteractionButton.tsx` - UI toggle button
- `src/components/BottomControls.tsx` - Updated to include voice button

## Implementation Details

### Voice Interaction Pipeline

1. **Continuous Listening**: Uses Web Speech API for continuous speech recognition
2. **Wake Word Detection**: Listens for "小舞小舞" to activate command processing
3. **ASR Processing**: Records speech after wake word and sends to ASR service
4. **Command Processing**: Matches recognized text to commands with exact and fuzzy matching
5. **Action Execution**: Executes corresponding video control functions

### Technical Components

- Web Speech API for initial speech recognition
- MediaRecorder API for audio capture
- Levenshtein distance algorithm for fuzzy matching
- Fetch API for ASR service communication

## Usage

1. Click the microphone button in the bottom controls to activate voice control
2. Grant microphone permission when prompted
3. Say "小舞小舞" followed by a command (e.g., "小舞小舞 播放")
4. The system will process the command and control the video accordingly

## Customization

To add new commands:
1. Update the `commandMap` in `voiceInteraction.js`
2. Add new functions to the `videoControls` object in `App.tsx`

To modify the wake word:
1. Update the wake word detection logic in `handleSpeechResult` function