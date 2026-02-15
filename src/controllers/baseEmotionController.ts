import { Request, Response } from "express";
import * as BaseEmotionService from "@/services/baseEmotionService";
import {
  CreateBaseEmotionInput,
  UpdateBaseEmotionInput,
} from "@/schemas/baseEmotion";

type IdParams = { id: string };

/**
 * POST /api/base-emotions
 */
export const createBaseEmotion = async (req: Request, res: Response) => {
  try {
    const data = req.body as CreateBaseEmotionInput;
    const baseEmotion = await BaseEmotionService.createBaseEmotion(data);

    res.status(201).json({
      success: true,
      data: baseEmotion,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "BASE_EMOTION_NAME_ALREADY_EXISTS"
    ) {
      return res.status(409).json({
        success: false,
        message: "A base emotion with this name already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error creating base emotion",
    });
  }
};

/**
 * GET /api/base-emotions
 */
export const getAllBaseEmotions = async (req: Request, res: Response) => {
  try {
    const baseEmotions = await BaseEmotionService.getAllBaseEmotions();

    res.status(200).json({
      success: true,
      data: baseEmotions,
      count: baseEmotions.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving base emotions",
    });
  }
};

/**
 * GET /api/base-emotions/:id
 */
export const getBaseEmotionById = async (
  req: Request<IdParams>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const baseEmotion = await BaseEmotionService.getBaseEmotionById(id);

    res.status(200).json({
      success: true,
      data: baseEmotion,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "BASE_EMOTION_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Base emotion not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error retrieving base emotion",
    });
  }
};

/**
 * PUT /api/base-emotions/:id
 */
export const updateBaseEmotion = async (
  req: Request<IdParams>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const data = req.body as UpdateBaseEmotionInput;
    const baseEmotion = await BaseEmotionService.updateBaseEmotion(id, data);

    res.status(200).json({
      success: true,
      data: baseEmotion,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "BASE_EMOTION_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: "Base emotion not found",
        });
      }

      if (error.message === "BASE_EMOTION_NAME_ALREADY_EXISTS") {
        return res.status(409).json({
          success: false,
          message: "A base emotion with this name already exists",
        });
      }
    }

    res.status(500).json({
      success: false,
      message: "Error updating base emotion",
    });
  }
};

/**
 * DELETE /api/base-emotions/:id
 */
export const deleteBaseEmotion = async (
  req: Request<IdParams>,
  res: Response
) => {
  try {
    const { id } = req.params;
    await BaseEmotionService.deleteBaseEmotion(id);

    res.status(200).json({
      success: true,
      message: "Base emotion deleted successfully",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "BASE_EMOTION_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Base emotion not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error deleting base emotion",
    });
  }
};

/**
 * GET /api/base-emotions/search?q=query
 */
export const searchBaseEmotions = async (req: Request, res: Response) => {
  try {
    const query = (req as any).validatedQuery?.q || "";
    const baseEmotions = await BaseEmotionService.searchBaseEmotions(query);

    res.status(200).json({
      success: true,
      data: baseEmotions,
      count: baseEmotions.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching base emotions",
    });
  }
};
