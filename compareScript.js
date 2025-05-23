function compareFiles() {
  const file1 = document.getElementById('file1').files[0];
  const file2 = document.getElementById('file2').files[0];
  const outputDiv = document.getElementById('diffOutput');
  outputDiv.innerHTML = ''; // Clear previous output

  if (!file1 || !file2) {
    alert("Please upload both files.");
    return;
  }

  Promise.all([readFile(file1), readFile(file2)]).then(([text1, text2]) => {
    if (!text1.trim() && !text2.trim()) {
      outputDiv.innerHTML = `<div class="alert">Both files are empty.</div>`;
      return;
    }

    if (text1 === text2) {
      outputDiv.innerHTML = `<div class="alert">Both files are identical. No differences found.</div>`;
      return;
    }

    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    const maxLength = Math.max(lines1.length, lines2.length);

    let diffOutput = '';
    let sensitiveAlerts = [];

    for (let i = 0; i < maxLength; i++) {
      const line1 = lines1[i] || '';
      const line2 = lines2[i] || '';

      if (line1 !== line2) {
        const isSensitive = /(url|endpoint|env|feature|token)/i.test(line1 + line2);
        if (isSensitive) {
          sensitiveAlerts.push(`Line ${i + 1} might be sensitive:\n"${line1}" ↔ "${line2}"`);
        }

        diffOutput += `<span class="highlight">Line ${i + 1}:\n- ${line1}\n+ ${line2}</span>\n\n`;
      }
    }

    outputDiv.innerHTML =
      (sensitiveAlerts.length > 0
        ? sensitiveAlerts.map(alert => `<div class="alert">${alert}</div>`).join('\n') + '<hr>'
        : '') +
      `<pre>${diffOutput}</pre>`;
  });
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = event => resolve(event.target.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
