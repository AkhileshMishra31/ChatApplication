// import { otp_service } from "../../src/services/otp.service";
// import prisma from "../../src/utils/db";
// import { AppError } from "../../src/utils/AppError";
// import { ERROR_MESSAGES } from "../../src/common/ErrorMessages";
// import { HTTP_CODES } from "../../src/common/StatusCodes";
// import { user_service } from "../../src/services/user.service";
// import { generateOTP } from "../../src/utils/otp.utility";
// import { user_activiy_service } from "../../src/services/user_activity.service";

// jest.mock("../utils/db", () => ({
//     oTPRequest: {
//         findFirst: jest.fn(),
//         create: jest.fn(),
//         deleteMany: jest.fn(),
//         delete: jest.fn(),
//         update: jest.fn(),
//     },
// }));

// jest.mock("../services/user.service", () => ({
//     getUser: jest.fn(),
//     findUser: jest.fn(),
// }));

// jest.mock("../services/user_activity.service", () => ({
//     updateUserActivityForSignup: jest.fn(),
// }));

// jest.mock("../utils/otp.utility", () => ({
//     generateOTP: jest.fn(),
// }));

// describe("OTP Service", () => {
//     afterEach(() => {
//         jest.clearAllMocks();
//     });

//     describe("SendSignupOtp", () => {
//         it("should throw an error if user is not found", async () => {
//             jest.spyOn(user_service, "getUser").mockResolvedValue(null);

//             await expect(otp_service.SendSignupOtp("invalid_user_id")).rejects.toThrow(
//                 new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_CODES.BAD_REQUEST)
//             );
//         });

//         // Test case when OTP already exists for the user
//         it("should throw an error if OTP already exists for the user", async () => {
//             jest.spyOn(user_service, "getUser").mockResolvedValue({
//                 id: "valid_user_id",
//                 username: "testuser",
//                 email: "test@example.com",
//                 password: "hashed_password",
//                 phone_number: "1234567890",
//                 profile_picture: null,
//                 country: "Country Name",
//                 createdAt: new Date(),
//                 updatedAt: new Date(),
//             });
//             jest.spyOn(prisma.oTPRequest, "findFirst").mockResolvedValue({ id: "existing_otp_id" });

//             await expect(otp_service.SendSignupOtp("valid_user_id")).rejects.toThrow(
//                 new AppError(ERROR_MESSAGES.OTP_CREATION_FAILED, HTTP_CODES.INTERNAL_SERVER_ERROR)
//             );
//         });

//         it("should create and return a new OTP", async () => {
//             jest.spyOn(user_service, "getUser").mockResolvedValue({
//                 id: "valid_user_id",
//                 username: "testuser",
//                 email: "test@example.com",
//                 password: "hashed_password",
//                 phone_number: "1234567890",
//                 profile_picture: null,
//                 country: "Country Name",
//                 createdAt: new Date(),
//                 updatedAt: new Date(),
//             });

//             // Mock prisma.oTPRequest.findFirst to return null (no existing OTP)
//             jest.spyOn(prisma.oTPRequest, "findFirst").mockResolvedValue(null);

//             jest.spyOn(generateOTP, 'generateOTP').mockReturnValue('123456');
//             // Mock prisma.oTPRequest.create to resolve with a new OTP record
//             jest.spyOn(prisma.oTPRequest, "create").mockResolvedValue({
//                 id: "new_otp_id",
//                 otp: "123456",
//                 email: "test@example.com",
//                 userId: "valid_user_id",
//                 type: "SIGNUP",
//                 status: "PENDING",
//                 expiresAt: expect.any(Date)
//             });

//             const result = await otp_service.SendSignupOtp("valid_user_id");

//             // Check if result is equal to the mock returned value
//             expect(result).toEqual({
//                 id: "new_otp_id",
//                 otp: "123456",
//                 email: "test@example.com",
//                 userId: "valid_user_id",
//                 type: "SIGNUP",
//                 status: "PENDING",
//                 expiresAt: expect.any(Date),
//             });

//             // Ensure that the create method was called with correct parameters
//             expect(prisma.oTPRequest.create).toHaveBeenCalledWith(
//                 expect.objectContaining({
//                     data: expect.objectContaining({
//                         otp: "123456",
//                         email: "test@example.com",
//                         userId: "valid_user_id",
//                         type: "SIGNUP",
//                         status: "PENDING",
//                     }),
//                 })
//             );
//         });
//     });

//     describe("deleteSignUpOtp", () => {
//         // it("should throw an error if user is not found", async () => {
//         //   jest.spyOn(user_service, "getUser").mockResolvedValue(null);

//         //   await expect(otp_service.deleteSignUpOtp("invalid_user_id")).rejects.toThrow(
//         //     new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_CODES.BAD_REQUEST)
//         //   );
//         // });

//         // it("should delete all OTPs for the user", async () => {
//         //   jest.spyOn(user_service, "getUser").mockResolvedValue({ id: "user_id" });
//         //   jest.spyOn(prisma.oTPRequest, "deleteMany").mockResolvedValue({ count: 1 });

//         //   const result = await otp_service.deleteSignUpOtp("valid_user_id");

//         //   expect(result).toEqual({ count: 1 });
//         //   expect(prisma.oTPRequest.deleteMany).toHaveBeenCalledWith(
//         //     expect.objectContaining({ where: { userId: "valid_user_id", type: "SIGNUP" } })
//         //   );
//         // });
//     });

//     describe("verifySignUpOTP", () => {
//         // it("should throw an error if user is not found", async () => {
//         //   jest.spyOn(user_service, "findUser").mockResolvedValue(null);

//         //   await expect(
//         //     otp_service.verifySignUpOTP({ email: "test@example.com", otp: "123456" })
//         //   ).rejects.toThrow(new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_CODES.BAD_REQUEST));
//         // });

//         // it("should throw an error if user is already verified", async () => {
//         //   jest.spyOn(user_service, "findUser").mockResolvedValue({
//         //     UserActivityStatus: { is_signup_email_verified: true },
//         //   });

//         //   await expect(
//         //     otp_service.verifySignUpOTP({ email: "test@example.com", otp: "123456" })
//         //   ).rejects.toThrow(new AppError(ERROR_MESSAGES.SIGNUP_ALREADY, HTTP_CODES.CONFLICT));
//         // });

//         // it("should throw an error if OTP is expired or invalid", async () => {
//         //   jest.spyOn(user_service, "findUser").mockResolvedValue({
//         //     id: "user_id",
//         //     UserActivityStatus: { is_signup_email_verified: false },
//         //   });

//         //   jest.spyOn(prisma.oTPRequest, "findFirst").mockResolvedValue({
//         //     id: "otp_id",
//         //     otp: "wrong_otp",
//         //     expiresAt: new Date(Date.now() - 60000),
//         //   });

//         //   await expect(
//         //     otp_service.verifySignUpOTP({ email: "test@example.com", otp: "123456" })
//         //   ).rejects.toThrow(new AppError(ERROR_MESSAGES.OTP_EXPIRED, HTTP_CODES.BAD_REQUEST));
//         // });

//         // it("should verify OTP and update user activity", async () => {
//         //   jest.spyOn(user_service, "findUser").mockResolvedValue({
//         //     id: "user_id",
//         //     UserActivityStatus: { is_signup_email_verified: false },
//         //   });

//         //   jest.spyOn(prisma.oTPRequest, "findFirst").mockResolvedValue({
//         //     id: "otp_id",
//         //     otp: "123456",
//         //     expiresAt: new Date(Date.now() + 60000),
//         //   });

//         //   jest.spyOn(user_activiy_service, "updateUserActivityForSignup").mockResolvedValue({});
//         //   jest.spyOn(prisma.oTPRequest, "delete").mockResolvedValue({});

//         //   await otp_service.verifySignUpOTP({ email: "test@example.com", otp: "123456" });

//         //   expect(user_activiy_service.updateUserActivityForSignup).toHaveBeenCalledWith("user_id");
//         //   expect(prisma.oTPRequest.delete).toHaveBeenCalledWith(
//         //     expect.objectContaining({ where: { id: "otp_id" } })
//         //   );
//         // });
//     });

//     describe("resendSignUpOTP", () => {
//         // it("should throw an error if user is not found", async () => {
//         //   jest.spyOn(user_service, "findUser").mockResolvedValue(null);

//         //   await expect(otp_service.resendSignUpOTP({ email: "test@example.com" })).rejects.toThrow(
//         //     new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_CODES.BAD_REQUEST)
//         //   );
//         // });

//         // it("should resend a new OTP", async () => {
//         //   jest.spyOn(user_service, "findUser").mockResolvedValue({
//         //     id: "user_id",
//         //     UserActivityStatus: { is_signup_email_verified: false },
//         //   });

//         //   jest.spyOn(prisma.oTPRequest, "findFirst").mockResolvedValue({ id: "otp_id" });
//         //   jest.spyOn(generateOTP, "default").mockReturnValue("654321");
//         //   jest.spyOn(prisma.oTPRequest, "update").mockResolvedValue({
//         //     expiresAt: new Date(Date.now() + 60000),
//         //   });

//         //   const result = await otp_service.resendSignUpOTP({ email: "test@example.com" });

//         //   expect(result).toHaveProperty("otp_expiry_time");
//         //   expect(prisma.oTPRequest.update).toHaveBeenCalledWith(
//         //     expect.objectContaining({ where: { id: "otp_id" }, data: expect.anything() })
//         //   );
//         // });
//     });
// });
