import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    authorized({ req, token }) {
      console.log("testr", req, token);
      if (token) return true; // If there is a token, the user is authenticated
    },
  },
});
