FROM restreamio/gstreamer:x86_64-latest-prod

# Accept build-time argument
ARG SERVER_IP_LIVE_STREAMING_SERVER_B
ARG LIVE_PORT_EXPOSE_B

# Set it as an environment variable for the container
ENV SERVER_IP_LIVE_STREAMING_SERVER_B=${SERVER_IP_LIVE_STREAMING_SERVER_B}
ENV LIVE_PORT_EXPOSE_B=${LIVE_PORT_EXPOSE_B}
ENV SIGNALING_SERVER_URL=ws://${SERVER_IP_LIVE_STREAMING_SERVER_B}:${LIVE_PORT_EXPOSE_B}/live/stream_key_2a

# Copy the template configuration
COPY ./nginx.conf /etc/nginx/nginx.conf.template

RUN sed -e "s|{{SERVER_IP_LIVE_STREAMING_SERVER_B}}|${SERVER_IP_LIVE_STREAMING_SERVER_B}|g" \
        -e "s|{{LIVE_PORT_EXPOSE_B}}|${LIVE_PORT_EXPOSE_B}|g" \
        /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Add any custom scripts for live overlay
COPY ./overlay_script.sh /usr/bin/
COPY ./web-viewer /usr/share/nginx/html/
RUN chmod +x /usr/bin/overlay_script.sh

# CMD ["/usr/bin/overlay_script.sh"]

# # Expose the port for the viewer
EXPOSE 8001
CMD ["nginx", "-g", "daemon off;"]

# FROM gstreamer/gstreamer
# COPY overlay_script.sh /app/overlay_script.sh
# RUN chmod +x /app/overlay_script.sh
# CMD ["/app/overlay_script.sh"]

# FROM nginx:alpine

# # Accept build-time arguments
# ARG SIGNALING_SERVER_IP
# ARG LIVE_STREAM_PORT

# # Set as environment variables
# ENV SIGNALING_SERVER_URL=ws://${SIGNALING_SERVER_IP}:${LIVE_STREAM_PORT}

# # Copy web client files (WebRTC viewer with overlay capability)
# COPY ./live-overlay-client/index.html /usr/share/nginx/html/
# COPY ./live-overlay-client/viewer.js /usr/share/nginx/html/

# # Copy and configure NGINX
# COPY ./nginx.conf /etc/nginx/nginx.conf.template

# # Expose the port for the viewer
# EXPOSE 8000

# # Render NGINX configuration and start nginx
# CMD bash -c "sed -e 's|{{SIGNALING_SERVER_IP}}|${SIGNALING_SERVER_IP}|g' -e 's|{{LIVE_STREAM_PORT}}|${LIVE_STREAM_PORT}|g' /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;'"