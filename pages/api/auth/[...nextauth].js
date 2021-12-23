import { PlusCircleIcon } from "@heroicons/react/outline"
import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import { refreshAccessToken } from "spotify-web-api-node/src/server-methods"
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify"

async function refreshAccessToken(token) {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);

    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
    console.log("Refreshed", refreshedToken)

    return {
      ...token,
      accessToken: refreshedToken.accessToken,
      accessTokenExpries: Date.now + refreshedToken.expires_in * 1000,
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken,

    };

  } catch (error) {

    console.log(error)

    return {
      ...token,
      error: ''
    }
  }
}


export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL,
    //   authorization:
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/login',
  },

  callbacks: {
    async jwt({ token, account, user}){
      // initial signin

      if(account && user) {
        return{
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpries: account.expires_at * 1000,
        }
      }
      // Return previous token if the access token has not expired yet
      if(Date.now() < token.accessTokeExpries) {
        console.log("Existing token is valid");
        return token;
      }

      // Access token has expired. Need to refresh
      console.log("Access token has expired");
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.username = token.username;

      return session;
    }
  }
})