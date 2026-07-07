import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getSummary = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const totalRevenue = await prisma.payment.aggregate({ _sum: { amount: true } });
    const totalExpenses = await prisma.expense.aggregate({ _sum: { amount: true } });
    const monthlyRevenue = await prisma.payment.aggregate({
      where: { paidAt: { gte: startOfMonth } },
      _sum: { amount: true }
    });

    const unpaidOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: oneYearAgo },
        status: { not: "DELIVERED" },
      },
      include: { customer: true },
      orderBy: { createdAt: "desc" }
    });

    const totalUnpaid = unpaidOrders.reduce((sum, o) => sum + (o.price - o.depositPaid), 0);

    res.json({
      totalRevenue: totalRevenue._sum.amount || 0,
      totalExpenses: totalExpenses._sum.amount || 0,
      monthlyRevenue: monthlyRevenue._sum.amount || 0,
      totalUnpaid,
      unpaidOrders
    });
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası", detail: String(error) });
  }
};

export const getMonthly = async (req: Request, res: Response) => {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();
    const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
    const data = [];

    for (let i = 0; i < 12; i++) {
      const start = new Date(year, i, 1);
      const end = new Date(year, i + 1, 0);

      const revenue = await prisma.payment.aggregate({
        where: { paidAt: { gte: start, lte: end } },
        _sum: { amount: true }
      });

      const expenses = await prisma.expense.aggregate({
        where: { expenseDate: { gte: start, lte: end } },
        _sum: { amount: true }
      });

      data.push({
        month: months[i],
        revenue: revenue._sum.amount || 0,
        expenses: expenses._sum.amount || 0,
      });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası", detail: String(error) });
  }
};