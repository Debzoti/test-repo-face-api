// import { rest, setupWorker } from 'msw';
// import type { RestRequest, ResponseComposition, RestContext } from 'msw'

// export const handlers = [
//   rest.post('http://localhost:3001/api/face-analysis', (req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
//     return res(ctx.json({ analysisId: 'mock-id-1234' }));
//   }),
//   rest.post('http://localhost:3001/api/gemini', (req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
//     return res(ctx.json({ response: 'This is a mock Gemini advice response.' }));
//   }),
// ];



import * as msw from 'msw';

//import http from 'msw'; // Using 'as any' until we know the correct types

export const handlers = [
  msw.http?.post('http://localhost:3001/api/face-analysis', (req: any, res: any, ctx: any) => {
    return res(ctx.json({ analysisId: 'mock-id-1234' }));
  }),
  http?.post('http://localhost:3001/api/gemini', (req: any, res: any, ctx: any) => {
    return res(ctx.json({ response: 'This is a mock Gemini advice response.' }));
  }),
];
