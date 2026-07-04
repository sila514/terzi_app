import { Request, Response } from 'express';
import { PrismaClient, ExpenseCategory } from '@prisma/client';

const prisma = new PrismaClient();

// Tüm giderleri getir
export const getExpenses = async (req: Request, res: Response) => {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: { expenseDate: 'desc' }
    });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Giderler getirilemedi' });
  }
};

// Yeni gider ekle
export const createExpense = async (req: Request, res: Response) => {
  try {
    const { category, amount, description, expenseDate } = req.body;
    const expense = await prisma.expense.create({
      data: {
        category: category as ExpenseCategory,
        amount: Number(amount),
        description,
        expenseDate: new Date(expenseDate)
      }
    });
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: 'Gider eklenemedi' });
  }
};

// Gider güncelle
export const updateExpense = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { category, amount, description, expenseDate } = req.body;
    const expense = await prisma.expense.update({
      where: { id },
      data: {
        category: category as ExpenseCategory,
        amount: Number(amount),
        description,
        expenseDate: new Date(expenseDate)
      }
    });
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: 'Gider güncellenemedi' });
  }
};

// Gider sil
export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.expense.delete({ where: { id } });
    res.json({ message: 'Gider silindi' });
  } catch (error) {
    res.status(500).json({ error: 'Gider silinemedi' });
  }
};

// Aylık gelir/gider özeti
export const getMonthlySummary = async (req: Request, res: Response) => {
  try {
    const { year, month } = req.query;
    const start = new Date(Number(year), Number(month) - 1, 1);
    const end = new Date(Number(year), Number(month), 1);

    // O aya ait giderler
    const expenses = await prisma.expense.findMany({
      where: { expenseDate: { gte: start, lt: end } }
    });

    // O aya ait ödemeler (gelir)
    const payments = await prisma.payment.findMany({
      where: { paidAt: { gte: start, lt: end } }
    });

    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalIncome = payments.reduce((sum, p) => sum + p.amount, 0);

    res.json({
      year: Number(year),
      month: Number(month),
      totalIncome,
      totalExpense,
      net: totalIncome - totalExpense,
      expenses,
      payments
    });
  } catch (error) {
    res.status(500).json({ error: 'Özet getirilemedi' });
  }
};