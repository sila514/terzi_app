import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getOrders = async (req: Request, res: Response) => {
  try {
    const { status, employeeId } = req.query;
    const orders = await prisma.order.findMany({
      where: {
        ...(status ? { status: String(status) as any } : {}),
        ...(employeeId ? { employeeId: Number(employeeId) } : {}),
      },
      include: {
        customer: true,
        employee: true,
        payments: true,
      },
      orderBy: { createdAt: "desc" }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası", detail: String(error) });
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(req.params.id) },
      include: { customer: true, employee: true, payments: true }
    });
    if (!order) return res.status(404).json({ error: "Sipariş bulunamadı" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası", detail: String(error) });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { customerId, employeeId, description, modelNotes, price, depositPaid, deliveryDate, photoUrl } = req.body;
    const order = await prisma.order.create({
      data: {
        customerId: Number(customerId),
        employeeId: employeeId ? Number(employeeId) : null,
        description,
        modelNotes,
        price: Number(price),
        depositPaid: Number(depositPaid || 0),
        deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
        photoUrl
      },
      include: { customer: true, employee: true }
    });
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası", detail: String(error) });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.update({
      where: { id: Number(req.params.id) },
      data: req.body,
      include: { customer: true, employee: true, payments: true }
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası", detail: String(error) });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const order = await prisma.order.update({
      where: { id: Number(req.params.id) },
      data: {
        status,
        ...(status === "DELIVERED" ? { deliveredAt: new Date() } : {})
      }
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası", detail: String(error) });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    await prisma.order.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: "Sipariş silindi" });
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası", detail: String(error) });
  }
};

export const getOverdueOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        deliveryDate: { lt: new Date() },
        status: { not: "DELIVERED" }
      },
      include: { customer: true, employee: true }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası", detail: String(error) });
  }
};