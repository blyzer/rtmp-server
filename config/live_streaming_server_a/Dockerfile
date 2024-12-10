FROM tiangolo/nginx-rtmp

# Accept build-time argument
ARG SERVER_IP_LIVE_STREAMING_SERVER_A
ARG SERVER_IP_LIVE_STREAMING_SERVER_B
ARG RTSP_CAMERA_STREAM_URL
ARG RTSP_CAMERA_STREAM_PORT
ARG START_IP
ARG LIVE_PORT_EXPOSE_B
ARG RECORDING_EXPOSE_PORT

# Set it as an environment variable for the container
ENV SERVER_IP_LIVE_STREAMING_SERVER_A=${SERVER_IP_LIVE_STREAMING_SERVER_A}
ENV SERVER_IP_LIVE_STREAMING_SERVER_B=${SERVER_IP_LIVE_STREAMING_SERVER_B}
ENV SERVER_IP_LIVE_RECORDING_SERVER=${SERVER_IP_LIVE_RECORDING_SERVER}
ENV RTSP_CAMERA_STREAM_BASE_IP=${RTSP_CAMERA_STREAM_BASE_IP}
ENV RTSP_CAMERA_STREAM_PORT_BASE=${RTSP_CAMERA_STREAM_PORT_BASE:-554}
ENV STREAM_COUNT=${SERVER_COUNT:-4}
ENV START_IP=${START_IP:-100}
ENV LIVE_PORT_EXPOSE_B=${LIVE_PORT_EXPOSE_B}
ENV RECORDING_EXPOSE_PORT=${RECORDING_EXPOSE_PORT}

# Example of running a command that depends on this value during image build
RUN echo "Using server IP during image build: ${SERVER_IP_LIVE_STREAMING_SERVER_A}"

# Install bash
RUN apt-get update && apt-get install -y bash && apt-get clean

# Copy the template configuration
COPY ./nginx.conf /etc/nginx/nginx.conf.template

# Dynamically compute the PULL_LINES and handle final nginx.conf template generation
# Step 1: Generate Dynamic Pull Lines
SHELL ["/bin/bash", "-c"]
RUN PULL_LINES="" \
    && for i in $(seq 0 $((STREAM_COUNT - 1))); do \
        IP="${RTSP_CAMERA_STREAM_BASE_IP}.$((START_IP + i))" \
        && PORT=$((RTSP_CAMERA_STREAM_PORT_BASE + i)) \
        && PULL_LINES+="            pull rtmp://${IP}:${PORT}/stream RTSP;\n"; \
    done \
    && echo -e "$PULL_LINES" > /tmp/generated_pull_lines.log \
    && sed -e 's|{{DYNAMIC_PULL_LINES}}|'"$PULL_LINES"'|g' /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf


    RUN \
    # Step 2: Perform the final placeholder substitution with sed
    sed -e "s|{{SERVER_IP_LIVE_STREAMING_SERVER_A}}|${SERVER_IP_LIVE_STREAMING_SERVER_A}|g" \
        -e "s|{{SERVER_IP_LIVE_STREAMING_SERVER_B}}|${SERVER_IP_LIVE_STREAMING_SERVER_B}|g" \
        -e "s|{{SERVER_IP_LIVE_RECORDING_SERVER}}|${SERVER_IP_LIVE_RECORDING_SERVER}|g" \
        -e "s|{{LIVE_PORT_EXPOSE_B}}|${LIVE_PORT_EXPOSE_B}|g" \
        -e "s|{{RECORDING_EXPOSE_PORT}}|${RECORDING_EXPOSE_PORT}|g" \
        /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Expose ports for RTMP and HTTP interfaces
EXPOSE 1935 8080 80