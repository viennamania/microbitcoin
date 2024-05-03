import NextAuth from 'next-auth';

///import { authOptions } from './auth-options';
import { authOptions } from './auth-options-vienna';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
