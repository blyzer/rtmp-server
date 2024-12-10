FROM jrottenberg/ffmpeg:4.4-ubuntu

# Set the working directory
WORKDIR /stream_config

# Install necessary tools (if additional packages are needed)
RUN apt-get update && apt-get install -y \
    curl \
    git && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Accept build-time argument
ARG SERVER_IP_LIVE_STREAMING_SERVER_B
ARG LIVE_PORT_EXPOSE_B
ARG SERVER_IP_LIVE_STREAMING_SERVER_A
ARG LIVE_PORT_EXPOSE_A

# Set it as an environment variable for the container
ENV SERVER_IP_LIVE_STREAMING_SERVER_B=${SERVER_IP_LIVE_STREAMING_SERVER_B}
ENV LIVE_PORT_EXPOSE_B=${LIVE_PORT_EXPOSE_B}
ENV SERVER_IP_LIVE_STREAMING_SERVER_A=${SERVER_IP_LIVE_STREAMING_SERVER_A}
ENV LIVE_PORT_EXPOSE_A=${LIVE_PORT_EXPOSE_A}

# Set environment variables for recording
ENV STREAM_URL_B=rtmp://${SERVER_IP_LIVE_STREAMING_SERVER_B}:${LIVE_PORT_EXPOSE_B}/live
ENV STREAM_URL_A=rtmp://${SERVER_IP_LIVE_STREAMING_SERVER_A}:${LIVE_PORT_EXPOSE_A}/live/stream_key_2a
ENV RECORDING_DIR=/recordings
ENV INTERVAL_MINUTES=5
ENV STREAM_ID=default

# Create recording directory
RUN mkdir -p ${RECORDING_DIR}

# Copy the shell script for recording
COPY ./stream_config/record_stream.sh .
RUN chmod +x ./record_stream.sh


# Expose Ports for RTMP Streaming (optional if RTMP server is handled elsewhere)
EXPOSE 1935 8080

# Start the recording script
CMD ["./record_stream.sh"]