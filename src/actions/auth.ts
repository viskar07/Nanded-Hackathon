"use server"

import { client } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

export const onAuthenticatedUser = async () => {
    try {
        const clerk = await currentUser()

        if (!clerk) {
            return { status: 401, message: "Unauthorized" } // Corrected status code
        }

        const user = await client.user.findUnique({
            where: {
                clerkId: clerk.id,
            },
            select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
                role: true,
                institutions: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        })

        if (user) {
            return {
                status: 200,
                id: user.id,
                email: user.email,
                role: user.role,
                image: clerk.imageUrl,
                username: `${user.firstname} ${user.lastname}`,
                institutionIds: user.institutions.map((inst) => inst.id),
            }
        }

        return {
            status: 404,
            message: "User not found",
        }
    } catch (error) {
        console.error("Error:", error) // Added logging
        return {
            status: 500,
            message: "Internal server error", // More informative message
        }
    }
}

export const onSignUpUser = async (data: {
    firstname: string
    lastname: string
    clerkId: string
    email:string
}) => {
    try {
        
       

        const createdUser = await client.user.create({
            data,
        })


        if (createdUser) {
            return {
                status: 200,
                message: "User successfully created",
                id: createdUser.id,
            }
        }

        return {
            status: 400,
            message: "User could not be created! Try again",
        }
    } catch (error) {

        return {
            status: 500,
            message: "Oops! something went wrong. Try again",
        }
    }
}

export const onSignInUser = async (clerkId: string) => {
    try {
        const loggedInUser = await client.user.findUnique({
            where: {
                clerkId: clerkId,
            },
            select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
                role: true,
                institutions: {
                    select: {
                        id: true,
                        name: true,
                    },
                    take: 1,
                    orderBy: {
                        createdAt: "asc",
                    },
                },
            },
        })

        if (loggedInUser) {
            if (loggedInUser.institutions.length > 0) {
                return {
                    status: 207,
                    id: loggedInUser.id,
                    institutionId: loggedInUser.institutions[0],
                    role: loggedInUser.role,
                }
            }

            return {
                status: 200,
                message: "User successfully logged in",
                id: loggedInUser.id,
            }
        }

        return {
            status: 404,
            message: "User not found",
        }
    } catch (error) {
        console.error("Error during signin:", error)
        return {
            status: 500,
            message: "Oops! something went wrong. Try again",
        }
    }
}
