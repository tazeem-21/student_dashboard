const student = {
      name: "Ali",
      roll: "101",
      results: {
        "Class Test": [
          { subject: "Math", marks: 85, total: 100 },
          { subject: "Science", marks: 90, total: 100 },
          { subject: "English", marks: 78, total: 100 },
          { subject: "History", marks: 72, total: 100 }
        ],
        "Mid Term": [
          { subject: "Math", marks: 88, total: 100 },
          { subject: "Science", marks: 92, total: 100 },
          { subject: "English", marks: 81, total: 100 },
          { subject: "History", marks: 75, total: 100 }
        ],
        "Final Exam": [
          { subject: "Math", marks: 91, total: 100 },
          { subject: "Science", marks: 95, total: 100 },
          { subject: "English", marks: 87, total: 100 },
          { subject: "History", marks: 80, total: 100 }
        ]
      }
    };

    const examSelect = document.getElementById('examSelect');
    const resultTableBody = document.querySelector('#resultTable tbody');

    // Populate dropdown
    Object.keys(student.results).forEach(exam => {
      const option = document.createElement('option');
      option.value = exam;
      option.textContent = exam;
      examSelect.appendChild(option);
    });

    // Grade calculation
    function getGrade(percent) {
      if(percent >= 90) return 'A+';
      if(percent >= 80) return 'A';
      if(percent >= 70) return 'B';
      if(percent >= 60) return 'C';
      return 'D';
    }

    // Color for progress bar
    function getColor(percent) {
      if(percent >= 80) return '#34D399'; // green
      if(percent >= 60) return '#FBBF24'; // yellow
      return '#F87171'; // red
    }

    // Update table on exam selection
    examSelect.addEventListener('change', function() {
      const selectedExam = this.value;
      resultTableBody.innerHTML = "";

      if (!selectedExam) return;

      let totalMarks = 0;
      let totalMax = 0;

      const data = student.results[selectedExam];
      data.forEach(row => {
        const percent = ((row.marks / row.total) * 100).toFixed(1);
        const grade = getGrade(percent);
        totalMarks += row.marks;
        totalMax += row.total;

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${row.subject}</td>
          <td>${row.marks}/${row.total}</td>
          <td>${percent}%</td>
          <td>${grade}</td>
          <td>
            <div class="progress-container">
              <div class="progress-bar" style="width:${percent}%; background:${getColor(percent)}">${percent}%</div>
            </div>
          </td>
        `;
        resultTableBody.appendChild(tr);
      });

      // Total row
      const totalPercent = ((totalMarks / totalMax) * 100).toFixed(1);
      const trTotal = document.createElement('tr');
      trTotal.classList.add('total-row');
      trTotal.innerHTML = `
        <td>Total</td>
        <td>${totalMarks}/${totalMax}</td>
        <td>${totalPercent}%</td>
        <td>${getGrade(totalPercent)}</td>
        <td>
          <div class="progress-container">
            <div class="progress-bar" style="width:${totalPercent}%; background:#4F9CFF">${totalPercent}%</div>
          </div>
        </td>
      `;
      resultTableBody.appendChild(trTotal);
    });

    const backButton = document.getElementById('backButton');

backButton.addEventListener('click', () => {
  window.history.back(); // go to previous page
});


const downloadPdfBtn = document.getElementById('downloadBtn');

downloadPdfBtn.addEventListener('click', () => {
  const selectedExam = examSelect.value;
  if(!selectedExam) {
    alert("Please select an exam first!");
    return;
  }

  const element = document.getElementById('resultContent'); // element to capture
  const opt = {
    margin:       0.5,
    filename:     `${selectedExam}_Result.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save();
});
