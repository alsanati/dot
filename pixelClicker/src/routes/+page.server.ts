import { getUsers } from '$lib/db/schema';

export async function load() {
    const rawData = await getUsers();

    // Ensure that rawData is an array before calling .map()
    if (Array.isArray(rawData)) {
        const users = rawData.map(user => {
            // Adjust according to the actual structure of your user objects
            return {
                id: user.id,
                name: user.name,
                // add other fields as necessary
            };
        });

        return {
            props: {
                data: {
                    users
                }
            }
        };
    } else {
        // Handle case where rawData is not an array
        console.error('getUsers did not return an array');
        return {
            props: {
                data: {
                    users: []
                }
            }
        };
    }
}
