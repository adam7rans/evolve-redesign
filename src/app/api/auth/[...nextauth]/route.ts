import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true
    },
    async redirect({ url, baseUrl }) {
      console.log('NextAuth redirect - Original URL:', url);
      
      // Extract planId and interval from the original URL
      const urlParams = new URL(url).searchParams;
      const planId = urlParams.get('planId');
      const interval = urlParams.get('interval');
      
      console.log('NextAuth redirect - Extracted params:', { planId, interval });

      // Construct the payment URL with parameters
      const paymentUrl = new URL('/checkout/payment', baseUrl);
      if (planId) paymentUrl.searchParams.set('planId', planId);
      if (interval) paymentUrl.searchParams.set('interval', interval);

      console.log('NextAuth redirect - Constructed payment URL:', paymentUrl.toString());

      return paymentUrl.toString();
    },
  },
  pages: {
    signIn: '/login',
  },
})

export { handler as GET, handler as POST }