import groupRepository from '../repositories/groupRepository';
import { groupSchema, partialGroupSchema } from '../validation/groupValidationSchema';
import jwt from 'jsonwebtoken';
import config from '../config';
import userService from './userService';
interface Group {
    name: string;
    description: string;
    ownerEmail: string;
}
interface User {
    id: number;
    name: string;
    email: string;
}
class GroupService {
    public async getAllGroups() {

        const groups = await groupRepository.findAllGroups();
        return groups
    }

    public async getGroupById(id: number): Promise<{ error?: string, group?: Group }> {
        const group = await groupRepository.findGroupById(id);

        if (group == null) {
            return { error: `Group with id ${id} not found!` };
        }

        return { group: group };
    }

    public async createGroup(newGroup: Group): Promise<{ error?: string, group?: Group}> {
        userService.getUserByEmail(newGroup.ownerEmail);

        const { error } = groupSchema.validate(newGroup);

        if (error) {
            return { error: `Validation error: ${error.details[0].message}` };
        }

        const createdGroup = await groupRepository.createGroup(newGroup);

        return { group: createdGroup };
    }


    public async updateGroup(id: number, data: Partial<Group>): Promise<{ error?: string, group?: Group }> {
        const { error } = partialGroupSchema.validate(data);
        if (error) {
            return { error: `Validation error: ${error.details[0].message}` };
        }

        const group = await groupRepository.findGroupById(id);
        if (!group) {
            return { error: `Group with id ${id} not found!` };
        }

        const updatedGroup = await groupRepository.updateGroup(id, data);
        return { group: updatedGroup };
    }

    public async deleteGroup(id: number): Promise<{ error?: string, group?: Group }> {
        const group = await groupRepository.findGroupById(id);
        if (!group) {
            return { error: `Group with id ${id} not found!` }
        }

        const deletedGroup = await groupRepository.deleteGroup(id);

        return { group: deletedGroup };
    }

    public async getParticipantsByGroup(id: number): Promise<{ error?: string, participants?: { name: string, email: string }[] }> {
        const group = await groupRepository.findGroupById(id);

        if (!group) {
            return { error: `Group with id ${id} not found!` };
        }

        const result = await groupRepository.findParticipantsByGroup(id);
        const participantData = result?.participants.map(p => ({
            name: p.user.name,
            email: p.user.email
        })) || [];
        return { participants: participantData };

    }

    public async addParticipantToGroup(groupId: number, userEmail: string): Promise<{ error?: string, void?: any }> {
        const group = await groupRepository.findGroupById(groupId);

        if (!group) {
            return { error: `Group with id ${groupId} not found!` };
        }

        const userResult = await userService.getUserByEmail(userEmail);

        if (!userResult.user) {
            return { error: `User with email ${userEmail} not found!` };
        }

        const participants = await groupRepository.findParticipantsByGroup(groupId);

        if (participants?.participants.find(p => p.user.email === userEmail)) {
            return { error: `User with email ${userEmail} is already a participant of this group!` };
        }
        

        const updatedGroup = await groupRepository.addParticipantToGroup(groupId, userResult.user.id);

        return {void: null};
    }

    public async removeParticipantFromGroup(groupId: number, userEmail: string): Promise<{ error?: string, message?: string, count?: number }> {
        const group = await groupRepository.findGroupById(groupId);

        if (!group) {
            return { error: `Group with id ${groupId} not found!` };
        }

        const userResult = await userService.getUserByEmail(userEmail);

        if (!userResult.user) {
            return { error: `User with email ${userEmail} not found!` };
        }

        const userExists = await groupRepository.findParticipantsByIdByGroup(groupId, userEmail);

        if (!userExists) {
            return { error: `User with email ${userEmail} is not a participant of this group!` };
        }

        const { count } = await groupRepository.removeParticipantFromGroup(groupId, userEmail);

        return { message: "Participant removed successfully", count };

    }

}

export default new GroupService();