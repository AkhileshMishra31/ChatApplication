import { faker } from "@faker-js/faker";

export const mockUserId = faker.string.uuid();
export const mockUserActivityStatusId = faker.string.uuid();
export const mockOtpRequestId = faker.string.uuid();
export const mockRefreshTokenId = faker.string.uuid();

export const signupInput = {
  username: "testUser",
  email: "test@example.com",
  password: "Password123!",
  phone_number: "123456789",
  country: "TestCountry",
};
export function mockUser() {
  return {
    id: mockUserId,
    username: "testUser",
    email: "test@example.com",
    password: "Password123!",
    phone_number: "1234567891",
    country: "TestCountry",
    createdAt: new Date(),
    updatedAt: new Date(),
    UserActivityStatus: {
      id: mockUserActivityStatusId,
      is_signup_email_verified: true,
      status: "ONLINE",
      userId: mockUserId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    OTPRequest: [
      {
        id: mockOtpRequestId,
        otp: faker.string.numeric(6),
        email: faker.internet.email(),
        userId: mockUserId,
        type: "SIGNUP",
        status: "PENDING",
        createdAt: new Date(),
        updatedAt: new Date(),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        verifiedAt: null,
      },
    ],
  };
}

export function mockUserforemailverification() {
  return {
    id: mockUserId,
    username: "testUser",
    email: "test@example.com",
    password: "Password123!",
    phone_number: "1234567891",
    country: "TestCountry",
    createdAt: new Date(),
    updatedAt: new Date(),
    UserActivityStatus: {
      id: mockUserActivityStatusId,
      is_signup_email_verified: false,
      status: "OFFLINE",
      userId: mockUserId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    OTPRequest: [
      {
        id: mockOtpRequestId,
        otp: faker.string.numeric(6),
        email: faker.internet.email(),
        userId: mockUserId,
        type: "SIGNUP",
        status: "PENDING",
        createdAt: new Date(),
        updatedAt: new Date(),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        verifiedAt: null,
      },
    ],
  };
}


export const LoginInput = {
  email: "test@example.com",
  password: "Password123!"
}

export function mockLoginUser() {
  return {
    id: mockUserId,
    username: "testUser",
    email: "test@example.com",
    password: "Password123!",
    phone_number: "1234567891",
    country: "TestCountry",
    createdAt: new Date(),
    updatedAt: new Date(),
    UserActivityStatus: {
      id: mockUserActivityStatusId,
      is_signup_email_verified: true,
      status: "ONLINE",
      userId: mockUserId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    OTPRequest: [
      {
        id: mockOtpRequestId,
        otp: faker.string.numeric(6),
        email: faker.internet.email(),
        userId: mockUserId,
        type: "SIGNUP",
        status: "VERIFIED",
        createdAt: new Date(),
        updatedAt: new Date(),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        verifiedAt: null,
      },
    ],
  };
}


export function mocklogoutSession() {
  return {
    id: mockRefreshTokenId,
    refresh_token: "refresh_token",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: mockUserId
  }
}


export function mockRefreshUser() {
  return {
    ...(mocklogoutSession())
  }
}


export const TokenUser = {
  id: "123",
  username: "testuser",
  email: "test@example.com",
};
