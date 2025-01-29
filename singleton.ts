
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";
import prisma from "./src/utils/db";
import { PrismaClient } from "@prisma/client";

jest.mock("../../../prisma/prisma", () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(mockedPrismaClient);
});

export const mockedPrismaClient =
  prisma as unknown as DeepMockProxy<PrismaClient>;
