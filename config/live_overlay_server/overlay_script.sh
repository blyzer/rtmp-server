#!/bin/bash
# gst-launch-1.0 rtmp://$SERVER_IP_LIVE_STREAMING_SERVER_A/live/stream ! videoconvert ! overlay
gst-launch-1.0 webrtcbin stun-server=stun://stun.l.google.com:19302 \
  ! queue ! decodebin ! videoconvert ! gdkpixbuftotexture ! autovideosink
