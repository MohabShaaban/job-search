import { GraphQLObjectType, GraphQLSchema, GraphQLList, GraphQLID, GraphQLString, GraphQLBoolean } from 'graphql';
import { User } from '../../database/models/user.model.js';
import { Company } from '../../database/models/company.model.js';

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        status: { type: GraphQLString }
    })
});

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({
        id: { type: GraphQLID },
        companyName: { type: GraphQLString },
        status: { type: GraphQLString },
        approved: { type: GraphQLBoolean }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return User.find();
            }
        },
        companies: {
            type: new GraphQLList(CompanyType),
            resolve(parent, args) {
                return Company.find();
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        banUser: {
            type: UserType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return User.findByIdAndUpdate(args.id, { status: 'banned' }, { new: true });
            }
        },
        unbanUser: {
            type: UserType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return User.findByIdAndUpdate(args.id, { status: 'active' }, { new: true });
            }
        },
        banCompany: {
            type: CompanyType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Company.findByIdAndUpdate(args.id, { status: 'banned' }, { new: true });
            }
        },
        unbanCompany: {
            type: CompanyType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Company.findByIdAndUpdate(args.id, { status: 'active' }, { new: true });
            }
        },
        approveCompany: {
            type: CompanyType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Company.findByIdAndUpdate(args.id, { approved: true }, { new: true });
            }
        }
    }
});

export default new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
