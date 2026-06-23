package com.tournex.tests;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.android.options.UiAutomator2Options;
import org.apache.commons.io.FileUtils;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebElement;
import org.mockito.Mockito;
import org.testng.annotations.AfterClass;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.BeforeSuite;
import com.tournex.utils.ExcelReporter;
import com.tournex.utils.TestLogger;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.time.Duration;

public class BaseTest {
    protected static AppiumDriver driver;

    @BeforeSuite
    public void setupSuite() {
        TestLogger.info("Starting TourNex Appium Test Automation Suite execution...");
    }

    @BeforeClass
    public void setupClass() {
        String mockDriverEnv = System.getenv("MOCK_DRIVER");
        if (mockDriverEnv != null && mockDriverEnv.equalsIgnoreCase("true")) {
            TestLogger.info("MOCK_DRIVER=true detected. Setting up mock AndroidDriver session...");
            setupMockDriver();
            return;
        }

        try {
            TestLogger.info("Initializing Appium driver session...");
            
            String apkPath = System.getenv("APP_PATH");
            if (apkPath == null || apkPath.isEmpty()) {
                apkPath = new File("../android/app/build/outputs/apk/debug/app-debug.apk").getCanonicalPath();
            }
            TestLogger.info("Target APK Path: " + apkPath);

            UiAutomator2Options options = new UiAutomator2Options()
                    .setPlatformName("Android")
                    .setAutomationName("UiAutomator2")
                    .setDeviceName("Android Emulator")
                    .setApp(apkPath)
                    .setAutoGrantPermissions(true)
                    .setNewCommandTimeout(Duration.ofSeconds(600))
                    .setAppWaitActivity("com.tournex.mobile.MainActivity");

            URL appiumServerUrl = new URL("http://127.0.0.1:4723/");
            driver = new AndroidDriver(appiumServerUrl, options);
            driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
            
            TestLogger.info("Appium driver session initialized successfully!");
        } catch (Exception e) {
            TestLogger.error("Failed to initialize Appium driver session", e);
            throw new RuntimeException(e);
        }
    }

    private void setupMockDriver() {
        try {
            AndroidDriver mockDriver = Mockito.mock(AndroidDriver.class);
            WebElement mockElement = Mockito.mock(WebElement.class);
            
            Mockito.when(mockDriver.findElement(Mockito.any(org.openqa.selenium.By.class)))
                    .thenReturn(mockElement);
            
            java.util.List<WebElement> elementList = new java.util.ArrayList<>();
            elementList.add(mockElement);
            Mockito.when(mockDriver.findElements(Mockito.any(org.openqa.selenium.By.class)))
                    .thenReturn(elementList);
            
            Mockito.when(mockElement.isDisplayed()).thenReturn(true);
            Mockito.when(mockElement.isEnabled()).thenReturn(true);
            Mockito.when(mockElement.getText()).thenReturn("Mock Element Text");
            
            AndroidDriver.TargetLocator mockSwitch = Mockito.mock(AndroidDriver.TargetLocator.class);
            Mockito.when(mockDriver.switchTo()).thenReturn(mockSwitch);
            
            org.openqa.selenium.WebDriver.Timeouts mockTimeouts = Mockito.mock(org.openqa.selenium.WebDriver.Timeouts.class);
            org.openqa.selenium.WebDriver.Options mockOptions = Mockito.mock(org.openqa.selenium.WebDriver.Options.class);
            Mockito.when(mockDriver.manage()).thenReturn(mockOptions);
            Mockito.when(mockOptions.timeouts()).thenReturn(mockTimeouts);
            Mockito.when(mockTimeouts.implicitlyWait(Mockito.any(java.time.Duration.class)))
                    .thenReturn(mockTimeouts);
            
            driver = mockDriver;
            TestLogger.info("Mock AndroidDriver session initialized successfully!");
        } catch (Exception e) {
            TestLogger.error("Failed to initialize Mock AndroidDriver", e);
            throw new RuntimeException(e);
        }
    }

    @AfterClass
    public void tearDownClass() {
        if (driver != null) {
            TestLogger.info("Terminating Appium driver session...");
            driver.quit();
            driver = null;
        }
    }

    @AfterSuite
    public void tearDownSuite() {
        TestLogger.info("Compiling Test Results Excel Report...");
        ExcelReporter.writeReport("reports/TestExecutionReport.xlsx");
        TestLogger.info("TourNex Appium Test Suite execution finished.");
    }

    public static AppiumDriver getDriver() {
        return driver;
    }

    public String captureScreenshot(String testName) {
        if (driver == null) {
            TestLogger.warn("Cannot capture screenshot: driver is not active.");
            return null;
        }
        try {
            File srcFile = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
            String destPath = System.getProperty("user.dir") + "/screenshots/" + testName + ".png";
            File destFile = new File(destPath);
            FileUtils.copyFile(srcFile, destFile);
            TestLogger.info("Failure screenshot captured successfully at: " + destPath);
            return destPath;
        } catch (IOException e) {
            TestLogger.error("Error capturing failure screenshot for test " + testName, e);
            return null;
        }
    }
}
