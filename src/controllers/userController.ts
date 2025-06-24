import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import prisma from '../config/prisma';
import bcrypt from 'bcryptjs';

// Simple email validation function
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        message: 'Email, password, and name are required',
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: 'Please provide a valid email address',
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'User with this email already exists',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    });

    if (authError) {
      console.error('Supabase auth error:', authError);

      if (authError.message.includes('Email')) {
        return res.status(400).json({
          message: 'Please provide a valid email address',
          details: authError.message,
        });
      }

      if (authError.message.includes('Password')) {
        return res.status(400).json({
          message: 'Password must be at least 6 characters long',
          details: authError.message,
        });
      }

      return res.status(400).json({
        message: 'Registration failed',
        details: authError.message,
      });
    }

    if (!authData.user) {
      return res.status(400).json({
        message: 'User creation failed',
        details: 'No user data returned from authentication service',
      });
    }

    const user = await prisma.user.create({
      data: {
        id: authData.user.id,
        email,
        password: hashedPassword,
        name,
      },
    });

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      message: 'Internal server error during registration',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
        details: 'Please provide both email and password',
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: 'Invalid email format',
        details: 'Please provide a valid email address',
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error);

      // Handle specific Supabase error codes
      switch (error.message) {
        case 'Email not confirmed':
          return res.status(401).json({
            message: 'Please verify your email before logging in',
            details: error.message,
          });

        case 'Invalid login credentials':
          return res.status(401).json({
            message: 'Invalid email or password',
            details: 'Please check your credentials and try again',
          });

        case 'Email address not confirmed':
          return res.status(401).json({
            message: 'Email not verified',
            details: 'Please check your email for verification link',
          });

        case 'Invalid email or password':
          return res.status(401).json({
            message: 'Invalid credentials',
            details: 'The email or password you entered is incorrect',
          });

        default:
          return res.status(401).json({
            message: 'Login failed',
            details: error.message,
          });
      }
    }

    if (!data.user) {
      return res.status(401).json({
        message: 'Login failed',
        details: 'No user data returned from authentication service',
      });
    }

    return res.json({
      message: 'Login successful',
      token: data.session?.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      message: 'Internal server error during login',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const logout = async (_req: Request, res: Response) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout error:', error);
      return res.status(400).json({
        message: 'Logout failed',
        details: error.message,
      });
    }

    return res.json({
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      message: 'Internal server error during logout',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
