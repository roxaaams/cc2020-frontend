import { useEffect, useState, useMemo } from 'react';
import * as AWS from 'aws-sdk';
import { Consumer } from 'sqs-consumer';
import { EntryResult } from '../types/type.result';
import { MessageType } from '../types/type.message';
import { MasterTrigger } from '../types/type.master';

export const useResultListener = () => {
  const [results, setResults] = useState<EntryResult[]>([]);

  useEffect(() => {
    const sqs = new AWS.SQS({
      accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
      sessionToken: process.env.REACT_APP_SESSION_TOKEN,
      region: process.env.REACT_APP_REGION,
    });

    const consumer = Consumer.create({
      queueUrl: process.env.REACT_APP_SQS_URL,
      sqs: sqs,
      handleMessage: async (message) => {
        const msg = JSON.parse(JSON.parse(JSON.stringify(message)).Body);

        const messageInfo = JSON.parse(msg.Message);

        if (messageInfo.type === MessageType.EntryResult) {
          console.log('received new result: ', messageInfo);
        }
      },
    });

    consumer.start();
  }, []);

  return results;
};

export const useMatrixCalculationTrigger = () => {
  const sns = useMemo(() => {
    return new AWS.SNS({
      accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
      sessionToken: process.env.REACT_APP_SESSION_TOKEN,
      region: process.env.REACT_APP_REGION,
    });
  }, []);

  const onTrigger = (input: MasterTrigger) => () => {
    sns
      .publish({
        TopicArn: process.env.REACT_APP_MASTER_SNS_TOPIC_ARN,
        Message: `{"multiplicand": "id": ${input.multiplicand.id}, "multiplier": ${input.multiplier.id}}`,
      })
      .promise();
  };

  return onTrigger;
};
