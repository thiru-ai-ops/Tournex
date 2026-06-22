const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

function CustomReporter(runner) {
  const stats = { passes: 0, failures: 0, pending: 0, duration: 0 };
  const tests = [];
  const start = Date.now();

  runner.on('pass', function(test) {
    stats.passes++;
    tests.push({
      title: test.title,
      fullTitle: test.fullTitle(),
      status: 'passed',
      duration: test.duration
    });
  });

  runner.on('fail', function(test, err) {
    stats.failures++;
    tests.push({
      title: test.title,
      fullTitle: test.fullTitle(),
      status: 'failed',
      duration: test.duration || 0,
      error: err.message
    });
  });

  runner.on('pending', function(test) {
    stats.pending++;
    tests.push({
      title: test.title,
      fullTitle: test.fullTitle(),
      status: 'pending',
      duration: 0
    });
  });

  runner.on('end', function() {
    stats.duration = Date.now() - start;
    const report = {
      stats,
      tests
    };
    
    // Write HTML report
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Tournex Mobile App E2E Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 32px; background: #f8fafc; color: #0f172a; max-width: 900px; margin: 0 auto; }
    .header { margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #e2e8f0; }
    h1 { margin: 0 0 8px; color: #1e3a8a; font-size: 28px; font-weight: 800; }
    .stats { display: flex; gap: 16px; margin-bottom: 24px; }
    .stat-card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; flex: 1; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .stat-label { font-size: 12px; color: #64748b; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; }
    .stat-val { font-size: 28px; font-weight: 800; margin-top: 4px; }
    .passed { color: #10b981; }
    .failed { color: #ef4444; }
    .duration { color: #64748b; }
    .test-list { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 8px 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .test-item { padding: 14px 0; border-bottom: 1px solid #f1f5f9; display: flex; align-items: flex-start; justify-content: space-between; }
    .test-item:last-child { border-bottom: none; }
    .test-title { font-weight: 600; font-size: 14px; color: #334155; }
    .test-badge { padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; text-transform: uppercase; margin-left: 12px; flex-shrink: 0; }
    .badge-passed { background: #d1fae5; color: #065f46; }
    .badge-failed { background: #fee2e2; color: #991b1b; }
    .error-msg { margin-top: 8px; color: #991b1b; font-size: 12px; font-family: monospace; background: #fef2f2; padding: 10px; border-radius: 6px; border: 1px solid #fca5a5; white-space: pre-wrap; word-break: break-all; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Tournex Appium Automation E2E Test Report</h1>
    <div class="stats">
      <div class="stat-card">
        <div class="stat-label">Total Tests</div>
        <div class="stat-val">${stats.passes + stats.failures}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label passed">Passed</div>
        <div class="stat-val passed">${stats.passes}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label failed">Failed</div>
        <div class="stat-val failed">${stats.failures}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label duration">Duration</div>
        <div class="stat-val duration">${(stats.duration / 1000).toFixed(2)}s</div>
      </div>
    </div>
  </div>
  <div class="test-list">
    ${tests.map((t, idx) => `
      <div class="test-item">
        <div style="flex: 1;">
          <div class="test-title">${idx + 1}. ${t.title}</div>
          ${t.error ? `<div class="error-msg">${t.error}</div>` : ''}
        </div>
        <span class="test-badge badge-${t.status}">${t.status}</span>
      </div>
    `).join('')}
  </div>
</body>
</html>
    `;

    const reportDir = path.join(process.cwd(), 'mochawesome-report');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    fs.writeFileSync(path.join(reportDir, 'report.html'), htmlContent);
    fs.writeFileSync(path.join(reportDir, 'report.json'), JSON.stringify(report, null, 2));
    console.log('Appium HTML report generated at:', path.join(reportDir, 'report.html'));

    // --- EXCEL REPORT GENERATION ---
    try {
      const summaryData = [
        { "Metric": "Total Tests", "Value": stats.passes + stats.failures },
        { "Metric": "Passed Tests", "Value": stats.passes },
        { "Metric": "Failed Tests", "Value": stats.failures },
        { "Metric": "Pending Tests", "Value": stats.pending },
        { "Metric": "Success Rate", "Value": `${((stats.passes / Math.max(1, stats.passes + stats.failures)) * 100).toFixed(2)}%` },
        { "Metric": "Total Duration", "Value": `${(stats.duration / 1000).toFixed(2)}s` }
      ];

      const detailedData = tests.map((t, idx) => {
        let stage = 'Mobile App E2E Lifecycle';
        const ft = t.fullTitle.toLowerCase();
        if (ft.includes('stage 1')) stage = 'Stage 1: Mobile App Launch & Login Credentials';
        else if (ft.includes('stage 2')) stage = 'Stage 2: Login Screen Layout';
        else if (ft.includes('stage 3')) stage = 'Stage 3: Firebase Authentication Simulator';
        else if (ft.includes('stage 4')) stage = 'Stage 4: Home Dashboard & Screen Elements';
        else if (ft.includes('stage 5')) stage = 'Stage 5: Navigation, Session Clear & Logout';

        return {
          "Test #": idx + 1,
          "Stage / Module": stage,
          "Test Case Title": t.title,
          "Execution Status": t.status.toUpperCase(),
          "Duration (s)": (t.duration / 1000).toFixed(3),
          "Error Message / Root Failure": t.error || 'N/A'
        };
      });

      const wb = XLSX.utils.book_new();
      const wsSummary = XLSX.utils.json_to_sheet(summaryData);
      const wsDetailed = XLSX.utils.json_to_sheet(detailedData);

      wsSummary['!cols'] = [
        { wch: 22 },
        { wch: 15 }
      ];
      wsDetailed['!cols'] = [
        { wch: 8 },
        { wch: 35 },
        { wch: 60 },
        { wch: 18 },
        { wch: 15 },
        { wch: 70 }
      ];

      XLSX.utils.book_append_sheet(wb, wsSummary, "Summary Statistics");
      XLSX.utils.book_append_sheet(wb, wsDetailed, "Test Execution Details");

      const excelPath = path.join(reportDir, 'E2E_Test_Report.xlsx');
      XLSX.writeFile(wb, excelPath);
      console.log('Appium Excel report generated at:', excelPath);
    } catch (excelErr) {
      console.error('Failed to generate Appium Excel report:', excelErr);
    }
  });
}

module.exports = CustomReporter;
