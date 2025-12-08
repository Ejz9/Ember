import { betterAuth, type BetterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import mongoose from 'mongoose';
import {head, put} from "@vercel/blob";

export let auth: BetterAuth;

export function initAuth() {
    const config = useRuntimeConfig();
    auth = betterAuth({
        database: mongodbAdapter(mongoose.connection.db, {
            client: mongoose.connection.getClient(),
            collectionsPrefix: "better-auth"
        }),
        socialProviders: {
            github: {
                clientId: config.GITHUB_CLIENT_ID as string,
                clientSecret: config.GITHUB_CLIENT_SECRET as string,
                overrideUserInfoOnSignIn: true,
                mapProfileToUser: (profile) => {
                    return {
                        username: profile.login
                    }
                }
            },
        },
        databaseHooks: {
            user: {
                create: {
                    before: async (user) => {
                        user.image = await downloadAndSaveAvatar(user.image);

                        const usersCollection = mongoose.connection.db.collection('users');
                        const userCount = await usersCollection.countDocuments();
                        if (userCount === 0) {
                            (user as any).isAdmin = true;
                        }
                        return { data: user };
                    }
                },
                update: {
                    before: async (updates, user) => {
                        const newAvatar = await downloadAndSaveAvatar(updates.image);
                        if (newAvatar) {
                            updates.image = newAvatar;
                        } else {
                            delete updates.image;
                        }
                        return { data: updates };
                    }
                }
            }
        },
        user: {
            additionalFields: {
                username: {
                    type: "string",
                    required: true
                },
                isAdmin: {
                    type: "boolean",
                    default: false
                }
            }
        },
    });
    return auth;
}

/**
 * Downloads an avatar from a URL, saves it to storage, and returns the local path.
 * This function will overwrite any existing file with the same name.
 * @param imageUrl The remote URL of the image to download.
 * @returns The local path to the saved image, or null if the process fails or the URL is invalid.
 */
async function downloadAndSaveAvatar(imageUrl: string | null | undefined): Promise<string | null> {
    // Only process valid remote URLs.
    if (!imageUrl || !(imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
        return null;
    }

    try {
        const imageBlob = await $fetch(imageUrl, { responseType: 'blob' });
        const imageBuffer = Buffer.from(await imageBlob.arrayBuffer());

        // Generate a unique filename from the GitHub user ID.
        const githubId = imageUrl.split('/u/')[1]?.split('?')[0];
        if (!githubId) {
            throw new Error("Could not extract GitHub ID from image URL.");
        }

        const extensionMap: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/gif': 'gif', 'image/webp': 'webp' };
        const fileExtension = extensionMap[imageBlob.type] || 'jpg';
        const newFileName = `${githubId}.${fileExtension}`;
        const newUrl= `/api/avatars/${newFileName}`;

        try {
            const existingBlob = await head(newFileName);
            if (existingBlob.size === imageBuffer.byteLength) {
                return existingBlob.url;
            }
        } catch (e) {

        }

        // Save the new avatar. This will overwrite any existing file with the same name.
        const blob = await put(newFileName, imageBuffer, {
            access: 'public',
            addRandomSuffix: false, // keeps filename deterministic
            allowOverwrite: true,

        });

        //TODO Clean up for fs and vercel blob

        return blob.url
    } catch (error) {
        console.error("Failed to download or process avatar:", error);
        return null;
    }
}
