import { describe, it, expect, vi, beforeEach } from "vitest";
import { prisma } from "@/config/database";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  searchCategories,
} from "@/services/categoryService";

vi.mock("@/config/database", () => ({
  prisma: {
    category: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

const prismaMock = prisma as unknown as {
  category: {
    findUnique: ReturnType<typeof vi.fn>;
    findMany: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
};

const mockCategory = {
  id: "cuid-1",
  name: "Stress",
  color: "#FF5733",
  iconName: "stress-icon",
  description: "Catégorie liée au stress",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
};

describe("categoryService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---------------------------------------------------------------------------
  // createCategory
  // ---------------------------------------------------------------------------
  describe("createCategory", () => {
    it("crée une catégorie avec succès", async () => {
      prismaMock.category.findUnique.mockResolvedValue(null);
      prismaMock.category.create.mockResolvedValue(mockCategory);

      const result = await createCategory({
        name: "Stress",
        color: "#FF5733",
        iconName: "stress-icon",
        description: "Catégorie liée au stress",
      });

      expect(prismaMock.category.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { name: "Stress" } })
      );
      expect(prismaMock.category.create).toHaveBeenCalled();
      expect(result).toEqual(mockCategory);
    });

    it("throws CATEGORY_NAME_ALREADY_EXISTS si le nom est déjà pris", async () => {
      prismaMock.category.findUnique.mockResolvedValue({ id: "cuid-existing" });

      await expect(
        createCategory({
          name: "Stress",
          color: "#FF5733",
          iconName: "stress-icon",
        })
      ).rejects.toThrow("CATEGORY_NAME_ALREADY_EXISTS");

      expect(prismaMock.category.create).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // getAllCategories
  // ---------------------------------------------------------------------------
  describe("getAllCategories", () => {
    it("retourne toutes les catégories triées par nom", async () => {
      prismaMock.category.findMany.mockResolvedValue([mockCategory]);

      const result = await getAllCategories();

      expect(prismaMock.category.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { name: "asc" } })
      );
      expect(result).toEqual([mockCategory]);
    });
  });

  // ---------------------------------------------------------------------------
  // getCategoryById
  // ---------------------------------------------------------------------------
  describe("getCategoryById", () => {
    it("retourne la catégorie correspondant à l'id", async () => {
      prismaMock.category.findUnique.mockResolvedValue(mockCategory);

      const result = await getCategoryById("cuid-1");

      expect(prismaMock.category.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: "cuid-1" } })
      );
      expect(result).toEqual(mockCategory);
    });

    it("throws CATEGORY_NOT_FOUND si aucune catégorie ne correspond", async () => {
      prismaMock.category.findUnique.mockResolvedValue(null);

      await expect(getCategoryById("non-existent")).rejects.toThrow(
        "CATEGORY_NOT_FOUND"
      );
    });
  });

  // ---------------------------------------------------------------------------
  // updateCategory
  // ---------------------------------------------------------------------------
  describe("updateCategory", () => {
    it("met à jour une catégorie avec succès", async () => {
      const updated = { ...mockCategory, name: "Anxiété" };
      prismaMock.category.findUnique.mockResolvedValueOnce(mockCategory);
      prismaMock.category.update.mockResolvedValue(updated);

      const result = await updateCategory("cuid-1", { name: "Anxiété" });

      expect(prismaMock.category.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: "cuid-1" } })
      );
      expect(result).toEqual(updated);
    });

    it("throws CATEGORY_NOT_FOUND si la catégorie n'existe pas", async () => {
      prismaMock.category.findUnique.mockResolvedValue(null);

      await expect(updateCategory("non-existent", { name: "Anxiété" })).rejects.toThrow(
        "CATEGORY_NOT_FOUND"
      );
    });

    it("throws CATEGORY_NAME_ALREADY_EXISTS si le nouveau nom est déjà pris", async () => {
      prismaMock.category.findUnique
        .mockResolvedValueOnce(mockCategory)
        .mockResolvedValueOnce({ id: "cuid-other" });

      await expect(
        updateCategory("cuid-1", { name: "Joie" })
      ).rejects.toThrow("CATEGORY_NAME_ALREADY_EXISTS");

      expect(prismaMock.category.update).not.toHaveBeenCalled();
    });

    it("ne vérifie pas l'unicité du nom si le nom n'a pas changé", async () => {
      prismaMock.category.findUnique.mockResolvedValueOnce(mockCategory);
      prismaMock.category.update.mockResolvedValue(mockCategory);

      await updateCategory("cuid-1", { name: "Stress" });

      // findUnique n'est appelé qu'une seule fois (vérification existence)
      expect(prismaMock.category.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.category.update).toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // deleteCategory
  // ---------------------------------------------------------------------------
  describe("deleteCategory", () => {
    it("supprime une catégorie avec succès", async () => {
      prismaMock.category.findUnique.mockResolvedValue({ id: "cuid-1" });
      prismaMock.category.delete.mockResolvedValue(mockCategory);

      await deleteCategory("cuid-1");

      expect(prismaMock.category.delete).toHaveBeenCalledWith({
        where: { id: "cuid-1" },
      });
    });

    it("throws CATEGORY_NOT_FOUND si la catégorie n'existe pas", async () => {
      prismaMock.category.findUnique.mockResolvedValue(null);

      await expect(deleteCategory("non-existent")).rejects.toThrow(
        "CATEGORY_NOT_FOUND"
      );

      expect(prismaMock.category.delete).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // searchCategories
  // ---------------------------------------------------------------------------
  describe("searchCategories", () => {
    it("retourne toutes les catégories quand la query est vide", async () => {
      prismaMock.category.findMany.mockResolvedValue([mockCategory]);

      const result = await searchCategories("");

      const callArg = prismaMock.category.findMany.mock.calls[0][0];
      expect(callArg.where).toBeUndefined();
      expect(result).toEqual([mockCategory]);
    });

    it("retourne toutes les catégories quand la query ne contient que des espaces", async () => {
      prismaMock.category.findMany.mockResolvedValue([mockCategory]);

      await searchCategories("   ");

      const callArg = prismaMock.category.findMany.mock.calls[0][0];
      expect(callArg.where).toBeUndefined();
    });

    it("filtre les catégories par nom ou description", async () => {
      prismaMock.category.findMany.mockResolvedValue([mockCategory]);

      const result = await searchCategories("stress");

      const callArg = prismaMock.category.findMany.mock.calls[0][0];
      expect(callArg.where).toBeDefined();
      expect(result).toEqual([mockCategory]);
    });
  });
});
