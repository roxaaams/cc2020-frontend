import { useEffect, useState, ChangeEvent, useMemo } from 'react';
import { Matrix, MatrixInput } from '../types/type.matrix';
import * as AWS from 'aws-sdk';
import { Consumer } from 'sqs-consumer';
import { MessageType } from '../types/type.message';
import { EntryResult, ResultMatrix } from '../types/type.result';

export const useMatrixListener = () => {
  const [matrices, setMatrices] = useState<Matrix[]>(() => []);
  const [relevantCalculations, setRelevantCalculations] = useState<
    EntryResult[]
  >(() => []);
  const [resultMatrices, setResultMatrices] = useState<ResultMatrix[]>(
    () => []
  );
  const [calculationCache, setCalculationCache] = useState<
    Map<string, Map<string, number>>
  >(() => new Map());

  const [multiplicationId, setMultiplicationId] = useState<string>(() => '');

  const setMultiplicationListener = (id: string) => {
    setMultiplicationId(id);
  };

  const sqs = useMemo(
    () =>
      new AWS.SQS({
        accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
        sessionToken: process.env.REACT_APP_SESSION_TOKEN,
        region: process.env.REACT_APP_REGION,
      }),
    []
  );

  const cachedMultiplicationId = useMemo(() => multiplicationId, [
    multiplicationId,
  ]);

  useEffect(() => {
    let cachedM: Matrix[] = [];
    let cachedRelevantCalculations: EntryResult[] = [];
    let chachedCachedResults: Map<string, Map<string, number>> = new Map();

    const consumer = Consumer.create({
      queueUrl: process.env.REACT_APP_SQS_URL,
      sqs: sqs,
      handleMessage: async (message) => {
        const msg = JSON.parse(`${message.Body}`).Message;

        const msgString = `${msg}`.replaceAll("'", '"');

        let messageInfo = JSON.parse(msgString);

        if (
          messageInfo.result &&
          messageInfo.result.type === MessageType.EntryResult
        )
          messageInfo = messageInfo.result;

        if (messageInfo.type) {
          console.log('received new result: ', messageInfo.type);

          switch (messageInfo.type) {
            case MessageType.ResultMatrix:
              let newResultM = [...(resultMatrices || [])];
              newResultM.push({
                result_matrix_id: messageInfo.result_matrix_id,
                multiplicand_matrix_id: messageInfo.mmultiplicand_matrix_id,
                multiplier_matrix_id: messageInfo.multiplier_matrix_id,
              });
              setResultMatrices(newResultM);
              break;
            case MessageType.EntryResult:
              if (messageInfo.id === cachedMultiplicationId) {
                console.log('hit!');
                cachedRelevantCalculations.push({
                  column_index: messageInfo.column_index,
                  row_index: messageInfo.row_index,
                  value: messageInfo.value,
                });
                setRelevantCalculations([
                  ...(cachedRelevantCalculations || []),
                ]);
              } else {
                let arr = chachedCachedResults.get(messageInfo.id) || [];
                let map = chachedCachedResults.get(messageInfo.id) || new Map();
                map.set(
                  `${messageInfo.row_index}-${messageInfo.column_index}`,
                  messageInfo.value
                );
                chachedCachedResults.set(messageInfo.id, map);
                setCalculationCache(new Map(chachedCachedResults));
              }
              break;
            case MessageType.NewMatrix:
              const matrix = messageInfo.matirx;
              console.log('matrix:', matrix);
              cachedM.push(matrix);
              setMatrices([...(cachedM || [])]);
              break;
          }
        }
      },
    });

    consumer.start();
  }, []);

  return {
    availableMatrices: matrices,
    calculationCache,
    resultMatrices,
  };
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
      accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
      sessionToken: process.env.REACT_APP_SESSION_TOKEN,
      region: process.env.REACT_APP_REGION,
    });
  }, []);

  const onSubmit = (input: MatrixInput) => () => {
    sns
      .publish({
        TopicArn: process.env.REACT_APP_TOPIC_ARN,
        Message: `{"rows": ${input.rows}, "columns": ${input.columns}}`,
      })
      .promise();
  };

  return onSubmit;
};
