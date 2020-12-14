import { useEffect, useState, ChangeEvent, useMemo } from 'react';
import { Matrix, MatrixInput } from '../types/type.matrix';
import * as AWS from 'aws-sdk';
import { Consumer } from 'sqs-consumer';

export const useMatrixListener = () => {
  const [matrices, setMatrices] = useState<Matrix[]>([]);

  useEffect(() => {
    const sqs = new AWS.SQS({
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRECT_KEY_ID,
      sessionToken: process.env.SESSION_TOKEN,
      region: process.env.REGION,
    });

    console.log(process.env.SQS_URL);

    const consumer = Consumer.create({
      queueUrl: process.env.SQS_URL,
      sqs: sqs,
      handleMessage: async (message) => {
        const msg = JSON.parse(JSON.parse(JSON.stringify(message)).Body);

        const messageInfo = JSON.parse(msg.Message);

        if (messageInfo.type === 'new matrix generated') {
          const newMatrices = [...matrices];

          const matrix = messageInfo.matirx;
          newMatrices.push({
            id: matrix.id,
            rows: matrix.rows,
            columns: matrix.columns,
          });
          setMatrices(newMatrices);
        }
      },
    });

    consumer.start();
  }, []);

  return matrices;
};

export const useMatrixInput = () => {
  const [input, setInput] = useState<MatrixInput>({
    rows: undefined,
    columns: undefined,
  });

  const onInput = (type: string) => (event: ChangeEvent<HTMLInputElement>) =>
    setInput({ ...input, [type]: event.target.value });

  const resetInput = () => {
    setInput({ rows: undefined, columns: undefined });
  };

  return { values: input, onInput, resetInput };
};

export const useMatrixGeneratorTrigger = () => {
  const sns = useMemo(() => {
    return new AWS.SNS({
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRECT_KEY_ID,
      sessionToken: process.env.SESSION_TOKEN,
      region: process.env.REGION,
    });
  }, []);

  const onSubmit = (input: MatrixInput) => () => {
    sns
      .publish({
        TopicArn: process.env.SNS_TOPIC_ARN,
        Message: `{"rows": ${input.rows}, "columns": ${input.columns}}`,
      })
      .promise();
  };

  return onSubmit;
};
