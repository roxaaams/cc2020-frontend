import { useEffect, useState, useMemo } from 'react';
import * as AWS from 'aws-sdk';
import { MasterTrigger } from '../types/type.master';

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
    console.log(
      `{"multiplicand": {"id": "${input.multiplicand.id}"}, "multiplier": {"id": "${input.multiplier.id}"}}`
    );

    sns
      .publish({
        TopicArn: process.env.REACT_APP_MASTER_SNS_TOPIC_ARN,
        Message: `{"multiplicand": {"id": "${input.multiplicand.id}"}, "multiplier": {"id": "${input.multiplier.id}"}}`,
      })
      .promise();

    console.log('sent');
  };

  return onTrigger;
};
