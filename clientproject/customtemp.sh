#!/bin/bash
cd "$(dirname "$0")"
# Run yo command with predefined options
{
  echo 2             # Select "Which template do you want to use? List Report Page"
  sleep 8
  echo 4             # Select "Data source: Use a Local CAP Project"
  sleep 2
  echo 1             # Choose your CAP project
  sleep 2
  echo 1             # Select "Main entity: Entity"
  sleep 2
  echo       # Enter the main entity name
  # Skip selecting Navigation entity
  sleep 2
  echo "$1"    # Enter the project name
  sleep 2
  echo "$2"   # Enter the app title
  sleep 2
  echo "$3"          # Enter the namespace
  sleep
  echo "$4"  # Enter the description
  sleep 2
  echo   # Select the SAPUI5 version
  sleep 2
  echo y             # Confirm adding i18n support
  sleep 2
  echo N             # Skip adding example code
  sleep 2
  echo N             # Confirm adding git support
  sleep 2
  echo               # Simulate pressing Enter
  sleep 2
  echo               # Simulate pressing Enter
} | yo @sap/fiori --skip-install --skip-cache --no-interaction --force || true