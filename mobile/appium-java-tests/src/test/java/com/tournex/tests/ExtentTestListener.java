package com.tournex.tests;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.Status;
import com.aventstack.extentreports.reporter.ExtentSparkReporter;
import org.testng.ITestContext;
import org.testng.ITestListener;
import org.testng.ITestResult;
import com.tournex.utils.ExcelReporter;
import com.tournex.utils.TestLogger;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;

public class ExtentTestListener implements ITestListener {
    private static ExtentReports extent;
    private static final ThreadLocal<ExtentTest> test = new ThreadLocal<>();
    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    @Override
    public void onStart(ITestContext context) {
        TestLogger.info("Suite started: " + context.getName());
        
        // Setup Extent Report HTML output path
        File reportsDir = new File("reports");
        if (!reportsDir.exists()) {
            reportsDir.mkdirs();
        }
        
        ExtentSparkReporter spark = new ExtentSparkReporter("reports/ExtentReport.html");
        spark.config().setReportName("TourNex Mobile App Appium Automation Report");
        spark.config().setDocumentTitle("Test Execution Report");
        
        extent = new ExtentReports();
        extent.attachReporter(spark);
        extent.setSystemInfo("Platform", "Android");
        extent.setSystemInfo("Environment", "QA Sandbox");
        extent.setSystemInfo("Build Number", System.getenv("BUILD_NUMBER") != null ? System.getenv("BUILD_NUMBER") : "Local-Build");
    }

    @Override
    public void onFinish(ITestContext context) {
        TestLogger.info("Suite finished: " + context.getName());
        if (extent != null) {
            extent.flush();
        }
    }

    @Override
    public void onTestStart(ITestResult result) {
        TestLogger.info("Test Started: " + result.getName());
        ExtentTest extentTest = extent.createTest(result.getMethod().getMethodName(), result.getMethod().getDescription());
        test.set(extentTest);
    }

    @Override
    public void onTestSuccess(ITestResult result) {
        TestLogger.info("Test Passed: " + result.getName());
        test.get().log(Status.PASS, "Test passed successfully.");
        
        logToExcel(result, "Pass", null);
    }

    @Override
    public void onTestFailure(ITestResult result) {
        TestLogger.warn("Test Failed: " + result.getName());
        Throwable ex = result.getThrowable();
        test.get().log(Status.FAIL, "Test failed: " + ex.getMessage());
        TestLogger.error("Failure in test: " + result.getName(), ex);

        // Capture screenshot dynamically
        Object currentClass = result.getInstance();
        if (currentClass instanceof BaseTest) {
            String path = ((BaseTest) currentClass).captureScreenshot(result.getName());
            if (path != null) {
                test.get().addScreenCaptureFromPath(path);
            }
        }
        
        logToExcel(result, "Fail", ex.getMessage());
    }

    @Override
    public void onTestSkipped(ITestResult result) {
        TestLogger.info("Test Skipped: " + result.getName());
        test.get().log(Status.SKIP, "Test skipped.");
        
        logToExcel(result, "Skip", result.getThrowable() != null ? result.getThrowable().getMessage() : "Skipped");
    }

    private void logToExcel(ITestResult result, String status, String error) {
        String testName = result.getMethod().getMethodName();
        String module = result.getTestClass().getRealClass().getSimpleName();
        long duration = result.getEndMillis() - result.getStartMillis();
        String executionTime = duration + " ms";
        String dateStr = dateFormat.format(new Date(result.getStartMillis()));
        String build = System.getenv("BUILD_NUMBER") != null ? System.getenv("BUILD_NUMBER") : "Local-Build";
        String deviceName = "Android Emulator";

        // Generate dynamic TC id based on name hash or parameter index for unique column entries
        String tcId = "TC-" + String.format("%03d", Math.abs(testName.hashCode() % 1000));
        
        // Handle parameterized runs to print unique IDs
        Object[] params = result.getParameters();
        if (params != null && params.length > 0) {
            tcId = "TC-" + String.format("%03d", Integer.parseInt(params[0].toString()));
            testName = params[2].toString();
            module = params[1].toString();
        }

        ExcelReporter.addResult(new ExcelReporter.TestResult(
            tcId,
            testName,
            module,
            executionTime,
            status,
            error,
            deviceName,
            build,
            dateStr
        ));
    }
}
