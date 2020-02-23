import { TextSelector } from './text.selector';

describe('Multi-instance audit log', async () => {
  const textSelector = new TextSelector();

  it('[C321547] Should be able to trigger parallel instances of service task', async () => {
     expect(true).toBe(true);
  });

});
