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
      include: { orders: true },
      orderBy: { createdAt: "desc" }
    });
    res.json(customers);
  } catch (error) {
    console.error(error);
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
    console.error(error);
    res.status(500).json({ error: "Sunucu hatası", detail: String(error) });
  }
};

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { name, phone, email, notes } = req.body;
    const height = req.body.height ? Number(req.body.height) : null;
    const weight = req.body.weight ? Number(req.body.weight) : null;
    const chest = req.body.chest ? Number(req.body.chest) : null;
    const waist = req.body.waist ? Number(req.body.waist) : null;
    const hip = req.body.hip ? Number(req.body.hip) : null;
    const shoulder = req.body.shoulder ? Number(req.body.shoulder) : null;
    const armLength = req.body.armLength ? Number(req.body.armLength) : null;
    const legLength = req.body.legLength ? Number(req.body.legLength) : null;

    const customer = await prisma.customer.create({
      data: {
        name,
        phone: phone || null,
        email: email || null,
        notes: notes || null,
        height,
        weight,
        chest,
        waist,
        hip,
        shoulder,
        armLength,
        legLength,
      }
    });
    res.status(201).json(customer);
  } catch (error) {
    console.error(error);
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
    console.error(error);
    res.status(500).json({ error: "Sunucu hatası", detail: String(error) });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    await prisma.customer.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: "Müşteri silindi" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Sunucu hatası", detail: String(error) });
  }
};