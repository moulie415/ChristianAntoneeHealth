import sleep from './sleep';

describe('sleep', () => {
  it('setTimeout should be called', async () => {
    jest.spyOn(globalThis, 'setTimeout');
    await sleep(1);
    expect(setTimeout).toHaveBeenCalled();
  });
});
