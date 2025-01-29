import { comparePassword, generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../src/utils/auth.utility';
import { HTTP_CODES } from '../../src/common/StatusCodes';
import { auth_service } from "../../src/services/auth.service";
import { user_service } from "../../src/services/user.service";
import { otp_service } from "../../src/services/otp.service";
import { AppError } from "../../src/utils/AppError";
import { ERROR_MESSAGES } from "../../src/common/ErrorMessages";
import jwt from "jsonwebtoken";
import { user_session_service } from '../../src/services/user_session.service';
import { LoginInput, mockLoginUser, mocklogoutSession, mockUser, mockUserforemailverification, mockUserId, signupInput } from '../mocks/auth.mocks';

jest.mock('../../src/services/user.service');
jest.mock('../../src/services/otp.service');
jest.mock('../../src/services/user_session.service');
jest.mock('../../src/utils/auth.utility');

jest.mock('../../src/utils/auth.utility', () => ({
    comparePassword: jest.fn(),
    generateAccessToken: jest.fn(),
    generateRefreshToken: jest.fn(),
}))


describe('auth_service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("signup", () => {
        it("should create user and send OTP successfully", async () => {
            (user_service.findUser as jest.Mock)
                .mockResolvedValueOnce(null)
                .mockResolvedValueOnce(null);

            (user_service.signUpUser as jest.Mock).mockResolvedValueOnce(mockUser());
            (otp_service.SendSignupOtp as jest.Mock).mockResolvedValueOnce({
                expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
                otp: "123456",
                email: mockUser().email,
                userId: mockUser().id,
                type: "SIGNUP",
                status: "PENDING",
            });
            const result = await auth_service.signup(signupInput);

            expect(user_service.findUser).toHaveBeenNthCalledWith(1, { email: signupInput.email });
            expect(user_service.findUser).toHaveBeenNthCalledWith(2, { phone_number: signupInput.phone_number });
            expect(user_service.signUpUser).toHaveBeenCalledWith(expect.objectContaining(signupInput));
            expect(otp_service.SendSignupOtp).toHaveBeenCalledWith(mockUser().id);

            expect(result).toHaveProperty("otp_expiry_time");
        });

        it("should throw error if user creation fails", async () => {
            (user_service.findUser as jest.Mock).mockResolvedValueOnce(null);
            (user_service.findUser as jest.Mock).mockResolvedValueOnce(null);
            (user_service.signUpUser as jest.Mock).mockResolvedValueOnce(null);

            await expect(auth_service.signup(signupInput)).rejects.toThrow(
                new AppError(ERROR_MESSAGES.USER_CREATION_FAILED, HTTP_CODES.INTERNAL_SERVER_ERROR)
            );

            expect(user_service.findUser).toHaveBeenNthCalledWith(1, { email: signupInput.email });
            expect(user_service.findUser).toHaveBeenNthCalledWith(2, { phone_number: signupInput.phone_number });
            expect(user_service.signUpUser).toHaveBeenCalledWith(expect.objectContaining(signupInput));
        });

        it("should throw error if email already exists ", async () => {
            (user_service.findUser as jest.Mock).mockResolvedValueOnce(mockUser());

            await expect(auth_service.signup(signupInput)).rejects.toThrow(
                new AppError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS, HTTP_CODES.BAD_REQUEST)
            );
            expect(user_service.findUser).toHaveBeenNthCalledWith(1, { email: signupInput.email });
        });

        it("should throw error if phone number already exists", async () => {
            (user_service.findUser as jest.Mock).mockResolvedValueOnce(null);
            (user_service.findUser as jest.Mock).mockResolvedValueOnce(mockUser());

            await expect(auth_service.signup(signupInput)).rejects.toThrow(
                new AppError(ERROR_MESSAGES.PHONE_ALREADY_EXISTS, HTTP_CODES.BAD_REQUEST)
            )
            expect(user_service.findUser).toHaveBeenNthCalledWith(1, { email: signupInput.email });
        });

        it("should delete OTP and user if email exists and is not verified", async () => {
            const mockUser = mockUserforemailverification();
            (user_service.findUser as jest.Mock)
                .mockResolvedValueOnce(mockUser)
                .mockResolvedValueOnce(null);

            (otp_service.deleteSignUpOtp as jest.Mock).mockResolvedValueOnce(true);
            (user_service.deleteUser as jest.Mock).mockResolvedValueOnce(true);

            (otp_service.SendSignupOtp as jest.Mock).mockResolvedValueOnce({
                expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
                otp: "123456",
                email: mockUser.email,
                userId: mockUser.id,
                type: "SIGNUP",
                status: "PENDING",
            });

            const mockCreatedUser = { ...mockUser, id: "newUserId" };
            (user_service.signUpUser as jest.Mock).mockResolvedValueOnce(mockCreatedUser);

            const result = await auth_service.signup(signupInput);

            expect(user_service.findUser).toHaveBeenNthCalledWith(1, { email: signupInput.email });

            expect(otp_service.deleteSignUpOtp).toHaveBeenNthCalledWith(1, mockUser.id);
            expect(user_service.deleteUser).toHaveBeenNthCalledWith(1, mockUser.id);

            expect(user_service.signUpUser).toHaveBeenCalledWith(expect.objectContaining(signupInput));

            expect(otp_service.SendSignupOtp).toHaveBeenCalledWith(mockCreatedUser.id);

            expect(result).toHaveProperty("otp_expiry_time");
        });
    });

    describe("login", () => {
        it("should login user successfully", async () => {
            const mockUser = mockLoginUser();
            (user_service.findUser as jest.Mock).mockResolvedValueOnce(mockUser);
            (comparePassword as jest.Mock).mockReturnValue(true);
            (generateAccessToken as jest.Mock).mockReturnValue("access_token");
            (generateRefreshToken as jest.Mock).mockReturnValue("refresh_token");
            (user_session_service.createUserSession as jest.Mock).mockResolvedValueOnce({});
            const result = await auth_service.login({ email: LoginInput.email, password: LoginInput.password });


            expect(user_service.findUser).toHaveBeenCalledWith({ email: LoginInput.email });
            expect(comparePassword).toHaveBeenCalledWith(LoginInput.password, mockUser.password);
            expect(generateAccessToken).toHaveBeenCalledWith(mockUser);
            expect(generateRefreshToken).toHaveBeenCalledWith(mockUser);
            expect(user_session_service.createUserSession).toHaveBeenCalledWith(mockUser.id, "refresh_token");
            expect(result).toHaveProperty("access_token");
            expect(result).toHaveProperty("refresh_token");
        });
        it("should throw error if user is not found", async () => {
            (user_service.findUser as jest.Mock).mockResolvedValueOnce(null);
            await expect(auth_service.login({ email: LoginInput.email, password: LoginInput.password })).rejects.toThrow(
                new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_CODES.UNAUTHORIZED)
            );
            expect(user_service.findUser).toHaveBeenCalledWith({ email: LoginInput.email });
        })
        it("should throw error if password is incorrect", async () => {
            const mockUser = mockLoginUser();
            (user_service.findUser as jest.Mock).mockResolvedValueOnce(mockUser);
            (comparePassword as jest.Mock).mockReturnValue(false);
            await expect(auth_service.login({ email: LoginInput.email, password: LoginInput.password })).rejects.toThrow(
                new AppError(ERROR_MESSAGES.INVALID_PASSWORD, HTTP_CODES.UNAUTHORIZED)
            );
            expect(user_service.findUser).toHaveBeenCalledWith({ email: LoginInput.email });
            expect(comparePassword).toHaveBeenCalledWith(LoginInput.password, mockUser.password);
        })
        it("should throw error if user is not verified", async () => {
            let mockUser: any = mockLoginUser();
            mockUser = {
                ...mockUser,
                UserActivityStatus: {
                    ...mockUser.UserActivityStatus,
                    is_signup_email_verified: false
                }
            };
            (user_service.findUser as jest.Mock).mockResolvedValueOnce(mockUser);

            await expect(auth_service.login({ email: LoginInput.email, password: LoginInput.password })).rejects.toThrow(
                new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_CODES.UNAUTHORIZED)
            );
            expect(user_service.findUser).toHaveBeenCalledWith({ email: LoginInput.email });

        })
        it("should handle unexpected error from findUser", async () => {
            (user_service.findUser as jest.Mock).mockRejectedValueOnce(new Error("Unexpected error"));
            await expect(auth_service.login({ email: LoginInput.email, password: LoginInput.password })).rejects.toThrow(
                new Error("Unexpected error")
            );
        });

        it("should handle failure in creating user session", async () => {
            const mockUser = mockLoginUser();
            (user_service.findUser as jest.Mock).mockResolvedValueOnce(mockUser);
            (comparePassword as jest.Mock).mockReturnValue(true);
            (generateAccessToken as jest.Mock).mockReturnValue("access_token");
            (generateRefreshToken as jest.Mock).mockReturnValue("refresh_token");
            (user_session_service.createUserSession as jest.Mock).mockRejectedValueOnce(new Error("Session creation failed"));

            await expect(auth_service.login({ email: LoginInput.email, password: LoginInput.password })).rejects.toThrow(
                new Error("Session creation failed")
            );

            expect(user_service.findUser).toHaveBeenCalledWith({ email: LoginInput.email });
            expect(comparePassword).toHaveBeenCalledWith(LoginInput.password, mockUser.password);
            expect(generateAccessToken).toHaveBeenCalledWith(mockUser);
            expect(generateRefreshToken).toHaveBeenCalledWith(mockUser);
            expect(user_session_service.createUserSession).toHaveBeenCalledWith(mockUser.id, "refresh_token");
        });
    });

    describe("logout", () => {
        it("should logout user successfully", async () => {
            const mockUser = mocklogoutSession();
            (user_session_service.getUserSession as jest.Mock).mockResolvedValueOnce(mockUser);
            (user_session_service.deleteUserSession as jest.Mock).mockResolvedValueOnce(true);
            const result = expect(await auth_service.logout("refresh_token"))


            expect(user_session_service.getUserSession).toHaveBeenCalledWith("refresh_token");
            expect(user_session_service.deleteUserSession).toHaveBeenCalledWith(mockUser);
            expect(result).toHaveProperty("message");

        });
        it("should handle failure in deleting user session", async () => {

        });
    });
});