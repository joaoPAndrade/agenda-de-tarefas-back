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

        if (!group) {
            return { error: `Group with id ${id} not found!` };
        }

        return { group: group };
    }

    public async createGroup(newGroup: Group): Promise<{ error?: string, group?: Group; token?: string }> {

        userService.getUserByEmail(newGroup.ownerEmail);

        const { error } = groupSchema.validate(newGroup);

        if (error) {
            return { error: `Validation error: ${error.details[0].message}` };
        }

        const createdGroup = await groupRepository.createGroup(newGroup);

        const token = jwt.sign({ id: createdGroup.id, name: createdGroup.name }, config.jwtSecret, { expiresIn: '1h' });
        return { group: createdGroup, token };
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

        const participants = await groupRepository.findParticipantsByGroup(id);

        const participantData = participants ? participants.participants.map(p => ({
            name: p.user.name,
            email: p.user.email
        })) : [];
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

        const updatedGroup = await groupRepository.addParticipantToGroup(groupId, userResult.user.id);

        return {void: null};
    }

}

export default new GroupService();