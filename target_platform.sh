#!/bin/bash

# Create an array to simulate a map using space as a delimiter
platform_map=("linux/amd64=linux/amd64"
              "linux/arm64=linux/arm64"
              "linux/aarch64=linux/arm64"
              "linux/arm=linux/arm"
              "darwin/amd64=darwin/amd64"
              "darwin/arm64=darwin/arm64")

# Get the HOST_PLATFORM value (this is an example, replace with your actual value)
HOST_PLATFORM=$(docker info --format '{{.OSType}}/{{.Architecture}}')

# Iterate through the array to find the matching entry
TARGET_PLATFORM=""
for entry in "${platform_map[@]}"; do
    key="${entry%%=*}"
    value="${entry#*=}"
    if [[ "$key" == "$HOST_PLATFORM" ]]; then
        TARGET_PLATFORM="$value"
        break
    fi
done

# Check if TARGET_PLATFORM was found
if [[ -n "$TARGET_PLATFORM" ]]; then
    echo "TARGET_PLATFORM set to: $TARGET_PLATFORM"
else
    echo "Unknown platform: $HOST_PLATFORM"
    exit 1
fi

# Create an array to simulate a map for platform images
platform_images=("linux/amd64=restreamio/gstreamer:2024-12-11T20-26-38Z-prod-dbg"
                 "linux/arm64=restreamio/gstreamer:2024-12-11T20-26-38Z-prod-dbg"
                 "linux/aarch64=restreamio/gstreamer:2024-12-11T20-26-38Z-prod-dbg"
                 "linux/arm=restreamio/gstreamer:2024-12-11T20-26-38Z-prod-dbg"
                 "darwin/amd64=restreamio/gstreamer:2024-12-11T20-26-38Z-prod-dbg"
                 "darwin/arm64=restreamio/gstreamer:2024-12-11T20-26-38Z-prod-dbg")

# Find the corresponding image
TARGET_IMAGE=""
for entry in "${platform_images[@]}"; do
    key="${entry%%=*}"
    value="${entry#*=}"
    if [[ "$key" == "$HOST_PLATFORM" ]]; then
        TARGET_IMAGE="$value"
        break
    fi
done

# Check if TARGET_IMAGE was found
if [[ -n "$TARGET_IMAGE" ]]; then
    echo "Detected platform: $HOST_PLATFORM"
    echo "Using image: $TARGET_IMAGE"

    # Update TARGET_PLATFORM in the .env file
    if grep -q "^TARGET_PLATFORM=" .env; then
        sed -i '' "s|^TARGET_PLATFORM=.*|TARGET_PLATFORM=$TARGET_PLATFORM|" .env
    else
        echo "TARGET_PLATFORM=$TARGET_PLATFORM" >> .env
    fi

    # Update TARGET_IMAGE in the .env file
    if grep -q "^TARGET_IMAGE=" .env; then
        sed -i '' "s|^TARGET_IMAGE=.*|TARGET_IMAGE=$TARGET_IMAGE|" .env
    else
        echo "TARGET_IMAGE=$TARGET_IMAGE" >> .env
    fi

    echo ".env file updated successfully."
else
    echo "No image found for platform: $HOST_PLATFORM"
    exit 1
fi