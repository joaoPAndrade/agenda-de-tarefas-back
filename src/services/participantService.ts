import participantRepository from "../repositories/participantRepository";
import userService from "./userService";

interface User {
    id: number;
    name: string;
    email: string;
}
interface Group {
    id: number;
    name: string;
    description: string;
    ownerEmail: string;
}

class ParticipantService {

    public async getGroupsByParticipant(userEmail: string): Promise<{error?: string, groups?: Group []}> {

        const participantExists = userService.getUserByEmail(userEmail);

        if(!participantExists){
            return {error: 'Invalid user Email'};
        }

        const groupsData = await participantRepository.getGroupsByParticipant(userEmail);
        const groups: Group[] = groupsData.map(group => ({
            id: group.id,
            name: group.name,
            description: group.description,
            ownerEmail: group.ownerEmail,
        }));

        if (!groups || groups.length === 0) {
            return { error: `No groups found for participant with email ${userEmail}` };
        }

        return { groups };

    }



}

export default new ParticipantService()