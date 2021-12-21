// Copyright (C) 2017-2022 BinaryMist Limited. All rights reserved.

// This file is ancillary to PurpleTeam.

// purpleteam-logger is free software: you can redistribute it and/or modify
// it under the terms of the MIT License.

// purpleteam-logger is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// MIT License for more details.

const { spawn } = require('child_process');

// You will need to define two debuggers in what ever tool you're using.
// localhost:9230 and localhost:9231
const execArgvDebugString = '--inspect-brk=localhost';
const childProcessInspectPort = 9231;
// You can run any of the purpleteam commands [about|status|test|testplan], `test` is just one example.
const purpleteamArgs = ['purpleteam', 'test'];


startPurpleteam = () => {
  const purpleteam = spawn('node', [
    ...(process.env.DEBUG_PURPLETEAM
    ? [`${execArgvDebugString}:${childProcessInspectPort}`]
    : []),
    ...purpleteamArgs],
    { cwd: `${process.cwd()}/node_modules/.bin/`, env: process.env, argv0: process.argv[0] }
  );

  purpleteam.stdout.on('data', (data) => {
    process.stdout.write(data);
  });

  purpleteam.stderr.on('data', (data) => {
    process.stdout.write(data);
  });

  purpleteam.on('exit', (code, signal) => {
    console.debug(`Child process "purpleteam" exited with code: "${code}", and signal: "${signal}".`);
  });

  purpleteam.on('close', (code) => {
    console.debug(`"close" event was emitted with code: "${code}" for "purpleteam".`);
  });

  purpleteam.on('error', (err) => {
    process.stdout.write(`Failed to start "purpleteam" sub-process. The error was: ${err}.`);
  });
};

startPurpleteam();
