// import { Schema, Repository } from "redis-om";
// import redisClient from "..";


// const permissionSchema = new Schema(
//   "PermissionSet",
//   {
//     admin_id: { type: "string" },
//     role: { type: "string" },
//     permissions: { type: "string" }
//   },
//   {
//     dataStructure: "JSON"
//   }
// );

// const permissionSetRepository: Repository = new Repository(permissionSchema, redisClient);

// (async () => {
//   await permissionSetRepository.dropIndex();
//   await permissionSetRepository.createIndex();
// })();

// export { permissionSetRepository };
