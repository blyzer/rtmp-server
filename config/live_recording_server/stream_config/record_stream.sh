#!/bin/bash

# Function to generate ISO-8601 timestamp
generate_timestamp() {
    date -u +"%Y%m%dT%H%M%S"
}

# Main recording loop
while true; do
    # Calculate start and end timestamps
    START_TIMESTAMP=$(generate_timestamp)
    END_TIMESTAMP=$(date -u -d "+${INTERVAL_MINUTES} minutes" +"%Y%m%dT%H%M%S")
    FILENAME_1="recording_${STREAM_ID}_${START_TIMESTAMP}_${END_TIMESTAMP}_A.mp4"
    FILENAME_2="recording_${STREAM_ID}_${START_TIMESTAMP}_${END_TIMESTAMP}_B.mp4"
    FILE_PATH_1="${RECORDING_DIR}/${FILENAME_1}"
    FILE_PATH_2="${RECORDING_DIR}/${FILENAME_2}"

    echo "STREAM_URL_B: $STREAM_URL_B"
    echo "STREAM_URL_A: $STREAM_URL_A"
    echo "RECORDING_DIR: $RECORDING_DIR"
    echo "INTERVAL_MINUTES: $INTERVAL_MINUTES"
    
    ffmpeg -codecs | grep libx264 > /dev/null 2>&1
    ffmpeg -codecs | grep aac > /dev/null 2>&1  # redirect to /dev/null to discard

    echo "confirm codecs"

    # Record the stream for the interval duration
    echo "Starting recording: ${FILENAME}"

    ffmpeg -y \
    -i "${STREAM_URL_B}/live" -c:v libx264 -preset ultrafast -c:a aac -strict experimental -t $((INTERVAL_MINUTES * 60)) "${FILE_PATH_2}" \
    -i "${STREAM_URL_A}/live/stream_key_2a" -c:v libx264 -preset ultrafast -c:a aac -strict experimental -t $((INTERVAL_MINUTES * 60)) "${FILE_PATH_1}"

    echo "Finished recording stream from ${STREAM_URL_B} to ${STREAM_URL_B}"
done