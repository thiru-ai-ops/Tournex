#!/bin/bash
set -e

# Determine directory of script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

if [ "$MOCK_DRIVER" = "true" ]; then
  echo "=== Running Appium Tests in Mock Mode (No Emulator) ==="
  npm ci
  npm test
  
  echo "=== Generate Allure Report ==="
  npx allure generate allure-results --clean -o allure-report
  echo "✅ Allure report generated successfully!"
  exit 0
fi

echo "=== Check adb devices ==="
adb devices

echo "=== Wait for emulator boot ==="
adb wait-for-device

boot_completed=0
timeout=180
elapsed=0
while [ "$boot_completed" -ne 1 ] && [ "$elapsed" -lt "$timeout" ]; do
  boot_completed=$(adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')
  if [ -z "$boot_completed" ]; then
    boot_completed=0
  fi
  if [ "$boot_completed" -ne 1 ]; then
    echo "Waiting for emulator boot completion... ($elapsed/$timeout s)"
    sleep 5
    elapsed=$((elapsed + 5))
  fi
done

if [ "$boot_completed" -ne 1 ]; then
  echo "❌ ERROR: Emulator failed to boot within $timeout seconds"
  exit 1
fi
echo "✅ Emulator boot completed!"

echo "=== Start logcat capturing ==="
adb logcat -v time > /tmp/emulator.log &

echo "=== Install dependencies and Run WebdriverIO Appium Tests ==="
npm ci
npm test

echo "=== Generate Allure Report ==="
npx allure generate allure-results --clean -o allure-report
echo "✅ Allure report generated successfully!"
