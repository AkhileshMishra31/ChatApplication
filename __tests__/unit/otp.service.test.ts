import { HTTP_CODES } from '../../src/common/StatusCodes';
import { otp_service } from "../../src/services/otp.service";
import { AppError } from "../../src/utils/AppError";
import { ERROR_MESSAGES } from "../../src/common/ErrorMessages";
import { user_service } from "../../src/services/user.service";
import { mockGetUser } from '../mocks/common.mocks';
import prisma from '../../src/utils/db';
import { generateOTP } from '../../src/utils/otp.utility';
import { user_activiy_service } from '../../src/services/user_activity.service';


jest.mock('../../src/services/user.service');
jest.mock('../../src/services/user_activity.service');

jest.mock('../../src/utils/otp.utility', () => ({
    generateOTP: jest.fn(),
}))

jest.mock('../../src/utils/db.ts', () => ({
    oTPRequest: {
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        findUnique: jest.fn(),
    }
}))

describe("otp_service", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("SendSignupOtp", () => {
        it("should send OTP successfully", async () => {
            const mockUser = mockGetUser();
            const mockOTP = { otp: "123456", userId: mockUser.id, email: mockUser.email, status: "PENDING" };

            (user_service.getUser as jest.Mock).mockResolvedValueOnce(mockUser);
            (prisma.oTPRequest.findFirst as jest.Mock).mockResolvedValue(null);
            (generateOTP as jest.Mock).mockReturnValue("123456");
            (prisma.oTPRequest.create as jest.Mock).mockResolvedValue(mockOTP);

            const result = await otp_service.SendSignupOtp(mockUser.id);

            expect(user_service.getUser).toHaveBeenCalledWith(mockUser.id);
            expect(prisma.oTPRequest.findFirst).toHaveBeenCalledWith({ where: { userId: mockUser.id, type: "SIGNUP" } });
            expect(generateOTP).toHaveBeenCalledWith(6);
            expect(prisma.oTPRequest.create).toHaveBeenCalledWith({
                data: {
                    otp: "123456",
                    email: mockUser.email,
                    userId: mockUser.id,
                    type: "SIGNUP",
                    status: "PENDING",
                    expiresAt: expect.any(Date),
                },
            });
            expect(result).toEqual(mockOTP);
        });

        it("should throw an error if the user is not found", async () => {
            (user_service.getUser as jest.Mock).mockResolvedValueOnce(null);
            await expect(otp_service.SendSignupOtp("user_id")).rejects.toThrow(
                new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_CODES.UNAUTHORIZED)
            );
            expect(user_service.getUser).toHaveBeenCalledWith("user_id");
        });

        it("should throw an error if an OTP already exists", async () => {
            const mockUser = mockGetUser();
            (user_service.getUser as jest.Mock).mockResolvedValueOnce(mockUser);
            (prisma.oTPRequest.findFirst as jest.Mock).mockResolvedValueOnce({ otp: "123456", userId: mockUser.id, email: mockUser.email, status: "PENDING" });
            await expect(otp_service.SendSignupOtp(mockUser.id)).rejects.toThrow(
                new AppError(ERROR_MESSAGES.OTP_CREATION_FAILED, HTTP_CODES.INTERNAL_SERVER_ERROR)
            );
            expect(prisma.oTPRequest.findFirst).toHaveBeenCalledWith({ where: { userId: mockUser.id, type: "SIGNUP" } });
        });
    })

    // describe("verifySignUpOTP", () => {
    //     it("should verify OTP successfully", async () => {
    //         const mockUser = mockGetUser();
    //         const mockOTP = { otp: "123456", userId: mockUser.id, email: mockUser.email, status: "PENDING", expiresAt: new Date(Date.now() + 10000) };

    //         (user_service.findUser as jest.Mock).mockResolvedValueOnce(mockUser);
    //         (prisma.oTPRequest.findFirst as jest.Mock).mockResolvedValueOnce(mockOTP);
    //         (prisma.oTPRequest.delete as jest.Mock).mockResolvedValueOnce({});
    //         (user_activiy_service.updateUserActivityForSignup as jest.Mock).mockResolvedValueOnce({});

    //         await expect(otp_service.verifySignUpOTP({ email: mockUser.email, otp: "123456" })).resolves.not.toThrow();

    //         expect(user_service.findUser).toHaveBeenCalledWith({ email: mockUser.email });
    //         expect(prisma.oTPRequest.findFirst).toHaveBeenCalledWith({ where: { userId: mockUser.id, type: "SIGNUP" } });
    //         expect(user_activiy_service.updateUserActivityForSignup).toHaveBeenCalledWith(mockUser.id);
    //         expect(prisma.oTPRequest.delete).toHaveBeenCalledWith({ where: { id: mockOTP.id } });
    //     });

    //     it("should throw an error if the user is not found", async () => {
    //         (user_service.findUser as jest.Mock).mockResolvedValueOnce(null);

    //         await expect(otp_service.verifySignUpOTP({ email: "test@example.com", otp: "123456" })).rejects.toThrow(
    //             new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_CODES.BAD_REQUEST)
    //         );
    //     });

    //     it("should throw an error if the user has already verified signup email", async () => {
    //         const mockUser = { ...mockGetUser(), UserActivityStatus: { is_signup_email_verified: true } };
    //         (user_service.findUser as jest.Mock).mockResolvedValueOnce(mockUser);

    //         await expect(otp_service.verifySignUpOTP({ email: mockUser.email, otp: "123456" })).rejects.toThrow(
    //             new AppError(ERROR_MESSAGES.SIGNUP_ALREADY, HTTP_CODES.CONFLICT)
    //         );
    //     });

    //     it("should throw an error if OTP is not found", async () => {
    //         const mockUser = mockGetUser();
    //         (user_service.findUser as jest.Mock).mockResolvedValueOnce(mockUser);
    //         (prisma.oTPRequest.findFirst as jest.Mock).mockResolvedValueOnce(null);

    //         await expect(otp_service.verifySignUpOTP({ email: mockUser.email, otp: "123456" })).rejects.toThrow(
    //             new AppError(ERROR_MESSAGES.OTP_NOT_FOUND, HTTP_CODES.BAD_REQUEST)
    //         );
    //     });

    //     it("should throw an error if OTP is expired", async () => {
    //         const mockUser = mockGetUser();
    //         const expiredOTP = { otp: "123456", userId: mockUser.id, email: mockUser.email, status: "PENDING", expiresAt: new Date(Date.now() - 10000) };
    //         (user_service.findUser as jest.Mock).mockResolvedValueOnce(mockUser);
    //         (prisma.oTPRequest.findFirst as jest.Mock).mockResolvedValueOnce(expiredOTP);

    //         await expect(otp_service.verifySignUpOTP({ email: mockUser.email, otp: "123456" })).rejects.toThrow(
    //             new AppError(ERROR_MESSAGES.OTP_EXPIRED, HTTP_CODES.BAD_REQUEST)
    //         );
    //     });

    //     it("should throw an error if OTP is incorrect", async () => {
    //         const mockUser = mockGetUser();
    //         const incorrectOTP = { otp: "999999", userId: mockUser.id, email: mockUser.email, status: "PENDING", expiresAt: new Date(Date.now() + 10000) };
    //         (user_service.findUser as jest.Mock).mockResolvedValueOnce(mockUser);
    //         (prisma.oTPRequest.findFirst as jest.Mock).mockResolvedValueOnce(incorrectOTP);

    //         await expect(otp_service.verifySignUpOTP({ email: mockUser.email, otp: "123456" })).rejects.toThrow(
    //             new AppError(ERROR_MESSAGES.INVALID_OTP, HTTP_CODES.BAD_REQUEST)
    //         );
    //     });

    // });
});