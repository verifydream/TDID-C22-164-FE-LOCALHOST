const weeklyStatusCanvas = document.getElementById("weeklyStatus");
const weeklyComplianceCanvas = document.getElementById("weeklyCompliance");
const monthlyStatusCanvas = document.getElementById("monthlyStatus");
const monthlyComplianceCanvas = document.getElementById("monthlyCompliance");

getRecap();

// Get Detail of Recap Data
function getRecap() {
  fetch(`http://localhost:3001/recap`)
    .then((response) => response.json())
    .then((data) => displayRecap(data));
}

// Display Detail of Recap Data to Frontend
function displayRecap(data) {
  let weeklyLabels = [];
  let weeklyCompletionRate = [];
  let weeklyComplianceRate = [];
  let monthlyLabels = [];
  let monthlyCompletionRate = [];
  let monthlyComplianceRate = [];

  // Weekly Recap
  for (var date in data["weekly"]["status"]) {
    // Status
    let weeklyStatus = {
      totalPending: 0,
      totalComplete: 0,
      completionRate: 0,
    };

    // Calculate Pending, Complete, and Completion Rate by Weekly
    weeklyStatus["totalPending"] += data["weekly"]["status"][date]["Pending"];
    weeklyStatus["totalComplete"] += data["weekly"]["status"][date]["Complete"];
    weeklyStatus["completionRate"] =
      (weeklyStatus["totalComplete"] /
        (weeklyStatus["totalPending"] + weeklyStatus["totalComplete"])) *
      100;

    // Compliance
    let weeklyCompliance = {
      totalPending: 0,
      totalLate: 0,
      totalOnTime: 0,
      onTimeRate: 0,
    };

    // Calculate Pending, Late, and On Time Rate per Weekly
    weeklyCompliance["totalPending"] +=
      data["weekly"]["compliance"][date]["Pending"];
    weeklyCompliance["totalLate"] += data["weekly"]["compliance"][date]["Late"];
    weeklyCompliance["totalOnTime"] +=
      data["weekly"]["compliance"][date]["On Time"];
    weeklyCompliance["onTimeRate"] =
      (weeklyCompliance["totalOnTime"] /
        (weeklyCompliance["totalLate"] + weeklyCompliance["totalOnTime"])) *
      100;

    weeklyLabels.push(date);
    weeklyCompletionRate.push(weeklyStatus["completionRate"]);
    weeklyComplianceRate.push(weeklyCompliance["onTimeRate"]);
  }

  // Weekly Status Chart
  new Chart(weeklyStatusCanvas, {
    type: "line",
    data: {
      labels: weeklyLabels,
      datasets: [
        {
          label: "Completion Rate",
          data: weeklyCompletionRate,
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          suggestedMin: 0,
          suggestedMax: 100,
        },
      },
    },
  });

  // Weekly Compliance Chart
  new Chart(weeklyComplianceCanvas, {
    type: "line",
    data: {
      labels: weeklyLabels,
      datasets: [
        {
          label: "Compliance Rate",
          data: weeklyComplianceRate,
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          suggestedMin: 0,
          suggestedMax: 100,
        },
      },
    },
  });

  // Monthly Recap
  for (var month in data["monthly"]["status"]) {
    // Status
    let monthlyStatus = {
      totalPending: 0,
      totalComplete: 0,
      completionRate: 0,
    };

    // Calculate Pending, Complete, and Completion Rate by Monthly
    monthlyStatus["totalPending"] +=
      data["monthly"]["status"][month]["Pending"];
    monthlyStatus["totalComplete"] +=
      data["monthly"]["status"][month]["Complete"];
    monthlyStatus["completionRate"] =
      (monthlyStatus["totalComplete"] /
        (monthlyStatus["totalPending"] + monthlyStatus["totalComplete"])) *
      100;

    // Compliance
    let monthlyCompliance = {
      totalPending: 0,
      totalLate: 0,
      totalOnTime: 0,
      onTimeRate: 0,
    };

    // Calculate Pending, Late, and On Time Rate per Monthly
    monthlyCompliance["totalPending"] +=
      data["monthly"]["compliance"][month]["Pending"];
    monthlyCompliance["totalLate"] +=
      data["monthly"]["compliance"][month]["Late"];
    monthlyCompliance["totalOnTime"] +=
      data["monthly"]["compliance"][month]["On Time"];
    monthlyCompliance["onTimeRate"] =
      (monthlyCompliance["totalOnTime"] /
        (monthlyCompliance["totalLate"] + monthlyCompliance["totalOnTime"])) *
      100;

    monthlyLabels.push(getMonthName(month));
    monthlyCompletionRate.push(monthlyStatus["completionRate"]);
    monthlyComplianceRate.push(monthlyCompliance["onTimeRate"]);
  }


  // Monthly Status Chart
  new Chart(monthlyStatusCanvas, {
    type: "line",
    data: {
      labels: monthlyLabels,
      datasets: [
        {
          label: "Completion Rate",
          data: monthlyCompletionRate,
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          suggestedMin: 0,
          suggestedMax: 100,
        },
      },
    },
  });

  // Monthly Compliance Chart
  new Chart(monthlyComplianceCanvas, {
    type: "line",
    data: {
      labels: monthlyLabels,
      datasets: [
        {
          label: "Compliance Rate",
          data: monthlyCompletionRate,
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          suggestedMin: 0,
          suggestedMax: 100,
        },
      },
    },
  });
}

// Function to Return Month Name from Month Number
function getMonthName(monthNumber) {
  const date = new Date();
  date.setMonth(monthNumber - 1);

  return date.toLocaleString("en-US", {
    month: "long",
  });
}

// Function to Get Tips from Backend with Status and Compliance Send by Weekly and Monthly
async function getTips(status, compliance) {
  var tips = "";

  const res = await fetch("http://localhost:3001/tips", {
    method: "POST",
    headers: {
      accept: "*/*",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      status: status,
      compliance: compliance,
    }),
  });

  tips = await res.text();

  return tips;
}
