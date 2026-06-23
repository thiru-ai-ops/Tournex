package com.tournex.utils;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class ExcelReporter {
    public static class TestResult {
        public String id;
        public String name;
        public String module;
        public String time;
        public String status;
        public String error;
        public String device;
        public String build;
        public String date;

        public TestResult(String id, String name, String module, String time, String status, String error, String device, String build, String date) {
            this.id = id;
            this.name = name;
            this.module = module;
            this.time = time;
            this.status = status;
            this.error = error == null ? "" : error;
            this.device = device;
            this.build = build == null || build.isEmpty() ? "Local-Build" : build;
            this.date = date;
        }
    }

    private static final List<TestResult> results = new ArrayList<>();

    public static synchronized void addResult(TestResult result) {
        results.add(result);
    }

    public static synchronized List<TestResult> getResults() {
        return new ArrayList<>(results);
    }

    public static synchronized void writeReport(String path) {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Test Execution Report");

        // Headers
        String[] headers = {
            "Test Case ID", "Module", "Test Name", "Status", "Execution Time", 
            "Device", "Build Number", "Execution Date", "Error Message"
        };
        Row headerRow = sheet.createRow(0);
        
        // Header Styling
        CellStyle headerStyle = workbook.createCellStyle();
        Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerFont.setColor(IndexedColors.WHITE.getIndex());
        headerStyle.setFont(headerFont);
        headerStyle.setFillForegroundColor(IndexedColors.BLUE.getIndex());
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        headerStyle.setAlignment(HorizontalAlignment.CENTER);
        
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        // Alignments & Styles for rows
        CellStyle passStyle = workbook.createCellStyle();
        Font passFont = workbook.createFont();
        passFont.setColor(IndexedColors.GREEN.getIndex());
        passFont.setBold(true);
        passStyle.setFont(passFont);

        CellStyle failStyle = workbook.createCellStyle();
        Font failFont = workbook.createFont();
        failFont.setColor(IndexedColors.RED.getIndex());
        failFont.setBold(true);
        failStyle.setFont(failFont);

        // Data Rows
        int rowNum = 1;
        for (TestResult res : results) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(res.id);
            row.createCell(1).setCellValue(res.module);
            row.createCell(2).setCellValue(res.name);
            
            Cell statusCell = row.createCell(3);
            statusCell.setCellValue(res.status);
            if ("Pass".equalsIgnoreCase(res.status) || "PASSED".equalsIgnoreCase(res.status)) {
                statusCell.setCellStyle(passStyle);
            } else {
                statusCell.setCellStyle(failStyle);
            }
            
            row.createCell(4).setCellValue(res.time);
            row.createCell(5).setCellValue(res.device);
            row.createCell(6).setCellValue(res.build);
            row.createCell(7).setCellValue(res.date);
            row.createCell(8).setCellValue(res.error);
        }

        // Auto-size columns
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }

        // Output File
        File file = new File(path);
        if (file.getParentFile() != null) {
            file.getParentFile().mkdirs();
        }

        try (FileOutputStream fileOut = new FileOutputStream(file)) {
            workbook.write(fileOut);
            workbook.close();
            System.out.println("Excel report generated successfully at: " + file.getAbsolutePath());
        } catch (IOException e) {
            System.err.println("Error writing Excel report: " + e.getMessage());
        }
    }
}
