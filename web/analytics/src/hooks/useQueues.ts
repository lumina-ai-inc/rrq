import { useQuery } from "react-query";
import { useState, useEffect } from "react";
import { getQueues } from "../services/queuesApi";
import { QueueInfo, DataPoint } from "../models/apiCalls.model";

const MAX_DATA_POINTS = 60;

export const useQueues = (search: string) => {
  const [historicalData, setHistoricalData] = useState<{
    [key: string]: DataPoint[];
  }>({});

  const { data, ...rest } = useQuery<{ queues: QueueInfo[] }, Error>(
    ["queues", search],
    async () => {
      const queues = await getQueues(search);
      return { queues };
    },
    {
      enabled: !!search,
      refetchInterval: 1000,
      onError: (error) => {
        console.error("Error fetching queues:", error);
      },
    }
  );

  useEffect(() => {
    if (data?.queues) {
      const timestamp = new Date().toISOString();
      const newDataPoints: { [key: string]: DataPoint } = {};

      data.queues.forEach((queue: QueueInfo) => {
        newDataPoints[queue.name] = {
          timestamp,
          queueLength: queue.length,
        };
      });

      setHistoricalData((prevData) => {
        const updatedData = { ...prevData };
        Object.entries(newDataPoints).forEach(([queueName, dataPoint]) => {
          updatedData[queueName] = [
            ...(updatedData[queueName] || []),
            dataPoint,
          ].slice(-MAX_DATA_POINTS);
        });
        return updatedData;
      });
    }
  }, [data]);

  return {
    ...rest,
    data: data ? { ...data, dataPoints: historicalData } : undefined,
  };
};
