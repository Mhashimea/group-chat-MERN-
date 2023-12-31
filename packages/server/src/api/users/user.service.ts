import GroupMembers from "../../database/entities/GroupMembers";
import Users from "./../../database/entities/Users";

export class UserService {
  /**
   * List of the users
   * @param currentUser
   * @returns
   */
  public async listUsers(currentUser: any) {
    const users = await Users.find({ _id: { $ne: currentUser } });
    return users;
  }

  /**
   * Create new user
   * @param params
   * @returns
   */
  public async createUser(params: any) {
    const { name, email, password, avatar } = params;
    const payload = {
      name,
      email,
      password,
      avatar,
    };
    const newUser = new Users(payload);
    return await newUser.save();
  }

  /**
   * Get the user by email
   * @param email
   * @returns
   */
  public async getUserByEmail(email: string) {
    return await Users.findOne({ email });
  }

  /**
   * Get the user by id
   * @param id
   * @returns
   */
  public async getUserById(id: string) {
    return await Users.findById(id);
  }

  /**
   * Get the list of the users who are not belongs to group
   * @param group_id
   * @returns
   */
  public async listUnassignedUsers(group_id: string) {
    if (!group_id) throw new Error("group_id is required");

    // list of group members
    const groupMembers = await GroupMembers.find({ group_id });

    // list of users
    const users = await Users.find({
      _id: { $nin: groupMembers.map((member) => member.user_id) },
    });
    return users;
  }
}
