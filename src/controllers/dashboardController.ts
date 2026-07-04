import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Bugün teslim edilecek siparişler
    const todayDeliveries = await prisma.order.findMany({
      where: {
        deliveryDate: {
          gte: new Date(today.setHours(0, 0, 0, 0)),
          lte: new Date(today.setHours(23, 59, 59, 999))
        },
        status: { not: "DELIVERED" }
      },
      include: { customer: true }
    });

    // Aktif sipariş sayısı
    const activeOrders = await prisma.order.count({
      where: { status: { not: "DELIVERED" } }
    });

    // Geciken siparişler
    const overdueOrders = await prisma.order.findMany({
      where: {
        deliveryDate: { lt: new Date() },
        status: { not: "DELIVERED" }
      },
      include: { customer: true }
    });

    // Bu ay tahsil edilen ödemeler
    const monthlyPayments = await prisma.payment.aggregate({
      where: {
        paidAt: { gte: startOfMonth, lte: endOfMonth }
      },
      _sum: { amount: true }
    });

    // Bu ay toplam sipariş tutarı
    const monthlyOrders = await prisma.order.aggregate({
      where: {
        createdAt: { gte: startOfMonth, lte: endOfMonth }
      },
      _sum: { price: true }
    });

    // Tamamlanmamış ödemeler (bakiyesi olanlar)
    const unpaidOrders = await prisma.order.findMany({
      where: {
        status: { not: "DELIVERED" },
        depositPaid: { lt: prisma.order.fields.price }
      },
      include: { customer: true }
    });

    res.json({
      todayDeliveries,
      activeOrders,
      overdueOrders,
      monthlyRevenue: monthlyPayments._sum.amount || 0,
      monthlyOrderTotal: monthlyOrders._sum.price || 0,
      unpaidOrdersCount: unpaidOrders.length
    });
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası", detail: String(error) });
  }
};