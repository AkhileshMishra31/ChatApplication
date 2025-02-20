// const { default: prisma } = require("../src/utils/db");

const CreateSuperAdmin = async () => {
    console.log("running with superadmin",process.env.DEFAULT_ADMIN_EMAIL,process.env.DEFAULT_ADMIN_PASSWORD)
}

CreateSuperAdmin();