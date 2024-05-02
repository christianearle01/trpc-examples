import { procedure, router } from "../trpc";
import { z } from "zod";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export const userRouter = router({
    getUsers: procedure.query(async (opts) => {
        return await prisma.user.findMany();
    }),
    addUser: procedure.input(z.object({ name: z.string(), race: z.string() }))
    .mutation(async (opts) => {
        const { input } = opts;
        await prisma.user.create({
            data: {
                name: input.name,
                race: input.race
            }
        })
    })
});