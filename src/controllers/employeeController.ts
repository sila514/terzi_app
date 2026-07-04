import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        orders: {
          where: { status: { not: "DELIVERED" } },
          include: { customer: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası", detail: String(error) });
  }
};

export const getEmployee = async (req: Request, res: Response) => {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        orders: {
          include: { customer: true, payments: true },
          orderBy: { createdAt: "desc" }
        }
      }
    });
    if (!employee) return res.status(404).json({ error: "Çalışan bulunamadı" });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası", detail: String(error) });
  }
};

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const { name, phone, userId } = req.body;
    const employee = await prisma.employee.create({
      data: { name, phone, userId: Number(userId) }
    });
    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası", detail: String(error) });
  }
};

export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const employee = await prisma.employee.update({
      where: { id: Number(req.params.id) },
      data: req.body
    });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası", detail: String(error) });
  }
};

export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    await prisma.employee.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: "Çalışan silindi" });
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası", detail: String(error) });
  }
};

export const getEmployeeOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: { employeeId: Number(req.params.id) },
      include: { customer: true, payments: true },
      orderBy: { createdAt: "desc" }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası", detail: String(error) });
  }
};