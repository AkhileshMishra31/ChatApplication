import { HTTP_CODES } from '../../src/common/StatusCodes';
import { auth_service } from "../../src/services/auth.service";
import { otp_service } from "../../src/services/otp.service";
import { AppError } from "../../src/utils/AppError";
import { ERROR_MESSAGES } from "../../src/common/ErrorMessages";
import { user_activiy_service } from "../../src/services/user_activity.service";
import { user_service } from "../../src/services/user.service";


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

          
            // await otp_service.SendSignupOtp("user_id")
            // expect(user_service.getUser).toHaveBeenCalledWith({ email: signupInput.email });

        });
    })
})