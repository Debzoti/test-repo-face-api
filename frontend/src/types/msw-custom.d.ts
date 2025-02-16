declare module 'msw' {
    export const rest: {
      get: any;
      post: any;
      put: any;
      delete: any;
      // add more methods if needed
    };
    export const setupWorker: any;
  }
  