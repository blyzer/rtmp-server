FROM nginx:alpine

# Accept build-time argument
ARG SERVER_IP_LIVE_STREAMING_SERVER_B
ARG LIVE_PORT_EXPOSE_B
ARG SERVER_IP_WEBRTC_CLIENT_VIEWER

# Set it as an environment variable for the container
ENV SERVER_IP_LIVE_STREAMING_SERVER_B=${SERVER_IP_LIVE_STREAMING_SERVER_B}
ENV LIVE_PORT_EXPOSE_B=${LIVE_PORT_EXPOSE_B}
ENV SIGNALING_SERVER_URL=ws://${SERVER_IP_LIVE_STREAMING_SERVER_B}:${LIVE_PORT_EXPOSE_B}/live/stream_key_2a
ENV SERVER_IP_WEBRTC_CLIENT_VIEWER=${SERVER_IP_WEBRTC_CLIENT_VIEWER}

# Copy web client files
COPY ./Server /usr/share/nginx/html/

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf.template

# Replace template variables at runtime
RUN sed -e "s|{{SERVER_IP_LIVE_STREAMING_SERVER_B}}|${SERVER_IP_LIVE_STREAMING_SERVER_B}|g" \
        -e "s|{{LIVE_PORT_EXPOSE_B}}|${LIVE_PORT_EXPOSE_B}|g" \
        /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

RUN cat /etc/nginx/nginx.conf

# Expose port for the client viewer
EXPOSE 8000

# Start Nginx
# CMD ["nginx"]
CMD ["sh", "-c","tail -f /dev/null"]