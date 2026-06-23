package com.tournex.utils;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.logging.FileHandler;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.logging.SimpleFormatter;

public class TestLogger {
    private static Logger logger;
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");

    public static synchronized Logger getLogger() {
        if (logger == null) {
            logger = Logger.getLogger("TournexAppiumTests");
            try {
                File logFile = new File("logs/execution.log");
                if (logFile.getParentFile() != null) {
                    logFile.getParentFile().mkdirs();
                }
                
                FileHandler fh = new FileHandler("logs/execution.log", true);
                fh.setFormatter(new SimpleFormatter());
                logger.addHandler(fh);
                logger.setLevel(Level.ALL);
            } catch (IOException e) {
                System.err.println("Could not initialize file logging: " + e.getMessage());
            }
        }
        return logger;
    }

    public static void info(String message) {
        String timestamp = LocalDateTime.now().format(formatter);
        System.out.println("[" + timestamp + "] [INFO] " + message);
        getLogger().info(message);
    }

    public static void warn(String message) {
        String timestamp = LocalDateTime.now().format(formatter);
        System.out.println("[" + timestamp + "] [WARN] " + message);
        getLogger().warning(message);
    }

    public static void error(String message, Throwable throwable) {
        String timestamp = LocalDateTime.now().format(formatter);
        System.err.println("[" + timestamp + "] [ERROR] " + message);
        if (throwable != null) {
            StringWriter sw = new StringWriter();
            PrintWriter pw = new PrintWriter(sw);
            throwable.printStackTrace(pw);
            System.err.println(sw.toString());
            getLogger().log(Level.SEVERE, message + "\n" + sw.toString(), throwable);
        } else {
            getLogger().log(Level.SEVERE, message);
        }
    }
}
