import { faker } from "@faker-js/faker";
import { mockUser } from "./auth.mocks";

export const mockUserId = faker.string.uuid();
export const mockGetUser = () => {
    return {
        ...(mockUser())
    };
}


