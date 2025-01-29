const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());

app.post('/run', async (req, res) => {
  await wait(1000);
  const { code } = req.body;
  const tempFilePath = 'temp_code.eli';
  fs.writeFileSync(tempFilePath, code);

  console.log(`Temporary file created at ${tempFilePath}`);
  console.log(`Code written to file:\n${code}`);

  exec(`python interpreter.py ${tempFilePath}`, (error, stdout, stderr) => {
    fs.unlinkSync(tempFilePath);
    console.log(`Temporary file ${tempFilePath} deleted`);

    if (error) {
      console.error(`Error executing Python code: ${stderr}`);
      res.status(500).json({ output: stderr });
      return;
    }

    console.log(`Python code executed successfully. Output:\n${stdout}`);
    res.status(200).json({ output: stdout.trim() });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}