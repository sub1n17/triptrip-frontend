import { server } from '@/commons/mocks';

beforeAll(() => server.listen());
afterAll(() => server.close());
