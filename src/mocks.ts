import { rest, setupWorker } from 'msw';
import { nanoid } from 'nanoid';

const min = 5;
const max = 10;

const minSteps = 10;
const maxSteps = 50;

const range = (start: number, end: number) => parseInt(
  `${(Math.random() * (end - start)) + start}`,
  10,
);

const timer = (() => {
  let steps = 0;
  let step = 0;
  let interval: NodeJS.Timeout;
  const processFunc = () => {
    if (step >= steps) {
      step = steps;
      if (interval) {
        clearInterval(interval);
      }
    } else {
      step += 1;
    }
  };
  const start = () => {
    steps = range(minSteps, maxSteps);
    step = 0;
    interval = setInterval(processFunc, 500);
  };
  return {
    start,
    get steps() { return steps; },
    get step() { return step; },
  };
})();

export const handlers = [
  rest.get('/ids', (_, res, ctx) => {
    const ids = new Array(range(min, max))
      .fill(0)
      .map(() => nanoid());
    return res(
      ctx.status(200),
      ctx.json(ids),
    );
  }),
  rest.post('/submit', (_, res, ctx) => {
    timer.start();
    return res(
      ctx.status(200),
    );
  }),
  rest.get('/progress', (_, res, ctx) => res(
    ctx.status(200),
    ctx.json({
      currentStep: timer.step,
      totalSteps: timer.steps,
    }),
  )),
];

export const server = setupWorker(...handlers);
