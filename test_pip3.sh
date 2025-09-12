#!/bin/bash

# Test script to verify pip3 installation
echo "🔍 Testing pip3 installation..."

# Check if pip3 is available
if command -v pip3 &> /dev/null; then
    echo "✅ pip3 is installed"
    pip3 --version
else
    echo "❌ pip3 is NOT installed"
    echo "Installing pip3..."
    sudo apt update
    sudo apt install -y python3-pip python3-venv python3-dev
    if command -v pip3 &> /dev/null; then
        echo "✅ pip3 installed successfully"
        pip3 --version
    else
        echo "❌ Failed to install pip3"
        exit 1
    fi
fi

echo "🔍 Testing virtual environment creation..."
python3 -m venv test_venv
if [ -d "test_venv" ]; then
    echo "✅ Virtual environment created successfully"
    rm -rf test_venv
else
    echo "❌ Failed to create virtual environment"
    exit 1
fi

echo "🎉 All tests passed!"
