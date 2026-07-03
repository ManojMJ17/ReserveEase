import bcrypt from 'bcrypt';
import { User, IUser } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { generateAccessToken } from '../utils/jwt.js';
import { Role } from '../constants/roles.js';

export class AuthService {
    /**
     * Registers a new customer user and returns access token.
     * @param userData Registration input (name, email, password)
     */
    static async register(userData: Partial<IUser>) {
        const { name, email, password } = userData;

        if (!name || !email || !password) {
            throw new ApiError(400, 'Name, email, and password are required');
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ApiError(409, 'A user with this email address already exists');
        }

        // Hash password before saving (do NOT hash inside model)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save new user document to db
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: Role.CUSTOMER // Default register role is customer
        });

        // Convert to plain object and remove password property
        const userObj = user.toObject();
        delete userObj.password;

        // Generate access token
        const token = generateAccessToken({
            id: user._id.toString(),
            role: user.role,
            email: user.email
        });

        return { user: userObj, token };
    }

    /**
     * Validates credentials and generates an access token.
     * @param credentials Login credentials (email, password)
     */
    static async login(credentials: Partial<IUser>) {
        const { email, password } = credentials;

        if (!email || !password) {
            throw new ApiError(400, 'Email and password are required');
        }

        // Fetch user from DB
        const user = await User.findOne({ email });
        if (!user) {
            throw new ApiError(401, 'Invalid email or password');
        }

        // Compare password input with stored hash
        const isMatch = await bcrypt.compare(password, user.password!);
        if (!isMatch) {
            throw new ApiError(401, 'Invalid email or password');
        }

        // Convert to plain object and remove password property
        const userObj = user.toObject();
        delete userObj.password;

        // Generate access token
        const token = generateAccessToken({
            id: user._id.toString(),
            role: user.role,
            email: user.email
        });

        return { user: userObj, token };
    }

    /**
     * Retrieves the profile of the current authenticated user.
     * @param userId The User ID
     */
    static async getCurrentUser(userId: string) {
        if (!userId) {
            throw new ApiError(400, 'User ID is required');
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            throw new ApiError(404, 'User profile not found');
        }

        return user;
    }
}
