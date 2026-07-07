import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getOrderPayments = async (req: Request, res: Response) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { orderId: Number(req.params.orderId) },
      orderBy: { paidAt: "desc" }
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası", detail: String(error) });
  }
};

export const createPayment = async (req: Request, res: Response) => {
  try {
    const { orderId, amount, type, note } = req.body;

    const payment = await prisma.payment.create({
      data: {
        orderId: Number(orderId),
        amount: Number(amount),
        type,
        note
      }
    });

    // Siparişin depositPaid alanını güncelle
    const order = await prisma.order.findUnique({ where: { id: Number(orderId) } });
    if (order) {
      await prisma.order.update({
        where: { id: Number(orderId) },
        data: { depositPaid: order.depositPaid + Number(amount) }
      });
    }

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası", detail: String(error) });
  }
};

export const deletePayment = async (req: Request, res: Response) => {
  try {
    await prisma.payment.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: "Ödeme silindi" });
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası", detail: String(error) });
  }
};