# Accept build argument for image version or platform-specific image
ARG TARGET_IMAGE=restreamio/gstreamer:2024-12-11T20-26-38Z-prod-dbg

# Accept build-time argument
ARG SERVER_IP_LIVE_STREAMING_SERVER_B
ARG LIVE_PORT_EXPOSE_B

# Use the dynamic image
FROM ${TARGET_IMAGE}

# Set it as an environment variable for the container
ENV SERVER_IP_LIVE_STREAMING_SERVER_B=${SERVER_IP_LIVE_STREAMING_SERVER_B}
ENV LIVE_PORT_EXPOSE_B=${LIVE_PORT_EXPOSE_B}
ENV SIGNALING_SERVER_URL=ws://${SERVER_IP_LIVE_STREAMING_SERVER_B}:${LIVE_PORT_EXPOSE_B}/live/stream_key_2a
# RUN apt-get update && apt-get install -y bash nginx && apt-get clean
RUN apt-get update
RUN apt-get install -y bash
RUN apt-get install -y -o Dpkg::Options::="--force-confnew" nginx-core 
RUN apt-get clean

# Copy the template configuration
COPY ./nginx.conf /etc/nginx/nginx.conf.template

RUN sed -e "s|{{SERVER_IP_LIVE_STREAMING_SERVER_B}}|${SERVER_IP_LIVE_STREAMING_SERVER_B}|g" \
        -e "s|{{LIVE_PORT_EXPOSE_B}}|${LIVE_PORT_EXPOSE_B}|g" \
        /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Add any custom scripts for live overlay
COPY ./overlay_script.sh /usr/bin/
COPY ./web-viewer /usr/share/nginx/html/
RUN chmod +x /usr/bin/overlay_script.sh

# # Expose the port for the viewer
EXPOSE 8001
CMD ["nginx"]