// /* eslint-env worker */
// // eslint-disable-next-line no-restricted-globals
// const ctx: Worker = self as any;

// // Post data to parent thread
// ctx.postMessage({ foo: 'foo' });

// // Respond to message from parent thread
// ctx.addEventListener('message', (event) => console.log(event));
// ctx.addEventListener('test', (event) => console.log('test'));

// export {};

const someSillyFunction = async () => {
  // eslint-disable-next-line no-return-await
  return await Promise.resolve(42);
};

const workerApi = {
  someSillyFunction,
};
