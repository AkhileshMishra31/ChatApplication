export interface IGroup{
   name:string,
   description:string,
   profile_picture?:string
}


// model Group {
//     id              String   @id @default(uuid())
//     name            String
//     description     String?
//     profile_picture String?
//     createdById     String
//     createdAt       DateTime @default(now())
//     updatedAt       DateTime @updatedAt
  
//     createdBy    User               @relation(fields: [createdById], references: [id], onDelete: Cascade)
//     participants GroupParticipant[]
//     chat         Chat[]
//   }