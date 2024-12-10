FROM tiangolo/nginx-rtmp

# Accept build-time argument
ARG SERVER_IP_LIVE_STREAMING_SERVER_A
ARG SERVER_IP_LIVE_RECORDING_SERVER
ARG RECORDING_EXPOSE_PORT
ARG LIVE_PORT_EXPOSE_A

# Set it as an environment variable for the container
ENV SERVER_IP_LIVE_STREAMING_SERVER_A=${SERVER_IP_LIVE_STREAMING_SERVER_A}
ENV SERVER_IP_LIVE_RECORDING_SERVER=${SERVER_IP_LIVE_RECORDING_SERVER}
ENV LIVE_PORT_EXPOSE_A=${LIVE_PORT_EXPOSE_A}
ENV RECORDING_EXPOSE_PORT=${RECORDING_EXPOSE_PORT}

# Install necessary tools and FFmpeg
RUN apt-get update && apt-get install -y \
    gstreamer1.0-tools \
    gstreamer1.0-plugins-base \
    gstreamer1.0-plugins-good \
    gstreamer1.0-plugins-bad \
    gstreamer1.0-plugins-ugly \
    git && \
    apt clean && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /stream_config

COPY ./stream_config/ /stream_config/

# Copy the template configuration
COPY ./nginx.conf /etc/nginx/nginx.conf.template

# Copy and make the stream script executable
COPY ./stream_config/stream.sh /stream_config/
RUN chmod +x /stream_config/stream.sh

# Expose Ports for RTMP Streaming
EXPOSE 1935 80 8080

# Update CMD to use the script
CMD ["/stream_config/stream.sh"]
