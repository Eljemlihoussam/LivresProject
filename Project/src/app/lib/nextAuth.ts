// lib/auth.ts
import { type AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import * as bcrypt from "bcrypt";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "../../app/lib/prisma";

export const authOptions: AuthOptions = {
  // ⚠️ IMPORTANT: Utiliser JWT pour Credentials Provider
  session: {
    strategy: "jwt", // Changé de "database" à "jwt"
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },

  // Adapter seulement pour Google OAuth
  adapter: PrismaAdapter(prisma),
  
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    // Email + Mot de passe
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("🔍 Tentative de connexion pour:", credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Email ou mot de passe manquant");
          throw new Error("Email et mot de passe requis");
        }

        try {
          // Chercher l'utilisateur
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            console.log("❌ Utilisateur non trouvé:", credentials.email);
            throw new Error("Email ou mot de passe incorrect");
          }

          // Vérifier le mot de passe
          console.log("🔐 Vérification du mot de passe...");
          
          // Si le mot de passe est haché avec bcrypt
          let isPasswordValid = false;
          
          if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
            // Mot de passe haché
            isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          } else {
            // Mot de passe en clair (à éviter en production!)
            isPasswordValid = credentials.password === user.password;
          }

          if (!isPasswordValid) {
            console.log("❌ Mot de passe incorrect");
            throw new Error("Email ou mot de passe incorrect");
          }

          console.log("✅ Connexion réussie pour:", user.email);
          
          // Retourner l'utilisateur
          return {
            id: user.id,
            email: user.email,
            name: user.username || user.first_name + ' ' + user.last_name,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            role: user.role,
            image: user.profile_picture_url,
          };
        } catch (error) {
          console.error("💥 Erreur lors de l'authentification:", error);
          throw error;
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("📝 Callback signIn - Provider:", account?.provider);
      
      if (account?.provider === "google") {
        try {
          // Vérifier si l'utilisateur Google existe
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (!existingUser) {
            console.log("👤 Création d'un nouvel utilisateur Google");
            await prisma.user.create({
              data: {
                email: user.email!,
                username: user.name || user.email!.split('@')[0],
                first_name: profile?.given_name || '',
                last_name: profile?.family_name || '',
                profile_picture_url: user.image,
                role: 'USER',
                password: '', // Pas de mot de passe pour OAuth
              },
            });
          }
        } catch (error) {
          console.error("❌ Erreur création utilisateur Google:", error);
          return false;
        }
      }
      
      return true;
    },

    async jwt({ token, user, account }) {
      console.log("🔗 Callback JWT");
      
      // Première connexion
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.username = (user as any).username;
        token.first_name = (user as any).first_name;
        token.last_name = (user as any).last_name;
      }
      
      return token;
    },

    async session({ session, token }) {
      console.log("📊 Callback Session");
      
      // Ajouter les infos du token à la session
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).username = token.username;
        (session.user as any).first_name = token.first_name;
        (session.user as any).last_name = token.last_name;
      }
      
      return session;
    },
  },

  pages: {
    signIn: '/signin',
    error: '/auth/error',
  },

  events: {
    async signIn({ user, account }) {
      console.log(`✅ Connexion réussie: ${user.email} via ${account?.provider}`);
    },
    async signOut() {
      console.log(`👋 Déconnexion`);
    },
  },

  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
};