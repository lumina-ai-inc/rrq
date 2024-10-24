import { RedisInfoProps } from "../models/components.model";

export default function RedisInfo({ information }: RedisInfoProps) {
  const formatBytes = (bytes: string) => {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === "0") return "0 Byte";
    const i = parseInt(
      Math.floor(Math.log(parseInt(bytes)) / Math.log(1024)).toString()
    );
    return Math.round(parseInt(bytes) / Math.pow(1024, i)) + " " + sizes[i];
  };

  const totalQueues = information?.keyspace
    ? Object.values(information?.keyspace).reduce((acc, val) => {
        const keys = parseInt(val.split(",")[0].split("=")[1]);
        return acc + keys;
      }, 0)
    : 0;

  return (
    <div className="redis-info">
      <h2>Redis Information</h2>
      <div className="info-grid">
        <div className="info-item">
          <h3>Memory Usage</h3>
          <p>Used Memory: {formatBytes(information?.memory?.used_memory)}</p>
          <p>Peak Memory: {formatBytes(information?.memory?.used_memory_peak)}</p>
          <p>
            Memory Fragmentation Ratio:{" "}
            {information?.memory?.mem_fragmentation_ratio}
          </p>
        </div>
        <div className="info-item">
          <h3>Keyspace</h3>
          <p>Total Queues: {totalQueues}</p>
          {Object.entries(information?.keyspace).map(([db, stats]) => (
            <p key={db}>
              {db}: {stats}
            </p>
          ))}
        </div>
        <div className="info-item">
          <h3>Server</h3>
          <p>Redis Version: {information?.server?.redis_version}</p>
          <p>Uptime: {information?.server?.uptime_in_seconds} seconds</p>
        </div>
        <div className="info-item">
          <h3>Clients</h3>
          <p>Connected Clients: {information?.clients?.connected_clients}</p>
        </div>
        <div className="info-item">
          <h3>Stats</h3>
          <p>
            Total Commands Processed:{" "}
            {information?.stats?.total_commands_processed}
          </p>
          <p>
            Total Connections Received:{" "}
            {information?.stats?.total_connections_received}
          </p>
        </div>
      </div>
    </div>
  );
}
