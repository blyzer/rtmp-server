#!/bin/bash

sed -e "s|{{SERVER_IP_LIVE_STREAMING_SERVER_A}}|${SERVER_IP_LIVE_STREAMING_SERVER_A}|g" \
        -e "s|{{SERVER_IP_LIVE_RECORDING_SERVER}}|${SERVER_IP_LIVE_RECORDING_SERVER}|g" \
        -e "s|{{LIVE_PORT_EXPOSE_A}}|${LIVE_PORT_EXPOSE_A}|g" \
        -e "s|{{RECORDING_EXPOSE_PORT}}|${RECORDING_EXPOSE_PORT}|g" \
        /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

gst-launch-1.0 rtmp://${SERVER_IP_LIVE_STREAMING_SERVER_A}:${LIVE_PORT_EXPOSE_A}/stream ! \
    queue ! \
    videoconvert ! x264enc tune=zerolatency bitrate=500 speed=ultrafast ! \
    flvmux ! rtmpsink location=rtmp://${SERVER_IP_LIVE_RECORDING_SERVER}:${RECORDING_EXPOSE_PORT}/app