import * as net from "net";

export function waitForDB(
  host: string,
  port: number,
  retryInterval: number = 100,
  callback: () => void
): void {
  const interval = setInterval(() => {
    console.log(`Checking port ${port} on ${host}...`);
    const socket = net.connect(port, host, () => {
      console.log(`Port ${port} on ${host} is now open!`);
      clearInterval(interval);
      socket.end();
      callback();
    });

    socket.on("error", (err) => {
      console.log(`Port ${port} on ${host} is not open yet.`);
    });
  }, retryInterval);
}
