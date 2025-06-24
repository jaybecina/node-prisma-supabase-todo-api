import { Request, Response } from 'express';
import prisma from '../config/prisma';

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export const createTodo = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'Authentication required',
        details: 'User ID not found in request',
      });
    }

    if (!title) {
      return res.status(400).json({
        message: 'Title is required',
        details: 'Please provide a title for the todo',
      });
    }

    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        userId,
      },
    });

    return res.status(201).json({
      message: 'Todo created successfully',
      todo,
    });
  } catch (error) {
    console.error('Create todo error:', error);
    return res.status(500).json({
      message: 'Failed to create todo',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getTodos = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'Authentication required',
        details: 'User ID not found in request',
      });
    }

    const todos = await prisma.todo.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.json({ todos });
  } catch (error) {
    console.error('Get todos error:', error);
    return res.status(500).json({
      message: 'Failed to fetch todos',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getTodoById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'Authentication required',
        details: 'User ID not found in request',
      });
    }

    const todo = await prisma.todo.findUnique({
      where: {
        id,
      },
    });

    if (!todo) {
      return res.status(404).json({
        message: 'Todo not found',
        details: `No todo found with id: ${id}`,
      });
    }

    if (todo.userId !== userId) {
      return res.status(403).json({
        message: 'Access denied',
        details: 'You do not have permission to access this todo',
      });
    }

    return res.json({ todo });
  } catch (error) {
    console.error('Get todo by id error:', error);
    return res.status(500).json({
      message: 'Failed to fetch todo',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const updateTodo = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'Authentication required',
        details: 'User ID not found in request',
      });
    }

    const existingTodo = await prisma.todo.findUnique({
      where: {
        id,
      },
    });

    if (!existingTodo) {
      return res.status(404).json({
        message: 'Todo not found',
        details: `No todo found with id: ${id}`,
      });
    }

    if (existingTodo.userId !== userId) {
      return res.status(403).json({
        message: 'Access denied',
        details: 'You do not have permission to update this todo',
      });
    }

    const updatedTodo = await prisma.todo.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        completed,
      },
    });

    return res.json({
      message: 'Todo updated successfully',
      todo: updatedTodo,
    });
  } catch (error) {
    console.error('Update todo error:', error);
    return res.status(500).json({
      message: 'Failed to update todo',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const deleteTodo = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'Authentication required',
        details: 'User ID not found in request',
      });
    }

    const existingTodo = await prisma.todo.findUnique({
      where: {
        id,
      },
    });

    if (!existingTodo) {
      return res.status(404).json({
        message: 'Todo not found',
        details: `No todo found with id: ${id}`,
      });
    }

    if (existingTodo.userId !== userId) {
      return res.status(403).json({
        message: 'Access denied',
        details: 'You do not have permission to delete this todo',
      });
    }

    await prisma.todo.delete({
      where: {
        id,
      },
    });

    return res.json({
      message: 'Todo deleted successfully',
    });
  } catch (error) {
    console.error('Delete todo error:', error);
    return res.status(500).json({
      message: 'Failed to delete todo',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
