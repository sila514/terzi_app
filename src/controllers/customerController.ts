import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const customers = await prisma.customer.findMany({
      where: search ? {
        OR: [
          { name: { contains: String(search), mode: "insensitive" } },
          { phone: { contains: String(search), mode: "insensitive" } },
        ]
      } : undefined,
      orderBy: { createdAt: "desc" }
    });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası", detail: String(error) });
  }
};

export const getCustomer = async (req: Request, res: Response) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        orders: {
          include: { payments: true, employee: true },
          orderBy: { createdAt: "desc" }
        }
      }
    });
    if (!customer) return res.status(404).json({ error: "Müşteri bulunamadı" });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası", detail: String(error) });
  }
};

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { name, phone, email, height, weight, chest, waist, hip, shoulder, armLength, legLength, notes } = req.body;
    const customer = await prisma.customer.create({
      data: { name, phone, email, height, weight, chest, waist, hip, shoulder, armLength, legLength, notes }
    });
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası", detail: String(error) });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const customer = await prisma.customer.update({
      where: { id: Number(req.params.id) },
      data: req.body
    });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası", detail: String(error) });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    await prisma.customer.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: "Müşteri silindi" });
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası", detail: String(error) });
  }
};